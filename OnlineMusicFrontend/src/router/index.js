import { createRouter, createWebHashHistory } from 'vue-router'
import { useStore } from '../pinia'
import NProgress from "nprogress";

const MainPage = () => import('../pages/MainPage.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
// 用户中心及其子路由
const UserCenter = () => import('../pages/UserCenter.vue')
const ChangePassword = () => import('../pages/UserCenter/ChangePassword.vue')
const ChangeAvatar = () => import('../pages/UserCenter/ChangeAvatar.vue')
// 歌手管理及其子路由
const SingerManage = () => import('../pages/SingerManage.vue')
const AddSinger = () => import('../pages/SingerManage/AddSinger.vue')
const EditSinger = () => import('../pages/SingerManage/EditSinger.vue')
const ViewSinger = () => import('../pages/SingerManage/ViewSinger.vue')
const AddSong = () => import('../pages/SingerManage/AddSong.vue')


const LoveSongs = () => import('../pages/LoveSongs.vue')
const HistorySongs = () => import('../pages/HistorySongs.vue')
const UserManage = () => import('../pages/UserManage.vue')

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
            component: UserCenter,
            redirect: '/userCenter/changePassword',
            children: [
                {
                    path: 'changePassword',
                    component: ChangePassword,
                },
                {
                    path: 'changeAvatar',
                    component: ChangeAvatar,
                }

            ]
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
            component: SingerManage,
            redirect: '/singerManage/viewSinger',
            children: [
                {
                    path: 'viewSinger',
                    component: ViewSinger
                },
                {
                    path: 'addSinger',
                    component: AddSinger
                },
                {
                    path: 'editSinger',
                    component: EditSinger
                },
                {
                    path: 'addSong',
                    component: AddSong
                }
            ]
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
    if(store.isAdmin && to.path == '/') {
        router.replace('/userManage')
    }
    else {
        next()
    }
})

router.afterEach((to, from, next) => {
    NProgress.done()
})

export default router