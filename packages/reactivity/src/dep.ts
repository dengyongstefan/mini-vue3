import { ReactiveEffect } from './effect'

export type Dep = Set<ReactiveEffect>
/**
 * @description 生成Dep实例，用于收集依赖，存放的是ReactiveEffect实例的数组 某个监听对象key值对应一个dep实例
 * @author dengyong
 * @date 30/03/2023
 * @param [effects] ReactiveEffect实例数组
 * @returns ReactiveEffect实例数组
 */
export function createDep(effects?: ReactiveEffect[]): Dep {
  return new Set<ReactiveEffect>(effects) as Dep
}
