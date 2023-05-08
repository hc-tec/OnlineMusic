import { createRouter, createWebHashHistory } from 'vue-router'
import { useStore } from '../pinia'
import NProgress from "nprogress";

const MainPage = () => import('../pages/MainPage.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const UserCenter = () => import('../pages/UserCenter.vue')
const LoveSongs = () => import('../pages/LoveSongs.vue')
const HistorySongs = () => import('../pages/HistorySongs.vue')
const UserManage = () => import('../pages/UserManage.vue')
const SingerManage = () => import('../pages/SingerManage.vue')
const SongManage = () => import('../pages/SongManage.vue')
const SongKuManage = () => import('../pages/SongKuManage.vue')
const CommentManage = () => import('../pages/CommentManage.vue')


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: MainPage,
        },
        {
            path: '/index',
            redirect: '/'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/userCenter',
            component: UserCenter
        },
        {
            path: '/loveSongs',
            component: LoveSongs
        },
        {
            path: '/historySongs',
            component: HistorySongs
        },
        {
            path: '/userManage',
            component: UserManage
        },
        {
            path: '/singerManage',
            component: SingerManage
        },
        {
            path: '/songManage',
            component: SongManage
        },
        {
            path: '/songKuManage',
            component: SongKuManage
        },
        {
            path: '/commentManage',
            component: CommentManage
        },
        
    ]
})


router.beforeEach((to, from, next) => {
    NProgress.start()
    const store = useStore()
    if(!store.isAdmin) {
        if(['/userManage', '/singerManage', '/songManage', '/songKuManage', '/commentManage'].includes(to.path)) {
            router.replace('/')
        }
        else if(!store.isLogin && ['/historySongs', '/loveSongs', '/userCenter'].includes(to.path)) {
            router.replace('/login')
            ElMessage({
                message: '请登录以使用此功能',
                type: 'warning',
                showClose: true
            })
        }
        else {
            next()
        }
    }
    else {
        if(to.path == '/'){
            router.replace('/userManage')
        }
        else {
            next()
        }
    }
})

router.afterEach((to, from, next) => {
    NProgress.done()
})

export default router