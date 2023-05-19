<template>
  <el-empty description="请登录" v-if="!store.isLogin" style="height: 100%;"/>
  <el-empty description="管理员禁入" v-else-if="store.isAdmin" style="height: 100%;"/>
  <div v-else class="lovesong-container">
    <h1>我喜欢</h1>
    <div class="songcomponent-container" v-for="item in data.songKuSongList" :key="item.song_id">
      <Song
        :id="item.song_id"
        :song_name="item.song_name"
        :singer_id="item.singer_id"
        :singer_name="item.singer_name"
        :publish_time="item.publish_time"
        :file_name="item.file_name"
        :isAdmin="store.isAdmin"
        :listen_num="item.listen_num"
        :has_love="item.has_love"
        :handleOpra="handleOpraLove"
      ></Song>
    </div>
  </div>
  
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'
import { dayjs } from 'element-plus';
const store = useStore()

const data = reactive({
  songList: [],
  addSongDialogVisible: false,
  selectSong: [],
  songKuSongList: [],
})

// 用户收藏
const handleOpraLove = (song_id, has_love) => {
  if(!store.isLogin) {
    ElMessage({
      message: '请先登录',
      type: 'warning',
      duration: 1000
    })
    return
  }
  let requestUrl = has_love ? '/deleteLoveSong' : '/addLoveSong'
  axios.post(requestUrl, {song_id}).then(res => {
    if(res.data.code == 0) {
      for (let index = 0; index < data.songKuSongList.length; index++) {
        const element = data.songKuSongList[index];
        if(element.song_id == song_id) {
          element.has_love = !has_love
          break;
        }
      }
    }
    else {
      ElMessage({
        message: '切换收藏状态失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

onMounted(() => {
  axios.get('/getLoveSong').then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.songKuSongList.push({
          song_id: result.song_id,
          song_name: result.song_name,
          singer_id: result.singer_id,
          singer_name: result.singer_name,
          listen_num: result.listen_num, 
          file_name: result.file_name,
          has_love: result.has_love,
          publish_time: dayjs(result.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
  
})
</script>

<style scoped lang="less">
.lovesong-container {
  width: 70%;
  padding: 24px 5vw 54px;
}
</style>