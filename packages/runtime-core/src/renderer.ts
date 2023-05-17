import { ShapeFlags } from 'packages/shared/src/shapeFlags';
import { Comment, Fragment, Text } from './vnode'

/**
 * @description 对外暴露创建渲染器
 * @author dengyong
 * @date 12/05/2023
 */
export function createRenderer(options: RenderOptions){
    return baseCreateRenderer(options)
}

/**
 * @description 生成 renderer 渲染器
 * @author dengyong
 * @date 12/05/2023
 * @param options 兼容性操作配置对象
 * @returns {*}
 */
function baseCreateRenderer(options:RenderOptions):any{
    // 将不用的方法解构出来
    const {
        patchProp: hostPatchProp,
        setElementText: hostSetElementText,
        insert: hostInsert,
        createElement: hostCreateElement,
    } = options

    // 处理元素
    const processElement = (oldVNode, newVNode, container, anchor)=>{
        if(oldVNode == null){
            // 没有旧节点直接执行挂载操作
            mountElement(newVNode, container, anchor)
        }else{
            // 更新操作
        }
    }

    // 挂载元素节点
    const mountElement = (vnode, container, anchor) => {
        const { type, props, shapeFlag } = vnode
        // 1. 创建element
        const el = vnode.el = hostCreateElement(type)
        // 2. 设置文本
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            hostSetElementText(el, vnode.children)
        }else{
            //todo
        }
        // 3. 设置props
        if(props){
            for (const key in props) {
                hostPatchProp(el,key,null,props[key])
            }
        }
        // 4. 插入DOM
        hostInsert(el, container, anchor)
    }

    /**
     *
     * @param oldValue 旧的节点
     * @param newValue 新的节点
     * @param container 需要挂载上的container
     * @param anchor 需要插入的锚点
     */
    const patch = (oldValue, newValue, container, anchor = null)=>{
        // 如果新旧节点相同直接不进行任何操作
        if(oldValue === newValue) return
        const { type, shapeFlag } = newValue
        // 根据不同的type类型来处理
        switch(type) {
            case Text:
                break
            case Comment:
                break
            case Fragment:
                break
            default:
                if(shapeFlag & ShapeFlags.ELEMENT ){
                    // 普通DOM元素
                    processElement(oldValue, newValue, container, anchor)
                }else if(shapeFlag & ShapeFlags.COMPONENT){
                    // 组件

                }
        }
    }

    /**
     * 最终要暴露出去的render函数
     * @param vnode 需要渲染的vnode节点
     * @param container vnode节点需要挂载到的DOM结构上
     */
    const render = (vnode, container)=>{
        if(vnode == null){
            // todo 卸载节点
        }else{
            // 打补丁 -- 挂载或者更新
            patch(container._vnode || null, vnode, container)
        }
        // _vnode代表旧的节点信息，将新的节点信息复制给旧的节点信息
        container._vnode = vnode
    }
    return {
        render
    }
}

/**
 *  从其他包导入的element操作方法，抹平不同平台的兼容性问题
 */
export interface RenderOptions{
    // 为指定的 el 的 属性 打补丁
    patchProp(el:Element, key:string, prevValue:any, nextValue:any):void
    // 为指定的元素设置 text文本
    setElementText(node:Element, text:string): void
    // 将指定的元素插入到parent中，anchor代表插入的位置即锚点
    insert(el, parent, anchor?):void
    // 创建指定的 element
    createElement(type:string):Element
}