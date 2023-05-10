<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <div v-else class="container">
    <el-dialog v-model="data.imageVisible" :show-close="false" class="image-dialog">
      <el-image class="large-image" :src="data.currentImageUrl"/>
    </el-dialog>
    <el-table :data="filterTableData" height="400" style="width: 100%">
      <!-- 头像列 -->
      <el-table-column label="头像" >
        <template #default="scope">
          <el-image
            class="avatar-image"
            :src="`http://localhost:3000/avatar/${scope.row.avatar_path}`"
            fit="cover"
            @click="showLargeImage(scope.row.avatar_path)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号"  />
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column prop="is_admin" label="身份" />
      <el-table-column width="200">
        <template #header>
          <el-input v-model="data.searchInput" class="search-input" placeholder="搜索用户" maxLength="7">
            <template #prefix>
              <el-icon><search/></el-icon>
            </template>
          </el-input>
        </template>

        <template #default="scope">
          <el-button :disabled="scope.row.is_admin == '管理员'" @click="resetPassword(scope.row.id)">重置密码</el-button>
          <el-button type="danger" plain :disabled="scope.row.is_admin == '管理员'" @click="deleteUser(scope.row.id, scope.row.user_name, scope.row.avatar_path)">删除</el-button>
        </template>

      </el-table-column>
      
      <template #empty>
        <el-empty description="无用户数据"/>
      </template>
    </el-table>
  </div>
  
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'

const store = useStore()

const data = reactive({
  UserList: [],
  searchInput: '',
  currentImageUrl: '',
  imageVisible: false
})

const filterTableData = computed(() => {
  return data.UserList.filter(item => {
    return !data.searchInput || item.user_name.toLowerCase().includes(data.searchInput.toLowerCase())
  })
})
const showLargeImage = (url) => {
  data.currentImageUrl = `http://localhost:3000/avatar/${url}`
  data.imageVisible = true
}
// 重置用户密码为123456
const resetPassword = (id) => {
  axios.post('resetPassword', {id}).then(res => {
    if(res.data.code == 0) {
      ElMessage.success('重置密码成功')
    }
    else {
      ElMessage.error('重置密码成功')
    }
  }).catch(err => {
    console.log(err)
  })
}
// 删除用户
const deleteUser = (id, user_name, avatar_path) => {
  ElMessageBox.confirm(
  `此操作将删除用户 ${user_name} 及其所有数据`,
  '警告',
  {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }
  )
  .then(() => {
    axios.post('/deleteUser', {id, avatar_path}).then(res => {
      if(res.data.code == 0) {
        for (let index = 0; index < data.UserList.length; index++) {
          const element = data.UserList[index];
          if(element.id == id) {
            data.UserList.splice(index, 1)
            break;
          }
        }
        ElMessage.success('删除成功')
      }
      else {
        ElMessage.error('删除失败')
      }
    }).catch(err => {
      console.log(err);
    })
  })
  .catch(() => {})
}

onMounted(() => {
  if(store.isAdmin) {
    axios.get('getAllUsers').then(res => {
      if(res.data.code == 0) {
        for (const userInfo of res.data.result) {
          data.UserList.push({
            avatar_path: userInfo.avatar_path,
            id: userInfo.id,
            user_name: userInfo.user_name,
            is_admin: userInfo.is_admin? '管理员' : '用户'
          })
        }
      }
      else {
        ElMessage.error('获取用户信息失败')
      }
    }).catch(err => {
      console.log(err);
    })
  }
})

</script>

<style scoped lang="less">
.container {
  width: 80%;
  max-width: 900px;
  min-width: 700px;
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

.avatar-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
}

:deep(.image-dialog) {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body{
    padding: 0;
    .large-image {
      width: 100%;
      display: block;
    }
  }
}

</style>