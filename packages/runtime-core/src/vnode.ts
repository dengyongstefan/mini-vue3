import { isArray, isFunction, isObject, isString } from "@vue/shared"
import { normalizeClass } from "packages/shared/src/normalizeProp"
import { ShapeFlags } from "packages/shared/src/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

/**
 * @description VNode类型
 * @author dengyong
 * @date 23/04/2023
 * @export
 * @interface VNode
 */
export interface VNode {
    __v_isVNode: boolean
    key: any
    type: any
    props: any
    children: any
    shapeFlag: number
}

/**
 * @description 创建并返回vnode
 * @author dengyong
 * @date 23/04/2023
 * @export
 * @param type 类型
 * @param props 标签属性或自定义属性
 * @param [children]子节点
 * @returns {*}  vnode 对象
 */
export function createVNode(
    type:any,
    props:any,
    children?:any
):VNode{

    const shapeFlag = isString(type)            // 如果是字符串这代表元素
                        ?ShapeFlags.ELEMENT
                        :isObject(type)         // 如果是对象则是状态组件
                            ?ShapeFlags.STATEFUL_COMPONENT
                            :0
    if(props){
        // 标准化处理class
        let {class:klass,style} = props
        if(klass && !isString(klass)){
            props.class = normalizeClass(klass)
        }
    }

    // 创建基础的vnode
    return createBaseVNode(type,props,children,shapeFlag)
}

/**
 * @description 创建基础的vnode
 * @author dengyong
 * @date 23/04/2023
 * @param type
 * @param props
 * @param children
 * @param shapeFlag
 * @returns {*}
 */
function createBaseVNode(
    type:any,
    props:any,
    children:any,
    shapeFlag:number):VNode{
        const vnode = {
            __v_isVNode: true,
            key:props?.key || null,
            type,
            props,
            children,
            shapeFlag
        } as VNode
        //  处理子节点
        normalizeChildren(vnode,children)
        return vnode
}

/**
 * @description 处理子节点
 * @author dengyong
 * @date 23/04/2023
 * @param vnode
 * @param children
 */
function normalizeChildren(vnode:VNode,children:unknown){
    let type = 0
    const { shapeFlag } = vnode
    if(children == null){
        children = null
    }
    else if(isArray(children)){
        type = ShapeFlags.ARRAY_CHILDREN
    }
    else if(isObject(children)){

    }
    else if(isFunction(children)){

    }else{
        // children 为 string
        children = String(children)
        // 为 type 指定 Flags
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.children = children
    vnode.shapeFlag |= type
}

/**
 * @description 判断传入参数是否为一个VNode
 * @author dengyong
 * @date 21/04/2023
 * @export
 * @param val
 * @returns {*}
 */
export function isVNode(val:any):val is VNode{
    return val? (val.__v_isVNode === true) :false
}