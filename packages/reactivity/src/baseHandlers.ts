/**
 * getter 回调方法
 */
const get = createGetter()
/**
 * @description 生成get函数，在get函数中收集依赖
 * @author dengyong
 * @date 30/03/2023
 * @returns get 函数
 */
function createGetter(){
    return function get(target:object,key:string | symbol, receiver:object){
        const res = Reflect.get(target,key,receiver)
        console.log('get');
        // track()
        return  res
    }
}
/**
 * setter 回调方法
 */
const set = createSetter()
/**
 * @description 生成set函数，在get函数中触发依赖
 * @author dengyong
 * @date 30/03/2023
 * @returns set函数
 */
function createSetter(){
    return function set(
        target:object,
        key:string|symbol,
        value:unknown,
        receiver:object
    ){
        const res = Reflect.set(target,key,value,receiver)
        console.log('set');
        // trigger()
        return res
    }
}
/**
 * 响应性的handler
 */
export const mutableHandlers: ProxyHandler<object> = {
    get,
    set
}