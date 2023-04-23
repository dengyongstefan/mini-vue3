import { isArray, isObject } from "@vue/shared";
import { VNode, createVNode, isVNode } from "./vnode";

/**
 * 创建vnode
 * @param type vnode类型
 * @param propsOrChildren props或者是孩子
 * @param children 孩子
 * @returns
 */
export function h(
    type:any,
    propsOrChildren?:any,
    children?:any
): VNode {
    // 获取用户传递的所有参数的数量
    const l = arguments.length
    // 如果用户只传递了两个参数，那么证明第二个参数可能是 props , 也可能是 children
    if(l===2){
        // 如果 第二个参数是对象，但不是数组。则第二个参数只有两种可能性：1. VNode 2.普通的 props
        if(isObject(propsOrChildren) && !isArray(propsOrChildren)){
            if(isVNode(propsOrChildren)){
                // 如果是 VNode，则 第二个参数代表了 children
                return createVNode(type,null,[propsOrChildren])
            }else{
                // 如果不是 VNode， 则第二个参数代表了 props
                return createVNode(type,propsOrChildren)
            }
        }
        // 如果第二个参数不是单纯的 object，则 第二个参数代表了 props
        else{
            return createVNode(type,null,propsOrChildren)
        }
    }
    // 如果用户传递了三个或以上的参数，那么证明第二个参数一定代表了 props
    else{
        // 如果参数在三个以上，则从第二个参数开始，把后续所有参数都作为 children
        if(l > 3){
            children = Array.prototype.slice.call(arguments, 2)
        }
        else if(l == 3 && isVNode(children)){
            // 如果传递的参数只有三个，且children 是单纯的 单个VNode
            children = [children]
        }
        // 触发 createVNode 方法，创建 VNode 实例
        return createVNode(type,propsOrChildren,children)
    }

}