<template>
  <el-table :data="data.singerList"  style="width: 90%; height: 90%;">

    <el-table-column prop="singer_name" label="歌手名" />
    <el-table-column prop="id" label="编号"  />
    
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="birthday" label="生日" />
    <el-table-column width="150" label="操作">

      <template #default="scope">
        <el-button type="primary" circle @click="editSinger(scope.row)"><el-icon><Edit /></el-icon></el-button>
        <el-button type="success" circle plain><el-icon><Plus /></el-icon></el-button>
        <el-button type="danger" circle plain><el-icon><Delete /></el-icon></el-button>
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

const handleGender = (str) => {
  if (str === true) return '男'
  else if (str === false) return '女'
  return '无'
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
      ElMessage.error('获取歌手信息失败')
    }
  }).catch(err => {
    console.log(err);
  })
})

</script>

<style scoped lang="less">

</style>