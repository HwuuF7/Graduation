// export function throttle(fn, thisArg) {
//     let flag = true;
//     return function () {

//         if (flag) {
//             flag = false;
//             setTimeout(() => {
//                 console.log(thisArg);
//                 fn.apply(thisArg, arguments);
//                 flag = true;
//             }, 2000)
//         }

//     }
// }

const debounce = {
    inserted: function (el, binding) {
        let timer = null;
        el.addEventListener('keyup', () => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                binding.value();
            }, 1000)
        })
    }
}


const directives = {
    debounce,
}


export default {
    install(Vue) {
        Object.keys(directives).forEach(key => {
            Vue.directive(key, directives[key]);
        })
    }
}