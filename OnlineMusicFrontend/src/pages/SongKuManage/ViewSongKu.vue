<template>
  <div class="viewsongku-container" ref="viewSongKu" :style="{
    'grid-template-columns': `repeat(${gridStyle}, 1fr)`
  }">
    
    <div class="songkucomponent" v-for="item in data.songKuList" :key="item.id">
      <SongKu
        :imgSrc="item.file_path"
        :handleIconClick="handleIconClick"
        :handleClick="handleClick"
        :songKuName="item.ku_name"
        :id="item.id"
        :description="item.description"
      ></SongKu>
    </div>

    <div class="songkucomponent">
      <div class="addsongku-container" @click="jumpToAddSongKu">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    
  </div>

  
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import axios from '../../utils/axios'
import router from '../../router';

const viewSongKu = ref(null)
const { width } = useElementSize(viewSongKu)

const gridStyle = computed(() => {
  if(width.value > 1320) return 6
  if(width.value > 1100) return 5
  if(width.value > 880) return 4
  return 3
})

const data = reactive({
  songKuList: []
})

const jumpToAddSongKu = () => {
  router.push('/songKuManage/addSongKu')
}
// 删除歌单
const handleIconClick = (id) => {
  axios.post('/deleteSongKu',{id}).then(res => {
    if(res.data.code == 0) {
      for (let index = 0; index < data.songKuList.length; index++) {
        const element = data.songKuList[index];
        if(element.id == id) {
          data.songKuList.splice(index, 1)
          break;
        }
      }
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      })
    }
    else {
      ElMessage({
        message: '删除失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err);
  })
}

const handleClick = (id, ku_name, file_path, description) => {
  router.push({
    path: '/songKuManage/editSongKu',
    query: {id, ku_name, file_path, description}
  })
}

onMounted(() => {
  axios.get('/getAllSongKus').then(res => {
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
  
})
</script>

<style scoped lang="less">
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