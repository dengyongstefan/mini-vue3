import { isObject } from "@vue/shared"
import { mutableHandlers } from "./baseHandlers"

/**
 * 缓存响应对象
 * key:target -- 被代理的对象
 * vale:proxy -- 代理后返回的对象
 */
export const reactiveMap =  new WeakMap<object,any>()

/**
 * @description 创建响应式对象
 * @author dengyong
 * @date 30/03/2023
 * @param target 需要被代理的对象
 * @returns 被代理的对象
 */
export function reactive(target:object){
    return createReactiveObject(target,mutableHandlers,reactiveMap)
}

/**
 * @description 生成代理对象
 * @author dengyong
 * @date 30/03/2023
 * @param target 需要被代理的对象
 * @param baseHandlers handler
 * @param proxyMap proxy缓存
 * @returns 代理对象
 */
function createReactiveObject(
    target:object,
    baseHandlers:ProxyHandler<any>,
    proxyMap:WeakMap<object,any>
) {
    // 获取缓存的proxy
    const existProxy = proxyMap.get(target)
    if(existProxy){
        return existProxy
    }
    // 代理target
    const proxy = new Proxy(target,baseHandlers)
    // 为reactive设置标志
    proxy[ReactiveFlags.IS_REACTIVE] = true

    // 缓存target
    proxyMap.set(target,proxy)
    return proxy
}

/**
 * @description 将制定的数据变为响应式数据
 * @author dengyong
 * @date 04/04/2023
 * @export
 * @template T
 * @param value 需要被转化的对象
 * @returns {*}
 */
export function toReactive<T extends unknown>(value:T):T{
    return isObject(value)? reactive(value as object) : value

}

/**
 * @description 判断是否为 Reactive数据
 * @author dengyong
 * @date 17/04/2023
 * @export
 * @param value
 * @returns {*}
 */
export function isReactive(value):boolean{
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

export const enum ReactiveFlags {
	IS_REACTIVE = '__v_isReactive'
}