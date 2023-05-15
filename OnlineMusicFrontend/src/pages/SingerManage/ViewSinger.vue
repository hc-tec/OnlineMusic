<template>
  <el-table :data="data.singerList"  style="width: 90%; height: 90%;">

    <el-table-column prop="singer_name" label="歌手名" />
    <el-table-column prop="id" label="编号"  />
    
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="birthday" label="生日" />
    <el-table-column width="150" label="操作">

      <template #default="scope">
        <el-button type="primary" circle @click="editSinger(scope.row)"><el-icon><Edit /></el-icon></el-button>
        <el-button type="success" circle plain @click="addSong(scope.row.id, scope.row.singer_name)"><el-icon><Plus /></el-icon></el-button>
        <el-button type="danger" circle plain @click="deleteSinger(scope.row.id, scope.row.singer_name)"><el-icon><Delete /></el-icon></el-button>
      </template>

    </el-table-column>
    
    <template #empty>
      <el-empty description="无歌手数据"/>
    </template>
  </el-table>
  
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from "../../pinia"
import axios from '../../utils/axios'
import router from '../../router'

const store = useStore()

const data = reactive({
  singerList: [],

})
const editSinger = (singerInfo) => {
  const { id, singer_name, gender, birthday, description } = singerInfo
  router.replace({
    path: '/singerManage/editSinger',
    query: {id, singer_name, gender, birthday, description}
  })
}
const addSong = (id, singer_name) => {
  router.replace({
    path: '/singerManage/addSong',
    query: { id, singer_name }
  })
}
const handleGender = (str) => {
  if (str === true) return '男'
  else if (str === false) return '女'
  return '无'
}

const deleteSinger = (id, singer_name) => {
  ElMessageBox.confirm(
  `此操作将删除歌手 ${singer_name} 及其所有歌曲`,
  '警告',
  {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }
  )
  .then(() => {
    axios.post('/deleteSinger', {id}).then(res => {
      if(res.data.code == 0) {
        for (let index = 0; index < data.singerList.length; index++) {
          const element = data.singerList[index];
          if(element.id == id) {
            data.singerList.splice(index, 1)
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

onMounted(() => {
  if(!store.isAdmin) return
  axios.get('getAllSingers').then(res => {
    if(res.data.code == 0) {
      for(const singerInfo of res.data.result) {
        data.singerList.push({
          singer_name: singerInfo.singer_name,
          id: singerInfo.id,
          gender: handleGender(singerInfo.gender),
          birthday: singerInfo.birthday || '未知',
          description: singerInfo.description
        })
      }
    }
    else {
      ElMessage({
        message: '获取歌手信息失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err);
  })
})

</script>

<style scoped lang="less">

</style>