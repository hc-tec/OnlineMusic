import { defineStore } from 'pinia'

const useStore = defineStore('main', {
    state: () => ({
        isLogin: false,
        isAdmin: false,
        userId: 0,
        userName: '',
        avatarPath: '',
    }),

    actions: {

    },
})

export { useStore }