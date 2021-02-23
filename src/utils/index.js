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


// 判断是否是微信端
export const isWeiXin = function () {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') > -1) {
        return true // 是微信端
    } else {
        return false
    }
}

// 判断是否是移动端
export const isMobile = function () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return true // 手机端
    } else {
        return false
    }
}

// localStorage存储量过多
const isQuotaExceeded = function (e) {
    var quotaExceeded = false;
    if (e) {
        if (e.code) {
            switch (e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014: // Firefox 
                    if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if (e.number === -2147024882) { // IE8 
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}

// localStorage的存储时间（3天）
const setLocalStorage = function (key, value) {
    var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列 
    var valueDate = JSON.stringify({
        val: value,
        timer: curtime
    });
    try {
        localStorage.setItem(key, valueDate);
    } catch (e) {
        /*if(e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.log("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }*/
        // 兼容性写法
        if (isQuotaExceeded(e)) {
            console.log("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }
    }
}



const getLocalStorage = function (key) {
    var exp = 2.592e8; // 3天的毫秒数
    if (localStorage.getItem(key)) {
        var vals = localStorage.getItem(key); // 获取本地存储的值 
        var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间 
        var isTimed = (new Date().getTime() - dataObj.timer) > exp;
        if (isTimed) {
            console.log("存储已过期");
            localStorage.removeItem(key);
            return null;
        } else {
            var newValue = dataObj.val;
        }
        return newValue;
    } else {
        return null;
    }
}






const globalFun = {
    $parentPush: parentPush,
    $http: axios,
    $weixin: href,
    $emojiEncode: emojiEncode,
    $paramsToFormData: paramsToFormData,
    $setLocalStorage: setLocalStorage,
    $getLocalStorage: getLocalStorage
}

/* export default {
    install(Vue) {
        Object.keys(globalFun).forEach(fun => {
            Object.defineProperty(Vue.prototype, fun, {
                value: globalFun[fun],
                writable: false
            })
        })
    },
    isWeiXin,
    isMobile,
} */

// 挂载到Vue原型身上
export function install(Vue) {
    Object.keys(globalFun).forEach(fun => {
        Object.defineProperty(Vue.prototype, fun, {
            value: globalFun[fun],
            writable: false
        })
    })
}