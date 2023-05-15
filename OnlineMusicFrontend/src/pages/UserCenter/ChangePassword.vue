<template>
  <div class="changepassword-container">
    <!-- 输入框 -->
    <el-input v-model="changePasswordData.oldPassword" class="change-input" placeholder="原密码" maxlength="12" type="password" show-password @input="handleInput('oldPassword')">
      <template #prefix>
        <el-icon><Lock /></el-icon>
      </template>
    </el-input>

    <el-input v-model="changePasswordData.password" class="change-input" placeholder="新密码" type="password" show-password maxlength="12" @input="handleInput('password')">
      <template #prefix>
        <el-icon><Key /></el-icon>
      </template>
    </el-input>

    <!-- 修改 -->
    <el-button type="primary" plain :disabled="!changePasswordData.canChange" @click="changePassword">修改</el-button>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import axios from '../../utils/axios';

const changePasswordData = reactive({
  oldPassword: '',
  password: ''
})

changePasswordData.canChange = computed(() => {
  return changePasswordData.password && changePasswordData.oldPassword && changePasswordData.oldPassword != changePasswordData.password
})

const handleInput = (el) => {
  if (el == 'oldPassword') {
    changePasswordData.oldPassword = changePasswordData.oldPassword.replace(/[^A-Za-z0-9]/g, '')
  }
  else {
    changePasswordData.password = changePasswordData.password.replace(/[^A-Za-z0-9]/g, '')
  }
}

const changePassword = () => {
  axios.post('/changePassword', {
    old_password: changePasswordData.oldPassword,
    password: changePasswordData.password
  }).then(res => {
    if(res.data.code == 0) {
      changePasswordData.oldPassword = changePasswordData.password
      ElMessage({
        message: '修改密码成功',
        type: 'success',
        duration: 1000
      })
    }
    else {
      ElMessage({
        message: '原密码错误',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err);
  })
}

</script>

<style scoped lang="less">
.changepassword-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  .el-button {
    width: 200px;
    margin-top: 30px;
  }
}

.change-input {
  width: 200px;
  margin-top: 30px;
  & :deep(.el-input__wrapper) {
    .el-input__prefix {
      transition: .1s;
    }
    &:focus-within .el-input__prefix {
      color: @main-color;
    }
  }
}
</style>