<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <div v-else class="container">
    <el-table :data="filterTableData" style="width: 100%; height: 100%;">
      <el-table-column prop="song_name" label="歌曲名"  />
      <el-table-column prop="id" label="编号"/>
      <el-table-column prop="singer_name" label="所属歌手"  />
      <el-table-column prop="publish_time" label="发布时间" width="170"/>
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
          <el-button type="primary" circle @click="editSong(scope.row)"><el-icon><Edit /></el-icon></el-button>
          <el-button type="success" circle plain @click="playSong()"><el-icon class="play-icon"><CaretRight /></el-icon></el-button>
          <el-button type="danger" circle plain @click="deleteSong()"><el-icon><Delete /></el-icon></el-button>
        </template>

      </el-table-column>
    
    <template #empty>
        <el-empty description="无歌曲数据"/>
    </template>
    </el-table>
  </div>

</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import { useStore } from "../../pinia"
import axios from '../../utils/axios'
import { dayjs } from 'element-plus'
import router from '../../router'

const store = useStore()

const data = reactive({
  songList: [],
  searchInput: '',
  VITE_HOSTPORT: import.meta.env.VITE_HOSTPORT,
})

const filterTableData = computed(() => {
  return data.songList.filter(item => {
    return !data.searchInput || item.song_name.toLowerCase().includes(data.searchInput.toLowerCase()) || item.singer_name.toLowerCase().includes(data.searchInput.toLowerCase())
  })
})


const editSong = ({id, song_name, singer_name, file_name, singer_id}) => {
  router.replace({
    path: '/songManage/editSong',
    query: {id, song_name, singer_name, file_name, singer_id}
  })
}
const playSong = () => {

}
const deleteSong = () => {

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
        publish_time: dayjs(result.songInfo.publish_time).format('YYYY-MM-DD HH:mm:ss')
      })
    }
  }
}).catch(err => {
  console.log(err)
})
})
</script>

<style scoped lang="less">
.container {
width: 90%;
max-width: 1000px;
min-width: 800px;
height: 90%;
min-height: 400px;
}

.play-icon {
transform: scaleX(2) scaleY(1.5)
}
</style>