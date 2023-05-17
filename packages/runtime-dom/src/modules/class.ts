/**
 * 为class打补丁
 * @param el
 * @param value
 */
export function pathClass(el:Element, value:string | null){
    if(value == null){
        el.removeAttribute('class')
    } else {
        el.className = value
    }
}