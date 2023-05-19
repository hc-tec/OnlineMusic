<template>
  <div class="search-container">
    <p class="title"><span>{{ props.content }}</span>的搜索结果</p>
    <el-tabs v-model="activeName">
      <el-tab-pane label="单曲" name="song">
        <div class="songcomponent-container" v-for="item in data.songKuSongList" :key="item.song_id">
          <Song
            :id="item.song_id"
            :song_name="item.song_name"
            :singer_id="item.singer_id"
            :singer_name="item.singer_name"
            :visitors="item.visitors"
            :publish_time="item.publish_time"
            :file_name="item.file_name"
            :isAdmin="store.isAdmin"
            :has_love="item.has_love"
            :handleOpra="handleOpraLove"
          ></Song>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="songKu">
        <div class="viewsongku-container" ref="viewSongKu" :style="{
            'grid-template-columns': `repeat(${gridStyle}, 1fr)`
          }">
          <div class="songkucomponent" v-for="item in data.songKuList" :key="item.id">
            <SongKu
              :imgSrc="item.file_path"
              :handleClick="handleClick"
              :songKuName="item.ku_name"
              :id="item.id"
              :description="item.description"
            ></SongKu>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, reactive, watch, computed, ref } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'
import { dayjs } from 'element-plus';
import { useElementSize } from '@vueuse/core'
import router from '../router';
const store = useStore()

const props = defineProps({
  content: String,
})
const viewSongKu = ref(null)
const { width } = useElementSize(viewSongKu)

const gridStyle = computed(() => {
  if(width.value > 1320) return 6
  if(width.value > 1100) return 5
  if(width.value > 880) return 4
  return 3
})
const activeName = ref('song')

const data = reactive({
  songKuList: [],
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

const handleClick = (id, ku_name, file_path, description) => {
  router.push({
    path: '/userSongKuDetail',
    query: {id, ku_name, file_path, description}
  })
}

onDeactivated(() => {
  store.searchCallback = null
})

const search = (value) => {
  data.songKuList = []
  data.songKuSongList = []
  searchSongInfo(value)
  searchSongKu(value)
}

const searchSongInfo = (value) => {
  axios.get('/searchSongInfo', {
    params: {
      song_name: value
    }
  }).then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.songKuSongList.push({
          song_id: result.id,
          song_name: result.song_name,
          singer_id: result.singer_id,
          singer_name: result.singer_name,
          visitors: result.visitors, 
          file_name: result.file_name,
          has_love: result.has_love,
          publish_time: dayjs(result.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

const searchSongKu = (value) => {
  axios.get('/searchSongKuInfo', {
    params: {
      ku_name: value
    }
  }).then(res => {
    if(res.data.code == 0) {
      for (const item of res.data.result) {
        data.songKuList.push({
          file_path: `${import.meta.env.VITE_HOSTPORT}/songKu/${item.file_path}`,
          id: item.id,
          ku_name: item.ku_name,
          description: item.description
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

onActivated(() => {
  store.searchCallback = search
  search(props.content)
})
</script>

<style scoped lang="less">
.search-container {
  width: 70%;
  padding: 24px 5vw 54px;
}
.title {
  font-size: 22px;
  margin-bottom: 30px;
  margin-top: 20px;
  > span:first-child {
    font-size: 40px;
    font-weight: 700;
    margin-right: 8px;
  }
}
.viewsongku-container {
  box-sizing: border-box;
  display: grid;
  gap: 0px 20px;
  justify-items: center;
  
  padding: 20px 60px 0;
  width: 100%;
  height: 100%;
  .songkucomponent {
    width: 200px;
    height: 240px;
    margin-bottom: 20px;
    .addsongku-container {
      transition: all .2s;
      width: 200px;
      height: 200px;
      border-radius: 10px;
      border: dotted 2px #969696;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      :deep(.el-icon) {
        svg {
          width: 100%;
          height: 100%;
          path {
            transition: all .3s;
            fill: #afafaf;
          }
        }
        width: 60px;
        height: 60px;
      }
      &:hover {
        cursor: pointer;
        background-color: #f0f0f079;
        :deep(.el-icon) {
          svg path {
            fill: @main-color;
          }
        }
      }
    }
  }

}
</style>