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
        playModel: 1, // 播放模式 1顺序播放、2单曲循环、3随机播放
        playingSong: {
            state: false, // 播放状态
            song_id: '',
            song_name: '无语知悉',
            singer_id: '',
            singer_name: '站街',
            lyric: [{}], // 歌词中每个元素是每行的歌词

        },
        searchCallback: null,
    }),

    actions: {
        play(params){
            console.log(params);
        },
        clickSinger(singer_id, singer_name) {

        },
        

    },
})

export { useStore }