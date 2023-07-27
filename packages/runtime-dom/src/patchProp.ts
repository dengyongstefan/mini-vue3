import { isOn } from '@vue/shared'
import { pathClass } from './modules/class'

/**
 * 为 prop 进行打补丁操作
 */
export const patchProp = (el, key, prevValue, nextValue) => {
  if (key === 'class') {
    // 处理替换class属性
    pathClass(el, nextValue)
  } else if (key === 'style') {
    // 处理style
  } else if (isOn(key)) {
    // 处理事件 事件会以on开头
  } else {
    // 其他处理
  }
}
