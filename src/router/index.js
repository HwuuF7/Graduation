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
            isSecret: false
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
    }, {
        path: '/list',
        component: Sort
    }, {
        path: '/sendMessage',
        component: MessageSort
    }
]

const router = new VueRouter({
    routes
})

export default router