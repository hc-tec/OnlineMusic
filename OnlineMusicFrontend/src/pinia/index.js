import { defineStore } from 'pinia'
import axios from '../utils/axios'
import router from '../router'

const useStore = defineStore('main', {
    state: () => ({
        isLogin: false,
        isAdmin: false,
        userName: '',
        avatarPath: '',
    }),

    actions: {
    },
})

export { useStore }