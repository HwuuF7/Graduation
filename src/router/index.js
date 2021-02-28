import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '../components/test.vue'
import ModInfo from '@/components/mine/modInfo.vue'
import ModAttach from '@/components/mine/modAttach/modAttach.vue'
import Weixin from '../components/weixin.vue'


// 引入两个工具函数
import {
    isWeiXin,
    isMobile
} from '../utils/index.js'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        //   name: 'Home',
        // component: Index
        redirect: '/info'
    },
    {
        path: '/login',
        // component: () => import('@/components/index/index')
        component: () => import('@/components/common/loading')
    },
    {
        // PC端首页
        path: '/pc',
        component: () => import('@/components/PC/HomePC')
    },
    {
        path: '/test',
        component: Test
    },
    {
        path: '/info',
        component: () => import('@/components/info/info'),
        meta: {
            // 保持浏览状态
            keepalive: true,
            // 代表是否是从详情页返回 如果是 则不需要刷新数据
            isBack: false,
            // 判断是进入修改个人信息还是修改密码
            isSecret: false,
            /*  判断进入哪个组件
             0->我发布的
             1->我回复的
             2->我收藏的 */
            activeCom: 0,
        }
    },
    {
        name: 'InfoMore',
        path: '/info/:infoId',
        component: () => import('@/components/infoMore/infoMore')
    },
    {
        path: '/mine/modinfo',
        component: ModInfo,
        // children: [{
        //     path: '/mine/modinfo/:mod',
        //     component: ModAttach
        // }]
    },
    {
        path: '/mine/modinfo/:mod',
        component: ModAttach
    },
    {
        path: '/mine/aboutMe',
        component: () => import('@/components/mine/aboutMe/aboutMe'),
        meta: {
            keepalive: true,
            isBack: false,
        }
    }, {
        path: '/list',
        component: () => import('@/components/sorts/sort.vue'),
        meta: {
            keepalive: true,
            // 是否是从详情页返回 为true则代表使用缓存数据
            isBack: false,
        }
    }, {
        path: '/sendMessage',
        component: () => import('@/components/common/messageSort/messageSort')
    },
    {
        path: '/search',
        component: () => import('@/components/search/search'),
        meta: {
            keepalive: true,
            // 是否是从详情页返回 为true则代表使用缓存数据
            isBack: false,
        }
    },
    {
        name: 'deepChat',
        path: '/chat',
        component: () => import('@/components/chat/deepChat'),
    },
    {
        path: '/weixin',
        component: Weixin
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (isWeiXin() || isMobile()) {
        if (to.path === '/pc') {
            next('/info')
        } else {
            next()
        }
    } else {
        if (to.path === '/pc') {
            next()
        } else {
            next('/pc')
        }
    }
})

export default router