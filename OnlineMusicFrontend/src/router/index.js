import { createRouter, createWebHashHistory } from 'vue-router'

const MainPage = () => import('../pages/MainPage.vue')
const Login = () => import('../pages/Login.vue')

export default createRouter({
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
    ]
})