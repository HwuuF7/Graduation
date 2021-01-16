const test = function () {
    console.log('this is a test function');
}
const hello = function () {
    console.log('this is hello2222');
    test()
}

// 获取事件冒泡的路径 兼容性
const eventPath = function (evt) {
    const path = (evt.composedPath && evt.composedPath()) || evt.path,
        target = evt.target;
    if (path != null) {
        return (path.indexOf(window) < 0) ? path.concat(window) : path;
    }

    if (target === window) {
        return [window];
    }

    function getParents(node, memo) {
        memo = memo || [];
        const parentNode = node.parentNode;

        if (!parentNode) {
            return memo;
        } else {
            return getParents(parentNode, memo.concat(parentNode));
        }
    }

    return [target].concat(getParents(target), window);
}

// 封装事件委托
/* 
    第一个参数为:   委托元素范围内触发事件的event对象
    第二个参数为:   找到触发事件元素身上特有的类名
    返回值为:       触发事件的元素 
*/
const parentPush = function (el, findClassName) {
    const elPath = eventPath(el);
    const targetTag = elPath.find((elTag) => {
        return elTag.className === findClassName
    })
    return targetTag
}


const globalFun = {
    $test: test,
    $hello: hello,
    $parentPush: parentPush
}

export default {
    install(Vue) {
        Object.keys(globalFun).forEach(fun => {
            Object.defineProperty(Vue.prototype, fun, {
                value: globalFun[fun],
                writable: false
            })
        })

    }
}