import { defineStore } from 'pinia'

const useStore = defineStore('main', {
    state: () => ({
        isLogin: false,
        isAdmin: false,
        userName: '',
        
    }),

    actions: {

    },
})

export { useStore }