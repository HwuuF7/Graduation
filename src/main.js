import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import './assets/css/iconfont/iconfont.css'
import './assets/css/global.css'
import './plugins/mint.js'
import {
    timeFormat
} from './utils/timeFormat.js'
import diyDirectives from './utils/throttle.js'

import utils from './utils/index.js'
Vue.use(utils)
Vue.use(diyDirectives)


import graLoad from './components/loading/loading.vue'
Vue.component(graLoad.name, graLoad)

// 时间格式化
Vue.filter('timeFormat', timeFormat)


Vue.config.productionTip = false




new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')