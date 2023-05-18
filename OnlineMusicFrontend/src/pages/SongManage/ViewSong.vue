<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <div v-else class="container">
    <audio :src="currentSongPath" ref="songAudio" preload="none"></audio>
    <el-table :data="filterTableData" style="width: 100%; height: 100%;">
      <el-table-column prop="song_name" label="歌曲名"  />
      <el-table-column prop="id" label="编号"/>
      <el-table-column prop="singer_name" label="所属歌手"  />
      <el-table-column prop="publish_time" label="发布时间" width="160"/>
      <el-table-column prop="visitors" label="访问量" align="center" sortable width="90"/>

      <el-table-column width="200">
        <template #header>
          <el-input v-model="data.searchInput" placeholder="搜索歌曲或歌手" maxLength="16">
              <template #prefix>
                <el-icon><search/></el-icon>
              </template>
          </el-input>
        </template>

        <template #default="scope">
          <!-- 编辑歌曲 -->
          <el-button type="primary" circle @click="editSong(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <!-- 播放歌曲 -->
          <el-button type="success" circle plain @click="playSong(scope.row.file_name)">
            <el-icon class="play-icon" v-show="scope.row.file_name != data.currentSongName || !data.playState"><VideoPlay /></el-icon>
            <el-icon  class="play-icon" v-show="scope.row.file_name == data.currentSongName && data.playState"><VideoPause /></el-icon>
          </el-button>
          <!-- 删除歌曲 -->
          <el-button type="danger" circle plain @click="deleteSong(scope.row.id, scope.row.song_name, scope.row.file_name)"><el-icon><Delete /></el-icon></el-button>
          <!-- 浏览该歌曲下的评论 -->
          <el-button type="info" circle plain @click="viewComment(scope.row.id, scope.row.song_name, scope.row.singer_name)"><el-icon><ChatLineSquare /></el-icon></el-button>
        </template>

      </el-table-column>
    
    <template #empty>
        <el-empty description="无歌曲数据"/>
    </template>
    </el-table>
  </div>

</template>

<script setup>
import { onMounted, reactive, computed, ref, nextTick } from 'vue'
import { useStore } from "../../pinia"
import axios from '../../utils/axios'
import { dayjs } from 'element-plus'
import router from '../../router'

const store = useStore()
const songAudio = ref(null)

const data = reactive({
  songList: [],
  searchInput: '',
  VITE_HOSTPORT: import.meta.env.VITE_HOSTPORT,
  currentSongName: '',
  playState: false,
})

const filterTableData = computed(() => {
  return data.songList.filter(item => {
    return !data.searchInput || item.song_name.toLowerCase().includes(data.searchInput.toLowerCase()) || item.singer_name.toLowerCase().includes(data.searchInput.toLowerCase())
  })
})

const currentSongPath = computed(() => {
  return `${data.VITE_HOSTPORT}/song/${data.currentSongName}`
})

const editSong = ({id, song_name, singer_name, file_name, singer_id}) => {
  router.replace({
    path: '/songManage/editSong',
    query: {id, song_name, singer_name, file_name, singer_id}
  })
}
const playSong = (file_name) => {
  if(songAudio.value.paused) {
    data.currentSongName = file_name
    data.playState = true
    nextTick(() => {
      songAudio.value.play()
    })
  }
  else { // 播放情况下
    if(file_name != data.currentSongName) {
      data.currentSongName = file_name
      data.playState = true
      nextTick(() => {
        songAudio.value.play()
      })
    }
    else {
      data.playState = false
      nextTick(() => {
        songAudio.value.pause()
      })
    }
  }

}
const deleteSong = (id, song_name, file_name) => {
  ElMessageBox.confirm(
  `此操作将删除歌曲 ${song_name} 以及其下的所有评论`,
  '警告',
  {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }
  )
  .then(() => {
    axios.post('/deleteSong', {id, file_name}).then(res => {
      if(res.data.code == 0) {
        for (let index = 0; index < data.songList.length; index++) {
          const element = data.songList[index];
          if(element.id == id) {
            data.songList.splice(index, 1)
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
  })
  .catch(() => {})
}

const viewComment = (id, song_name, singer_name) => {
  router.push({
    path: '/songManage/viewComment',
    query: {id, song_name, singer_name}
  })
}
onMounted(() => {
  axios.get('getAllSongsSimpleInfo').then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.songList.push({
          id: result.songInfo.id,
          song_name: result.songInfo.song_name,
          singer_id: result.songInfo.singer_id,
          singer_name: result.singer_name,
          visitors: result.songInfo.visitors, 
          file_name: result.songInfo.file_name,
          publish_time: dayjs(result.songInfo.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
})
// 停止时更改状态
nextTick(() => {
  songAudio.value.addEventListener('ended', () => {
    data.playState = false
  })
})
  
</script>

<style scoped lang="less">
.container {
  margin-top: 20px;
  width: 90%;
  max-width: 1000px;
  min-width: 800px;
  height: 90%;
  min-height: 400px;
}

.play-icon {
  transform: scaleX(1.5) scaleY(1.5)
}
</style>