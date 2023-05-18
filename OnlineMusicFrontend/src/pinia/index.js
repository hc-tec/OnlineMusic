import { defineStore } from 'pinia'
import axios from '../utils/axios'
import router from '../router'

const useStore = defineStore('main', {
    state: () => ({
        id: 0,
        isLogin: false,
        isAdmin: false,
        userName: '',
        avatarPath: '',
        playList: [],
    }),

    actions: {
        play(params){
            console.log(params);
        }
    },
})

export { useStore }