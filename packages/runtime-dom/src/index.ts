import { patchProp } from './patchProp';
import { createRenderer } from "@vue/runtime-core"
import { extend } from "@vue/shared"
import { nodeOps } from './nodeOps';

/**
 * 导出浏览器宿主下的render函数
 * @param args
 */
export const render = (...args) => {
    ensureRenderer().render(...args)
}

/**
 * 浏览器宿主下的DOM操作的API
 */
const rendererOptions = extend({ patchProp }, nodeOps)
let renderer

/**
 * 创建render的函数
 * @returns
 */
function ensureRenderer(){
    return renderer || (renderer = createRenderer(rendererOptions) )
}
