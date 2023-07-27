import { EMPTY_OBJ, hasChanged, isObject } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { isReactive } from 'packages/reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'
import _ from 'lodash'

/**
 * @description watch 方法
 * @author dengyong
 * @date 17/04/2023
 * @export
 * @param source
 * @param cb
 * @param [options]
 * @returns {*}
 */
export function watch(source, cb: Function, options?: WatchOptions) {
  return doWatch(source, cb, options)
}

export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
}

function doWatch(
  source,
  cb: Function,
  { immediate, deep }: WatchOptions = EMPTY_OBJ
) {
  // 触发getter的指定函数
  let getter: () => any

  // 判断source的数据类型
  if (isReactive(source)) {
    getter = () => source
    deep = true
  } else {
    getter = () => {}
  }

  // 存在回调函数和deep
  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let scheduler = () => queuePreFlushCb(job)
  const effect = new ReactiveEffect(getter, scheduler)

  // 旧值
  let oldValue = {}
  // job 执行方法 真正触发cb回调函数
  const job = () => {
    if (cb) {
      const newValue = effect.run()
      console.log('newValue', newValue)
      console.log('oldValue', oldValue)
      if (deep || hasChanged(newValue, oldValue)) {
        cb(newValue, oldValue)
        oldValue = _.cloneDeep(newValue)
      }
    }
  }

  if (cb) {
    if (immediate) {
      job()
    } else {
      // console.log('runold');
      oldValue = effect.run()
    }
  } else {
    effect.run()
  }

  return () => {
    effect.stop()
  }
}

/**
 * @description 触发value的getter，触发所有的属性依赖收集
 * @author dengyong
 * @date 17/04/2023
 * @export
 * @param value
 * @returns {*}
 */
export function traverse(value: unknown) {
  if (!isObject(value)) {
    return value
  }
  // 递归执行
  for (const key in value as object) {
    traverse((value as object)[key])
  }
  return value
}
