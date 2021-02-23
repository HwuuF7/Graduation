import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import './assets/css/iconfont/iconfont.css'
import './assets/css/global.css'

import './plugins/mint.js'
import {
    timeFormat,
    timeFormatAmPm,
    emojiDecode
} from './utils/timeFormat.js'

import {
    install
} from './utils/index.js'
Vue.use(install)

import graLoad from './components/loading/loading.vue'
Vue.component(graLoad.name, graLoad)

// 时间格式化
Vue.filter('timeFormat', timeFormat)
Vue.filter('timeFormatAmPm', timeFormatAmPm)
Vue.filter('emojiDecode', emojiDecode)

Vue.config.productionTip = false




new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')