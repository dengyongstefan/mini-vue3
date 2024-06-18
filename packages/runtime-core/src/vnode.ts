import { isArray, isFunction, isObject, isString } from '@vue/shared'
import { normalizeClass } from 'packages/shared/src/normalizeProp'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

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
export function createVNode(type: any, props: any, children?: any): VNode {
  const shapeFlag = isString(type) // 如果是字符串这代表元素
    ? ShapeFlags.ELEMENT
    : isObject(type) // 如果是对象则是状态组件
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0
  if (props) {
    // 标准化处理class
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }

  // 创建基础的vnode
  return createBaseVNode(type, props, children, shapeFlag)
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
  type: any,
  props: any,
  children: any,
  shapeFlag: number
): VNode {
  const vnode = {
    __v_isVNode: true,
    key: props?.key || null,
    type,
    props,
    children,
    shapeFlag
  } as VNode
  //  处理子节点
  normalizeChildren(vnode, children)
  return vnode
}

/**
 * @description 处理子节点
 * @author dengyong
 * @date 23/04/2023
 * @param vnode
 * @param children
 */
function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  const { shapeFlag } = vnode
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (isObject(children)) {
  } else if (isFunction(children)) {
  } else {
    // children 为 string
    children = String(children)
    // 为 type 指定 Flags
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  /** 按位或赋值运算 可以同时标记出本身节点的信息和子节点的信息 */
  /** 通过按位或赋值，可以累积不同的形状标记，表示VNode可能同时具有多种特征（如同时有文本子元素和数组子元素） */
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
export function isVNode(val: any): val is VNode {
  return val ? val.__v_isVNode === true : false
}

/**
 * @description 判断传入的两个节点是否一致
 * @date 27/07/2023
 * @export
 * @param {VNode} n1
 * @param {VNode} n2
 * @returns {*}  {boolean}
 */
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}
