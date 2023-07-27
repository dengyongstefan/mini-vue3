import { isFunction } from '@vue/shared'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'
import { Dep } from './dep'

/**
 * @description 返回计算属性的对象
 * @author dengyong
 * @date 13/04/2023
 * @param gettersOrOptions
 * @returns {*}
 */
export function computed(gettersOrOptions) {
  let getter: any
  //  判断是否传入的是函数
  const onlyGetter = isFunction(gettersOrOptions)
  if (onlyGetter) {
    getter = gettersOrOptions
  }

  const cRef = new ComputedRefImpl(getter)

  return cRef
}

/**
 * @description 计算属性的类
 * @author dengyong
 * @date 13/04/2023
 * @export
 * @class ComputedRefImpl
 * @template T
 */
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined
  public readonly effect: ReactiveEffect<T>
  public _value!: T
  public readonly __v_isRef = true
  /**
   * 脏：为 false 时，表示需要触发依赖。为 true 时表示需要重新执行 run 方法，获取数据。即：数据脏了
   */
  public _dirty = true

  constructor(getter) {
    this.effect = new ReactiveEffect(getter, () => {
      // 判断当前脏的状态，如果为 false，表示需要《触发依赖》
      if (!this._dirty) {
        // 将脏置为 true，computed中的被收集的依赖有更新，同时触发当前依赖
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }

  get value() {
    // 收集依赖
    trackRefValue(this)
    // 判断当前脏的状态，如果为 true ，则表示需要重新执行 run，获取最新数据
    // 如果为false代表数据没有脏，也就是computed中的被收集的依赖没有更新，不需要在获取一遍新的数据，实现缓存
    if (this._dirty) {
      // 将_dirty设置为false，代表数据已经更新
      this._dirty = false
      // 执行run函数，获取新的value值
      this._value = this.effect.run()
    }
    return this._value
  }
}
