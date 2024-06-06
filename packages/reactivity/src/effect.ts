import { extend, isArray } from '@vue/shared'
import { Dep, createDep } from './dep'
import { ComputedRefImpl } from './computed'

/**
 * 全局单例，表示正在被激活的effect实例，手机依赖的关键桥梁
 */
export let activeEffect: ReactiveEffect | undefined

/**
 * @description 响应触发的执行类，某个属性改变时，会触发run方法，而run方法中收集的是fn方法，也就是依赖收集时该属性收集的依赖方法
 * @author dengyong
 * @date 30/03/2023
 * @class ReactiveEffect
 * @constructor fn--依赖收集和触发时需要执行的方法
 * @constructor scheduler--调度器，优先级比run函数高
 */
export class ReactiveEffect<T = any> {
  /**
   * 存在该属性，则表示当前的 effect 为计算属性的 effect
   */
  public computed?: ComputedRefImpl<T>
  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}
  run() {
    // 指定现在正在活跃的activeEffect实例，用于依赖收集
    activeEffect = this
    return this.fn()
  }
  stop() {}
}

export type EffectScheduler = (...args: any[]) => any

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}
/**
 * @description effect方法
 * @author dengyong
 * @date 17/04/2023
 * @export
 * @template T
 * @param fn
 * @param [options]
 */
export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  // 生成 ReactiveEffect 实例
  const _effect = new ReactiveEffect(fn)
  // 存在 options，则合并配置对象
  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    // 执行run方法，对fun中的方法开始收集依赖
    _effect.run()
  }
}

type keyToDepMap = Map<any, Dep>
/**
 * 收集所有依赖的实例
 * key：被代理的对象（target）
 * value：Map对象（depsMap）
 *        key：响应性对象的指定属性
 *        value：指定对象的指定属性的 执行函数 （Dep实例）
 *               effects实例的set合集
 */
const targetMap = new WeakMap<any, keyToDepMap>()

/**
 * @description 收集被代理对象上某个key的依赖
 * @author dengyong
 * @date 30/03/2023
 * @export
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function track(target: object, key: unknown) {
  // 如果当前没有正在执行的函数，直接返回
  if (!activeEffect) return
  // 获取对应被代理对象的depsMap，也就是获取它每个key对应的dep的map对象 key--dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果获取到的 map 不存在，则生成新的 map 对象，并把该对象赋值给对应的 value
    targetMap.set(target, (depsMap = new Map()))
  }
  // 获取该代理对象指定key值的dep
  let dep = depsMap.get(key)
  if (!dep) {
    // 如果 dep 不存在，则生成一个新的 dep，并放入到 depsMap 中
    depsMap.set(key, (dep = createDep()))
  }
  // 收集依赖，在dep中添加activeEffect实例
  trackEffects(dep)
  // console.log('targetMap',targetMap);
}
/**
 * @description 跟踪某个key值对应的依赖 在其对应的dep实例中添加当前的effect对象
 * @author dengyong
 * @date 30/03/2023
 * @export
 * @param dep 某个key值对应的dep实例
 */
export function trackEffects(dep: Dep) {
  // activeEffect! ： 断言 activeEffect 不为 null
  // dep是set合集，不用考虑重复问题
  dep.add(activeEffect!)
}
/**
 * @description 触发一个被代理对象的摸个key值的依赖
 * @author dengyong
 * @date 30/03/2023
 * @export
 * @param target WeakMap 的 key
 * @param key 代理对象的 key，当依赖被触发时，需要根据该 key 获取
 */
export function trigger(target: object, key: unknown) {
  // 获取对应被代理对象的depsMap，也就是获取它每个key对应的dep的map对象 key--dep
  let depsMap = targetMap.get(target)
  // 如果 map 不存在，则直接 return
  if (!depsMap) return
  // 依据指定的 key，获取 dep 实例
  let dep: Dep | undefined = depsMap.get(key)
  // dep 不存在则直接 return
  if (!dep) return
  triggerEffects(dep)
}

/**
 * @description 触发dep中的依赖
 * @author dengyong
 * @date 30/03/2023
 * @param dep
 */
export function triggerEffects(dep: Dep) {
  // 把 dep 构建为一个数组
  const effects = isArray(dep) ? dep : [...dep]
  // 逐个依赖出发
  // for (const effect of effects) {
  //     triggerEffect(effect)
  // }

  // 不在依次触发，而是先触发所有的计算属性依赖，再触发所有的非计算属性依赖
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

/**
 * @description 触发单个依赖
 * @author dengyong
 * @date 30/03/2023
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}