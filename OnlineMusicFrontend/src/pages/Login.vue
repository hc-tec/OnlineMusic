<template>
  <div class="login-container">
    <div class="logo-avatar">
      <el-avatar :size="80" :src="loginData.avatarUrl">
        <img src="../assets/OnlineMusic.svg"/>
      </el-avatar>
    </div>
    <!-- 输入框 -->
    <el-input v-model="loginData.userName" class="login-input" placeholder="账号" maxlength="7" @input="handleInput('userName')" @blur="handleBlur">
      <template #prefix>
        <el-icon><UserFilled /></el-icon>
      </template>
    </el-input>
    <el-input v-model="loginData.password" class="login-input" placeholder="密码" type="password" show-password maxlength="12" @input="handleInput('password')">
      <template #prefix>
        <el-icon><Lock /></el-icon>
      </template>
    </el-input>
    <!-- 登录按钮 -->
    <el-button type="primary" plain :disabled="!loginData.canLogin" class="login-button">登录</el-button>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import axios from '../utils/axios';

const loginData = reactive({
  avatarUrl: '',
  loginText: '登录在线音乐点播系统',
  userName: '',
  password: '',
  userExist: false,
})

loginData.canLogin = computed(() => {
  if(loginData.userName == '') return false
  if(loginData.password == '') return false
  return loginData.userExist
})

const handleInput = (el) => {
  if (el == 'userName') {
    loginData.userName = loginData.userName.replace(/[^\u4e00-\u9fa5A-z0-9]/g, '')
    if(loginData.userName == '') {
      loginData.avatarUrl = ''
    }
  }
  else {
    loginData.password = loginData.password.replace(/[^A-z0-9/]/g, '')
  }
}

// 账号框失去焦点发送请求
const handleBlur = () => {
  if(loginData.userName == '') return
  axios.get(`http://localhost:3000/getUserAvatar?user_name=${loginData.userName}`).then(res => {
    if(res.data.code == 0) {
      // 获取成功
      loginData.userExist = true
      loginData.avatarUrl = `http://localhost:3000/avatar/${res.data.result}`
    }
    else {
      loginData.userExist = false
      loginData.avatarUrl = ''
      ElMessage({
        message: '该用户不存在',
        type: 'warning',
      })
    }
  })
}

</script>

<style scoped lang="less">
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  span {
    font-size: 26px;
    font-weight: 700;
    color: rgb(51, 54, 57);
    margin-top: 20px;
  }

}
.logo-avatar {
  transition: 3s;
  .el-avatar {
    background: none;
  }
}

// 输入框图片变色
.login-input {
  width: 200px;
  margin-top: 20px;
  & :deep(.el-input__wrapper) {
    .el-input__prefix {
      transition: .1s;
    }
    &:focus-within .el-input__prefix {
      color: @main-color;
    }
  }
}

.login-button {
  margin-top: 20px;
  width: 200px;
}
</style>