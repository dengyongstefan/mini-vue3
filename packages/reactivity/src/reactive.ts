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
    // 缓存target
    proxyMap.set(target,proxy)
    return proxy
}