const doc = document

/**
 * 导出浏览器的dom操作方法
 */
export const nodeOps = {
    // 插入元素
    insert:(child,parent,anchor)=>{
        parent.insertBefore(child, anchor || null)
    },
    // 创建指定的 element
    createElement:(tag):Element=>{
        return doc.createElement(tag)
    },
    // 为指定的 element 设置 textContent
    setElementText:(el, text) => {
        el.textContent = text
    }
}