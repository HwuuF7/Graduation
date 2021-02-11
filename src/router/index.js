import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '../components/test.vue'
import Info from '@/components/info/info.vue'
import InfoMore from '@/components/infoMore/infoMore.vue'
import Index from '@/components/index/index.vue'
import ModInfo from '@/components/mine/modInfo.vue'
import ModAttach from '@/components/mine/modAttach/modAttach.vue'
import Sort from '@/components/sorts/sort.vue'
import MessageSort from '@/components/common/messageSort/messageSort.vue'
import AboutMe from '@/components/mine/aboutMe/aboutMe.vue';
import Weixin from '../components/weixin.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        //   name: 'Home',
        component: Index
    },
    // {
    //     path: '/login',
    //     component: Login
    // },
    // {
    //     path: '/register',
    //     component: Register
    // },
    {
        path: '/test',
        component: Test
    },
    {
        path: '/info',
        component: Info,
        meta: {
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
        path: '/info/:infoId',
        component: InfoMore
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
        component: AboutMe
    }, {
        path: '/list',
        component: Sort
    }, {
        path: '/sendMessage',
        component: MessageSort
    }, {
        path: '/weixin',
        component: Weixin
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach(async (to, from, next) => {
    if (to.path === '/') {
        // location.href = 'http://119.23.222.17:9001/wxLogin'
        return next()
    }
    console.log('=====================');
    if (to.path === '/info') {
        console.log('进来了');
        return next()
    }
    console.log('进来2');
    next()
})

export default router