<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <div v-else class="container">
    <!-- 对话框查看评论详情 -->
    <el-dialog v-model="data.commentContentVisible" title="查看评论">
      <el-input v-model="data.currentContent" readonly resize="none" type="textarea" :rows="6"></el-input>
    </el-dialog>
    <el-table :data="filterTableData" style="width: 100%; height: 100%;">

      <el-table-column prop="id" label="编号" />
      <el-table-column prop="user_name" label="所属用户" />
      <el-table-column prop="song_name" label="所在歌曲" />
      <el-table-column prop="publish_time" label="发布时间" width="180"/>
      <el-table-column prop="favour" label="获赞数" width="90" align="center" sortable/>
      <el-table-column width="200" >
        <template #header>
          <el-input v-model="data.searchInput" class="search-input" placeholder="筛选用户和歌曲" maxLength="7">
            <template #prefix>
              <el-icon><search/></el-icon>
            </template>
          </el-input>
        </template>

        <template #default="scope">
          <el-button @click="viewComment(scope.row.content)">查看评论</el-button>
          <el-button type="danger" plain @click="deleteComment(scope.row.id)">删除</el-button>
        </template>

      </el-table-column>
      
      <template #empty>
        <el-empty description="无评论数据"/>
      </template>
    </el-table>
  </div>
  
</template>

<script setup>
import { onActivated, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'
import { dayjs } from 'element-plus';

const store = useStore()

const data = reactive({
  commentList: [],
  searchInput: '',
  currentContent: '',
  commentContentVisible: false,
})

const filterTableData = computed(() => {
  return data.commentList.filter(item => {
    return !data.searchInput || item.user_name.toLowerCase().includes(data.searchInput.toLowerCase()) || item.song_name.toLowerCase().includes(data.searchInput.toLowerCase())
  })
})

// 查看评论内容
const viewComment = (content) => {
  data.currentContent = content
  data.commentContentVisible = true
}
// 删除评论
const deleteComment = (id) => {
  ElMessageBox.confirm(
  `此操作将彻底删除该评论`,
  '警告',
  {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }
  )
  .then(() => {
    axios.post('/adminDeleteComment', {id}).then(res => {
      if(res.data.code == 0) {
        for (let index = 0; index < data.commentList.length; index++) {
          const element = data.commentList[index];
          if(element.id == id) {
            data.commentList.splice(index, 1)
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

onActivated(() => {
  if(store.isAdmin) {
    axios.get('getAllComments').then(res => {
      if(res.data.code == 0) {
        data.commentList = []
        for (const item of res.data.result) {
          data.commentList.push({
            id: item.id,
            user_name: item.user_name,
            song_name: item.song_name,
            favour: item.favour,
            content: item.content,
            publish_time: dayjs(item.publish_time).format('YYYY年MM月DD日 HH:mm')
          })
        }
      }
      else {
        ElMessage({
          message: '获取评论信息失败',
          type: 'error',
          duration: 1000
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }
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

.search-input {
  width: 160px;
  & :deep(.el-input__wrapper) {
    border-radius: 16px;
    .el-input__prefix {
      transition: .1s;
    }
    &:focus-within .el-input__prefix {
      color: @main-color;
    }
  }
}

</style>