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
        // component: Index
        redirect: '/info'
    },
    {
        path: '/login',
        component: Index
    },
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
        component: Sort,
        meta: {
            keepalive: true,
            // 是否是从详情页返回 为true则代表使用缓存数据
            isBack: false,
        }
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

router.beforeEach((to, from, next) => {
    // 如果是从分类跳回主页面 要将keepAlive置为false 
    // 再从主页面进分类时 就可以刷新获取
    /*  if (from.path === '/info' && to.name === 'InfoMore') {
         //  由首页跳详情页
         from.meta.keepalive = true;
         console.log('1===', from.meta);
         next()
     } else if (from.path === '/info' && to.path === '/list') {
         //  由首页跳分类页
         from.meta.keepalive = false;
         to.meta.keepalive = false;
         console.log('2===');
         next();
     } else if (from.path === '/list' && to.name === 'InfoMore') {
         //  由分类页跳详情页
         from.meta.keepalive = true;
         console.log('3===', from);
         next()
     } else if (from.path === '/list' && to.path === '/info') {
         //  由详情页跳首页
         from.meta.keepalive = false;
         console.log(from);
         to.meta.keepalive = false;
         console.log('4===');
         next()
     } else if (from.path === '/info' && to.path === '/sendMessage') {
         //  由详情页跳首页
         from.meta.keepalive = false;
         console.log('5===');
         next()
     } else if (from.path === '/sendMessage' && to.path === '/info') {
         //  由详情页跳首页
         // to.meta.keepalive = true;
         console.log('6===', to.meta);
         next()
     } else {
         next()
     } */
    next()
})

export default router