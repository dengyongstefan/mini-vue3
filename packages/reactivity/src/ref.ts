import { hasChanged } from "@vue/shared"
import { Dep, createDep } from "./dep"
import { activeEffect, track, trackEffects, triggerEffects } from "./effect"
import { toReactive } from "./reactive"


export interface Ref<T = any>{
    value: T
}

/**
 * @description ref 函数
 * @author dengyong
 * @date 05/04/2023
 * @export
 * @param value
 * @returns {*}
 */
export function ref(value:unknown){
    return createRef(value,false)
}

/**
 * @description 创建RefImpl实例
 * @author dengyong
 * @date 05/04/2023
 * @param rawValue 原始数据
 * @param shallow  boolean 形数据，表示《浅层的响应性（即：只有 .value 是响应性的）》
 * @returns {*}
 */
function createRef(rawValue:unknown,shallow:boolean){
    if (isRef(rawValue)) {
		return rawValue
	}
    return new RefImpl(rawValue,shallow)
}

/**
 * @description RefImpl类
 * @author dengyong
 * @date 05/04/2023
 * @class RefImpl
 * @template T
 */
class RefImpl<T>{
    private _value:T        // 存放值
    private _rawValue:T     // 存放最原始的值

    public dep?:Dep = undefined // 收集依赖
    public readonly __v_isRef = true // 是否为 ref 类型数据的标记

    constructor(value:T,public readonly __v_isShallow:boolean){
        // 如果 __v_isShallow 为 true，则 value 不会被转化为 reactive 数据，即如果当前 value 为复杂数据类型，则会失去响应性。对应官方文档 shallowRef ：https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
        this._value = __v_isShallow?value:toReactive(value)
        this._rawValue = value // 原始数据
    }

	/**
	 * get 语法将对象属性绑定到查询该属性时将被调用的函数。
	 * 即：xxx.value 时触发该函数
	 */
    get value(){
        trackRefValue(this)
        // console.log('this',this);
        return this._value
    }
    /**
	* newVal 为新数据
	* this._rawValue 为旧数据（原始数据）
	* 对比两个数据是否发生了变化
	*/
    set value(newValue){
        if(hasChanged(newValue,this._rawValue)){
            this._rawValue = newValue // 更新原始数据
            this._value = toReactive(newValue) // 更新 .value 的值
            triggerRefValue(this) // 触发依赖
        }
    }
}

/**
 * @description 为ref收集依赖
 * @author dengyong
 * @date 05/04/2023
 * @param ref
 */
export function trackRefValue(ref){
    if(activeEffect){
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}

/**
 * @description 触发ref依赖
 * @author dengyong
 * @date 05/04/2023
 * @param ref
 */
export function triggerRefValue(ref){
    if(ref.dep){
        triggerEffects(ref.dep)
    }
}

/**
 * @description 判断是否为ref的实例
 * @author dengyong
 * @date 05/04/2023
 * @export
 * @param r
 * @returns {*}
 */
export function isRef(r:any):r is Ref{
    return !!(r&&r.__v_isRef === true)
}