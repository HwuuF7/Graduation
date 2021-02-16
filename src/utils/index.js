const test = function () {
    console.log('this is a test function');
}
const hello = function () {
    console.log('this is hello2222');
    test()
}
import axios from 'axios'
// axios配置
axios.defaults.baseURL = 'http://api.xiaochengxuxcx.com';
// 添加请求拦截器
axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    // config.headers.common['Authorization'] = 'good';
    // console.log(config);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


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

// 封装表情转码存储至后端
const emojiEncode = function (message) {
    let patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    // 检测utf16字符正则
    return message.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
            H = char.charCodeAt(0);
            // 取出高位
            L = char.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
}

// 将post对象格式转换为formData
const paramsToFormData = function (obj) {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
            obj[key].forEach((item) => {
                formData.append(key, item);
            });
            return;
        }
        formData.append(key, obj[key]);
    });
    return formData;
}



// 微信授权登录地址
const url = encodeURIComponent('http://api.xiaochengxuxcx.com/weixin'),
    appid = 'wx8578e7862b93f215',
    href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;




const globalFun = {
    $test: test,
    $hello: hello,
    $parentPush: parentPush,
    $http: axios,
    $weixin: href,
    $emojiEncode: emojiEncode,
    $paramsToFormData: paramsToFormData
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