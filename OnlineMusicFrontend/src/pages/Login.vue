<template>
  <div class="login-container">
    <div class="logo-avatar">
      <el-avatar :size="80" :src="loginData.avatarUrl">
        <img src="../assets/OnlineMusic.svg"/>
      </el-avatar>
    </div>
    <!-- 输入框 -->
    <el-input v-model="loginData.userName" class="login-input" placeholder="账号" maxlength="7" @input="handleInput('userName')" @blur="handleBlur" ref="userNameInput">
      <template #prefix>
        <el-icon><UserFilled /></el-icon>
      </template>
    </el-input>
    <el-input v-model="loginData.password" class="login-input" placeholder="密码" type="password" show-password maxlength="12" @input="handleInput('password')" ref="passwordInput">
      <template #prefix>
        <el-icon><Lock /></el-icon>
      </template>
    </el-input>
    <!-- 登录按钮 -->
    <div class="buttons">
      <el-button type="primary" plain :disabled="!loginData.canLogin" class="login-button" @click="login">登录</el-button>
      <el-button type="primary" text class="register-button" @click="jumpToRegister">注册</el-button>
    </div>
    
  </div>
</template>

<script setup>
import { reactive, computed, nextTick, ref, onActivated } from 'vue'
import axios from '../utils/axios';
import router from '../router'
import { useStore } from '../pinia'

// 获取input元素
const userNameInput = ref(null)
const passwordInput = ref(null)

// 自动获取焦点
onActivated(() => {
  nextTick(() => {
    userNameInput.value.focus()
  })
})

const store = useStore()

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
    loginData.userName = loginData.userName.replace(/[^\u4e00-\u9fa5A-z0-9]|[\^\\_\[\]`]/g, '')
    if(loginData.userName == '') {
      loginData.avatarUrl = ''
    }
  }
  else {
    loginData.password = loginData.password.replace(/[^A-z0-9/]|[\^\\_\[\]`]/g, '')
  }
}

// 账号框失去焦点发送请求
const handleBlur = () => {
  if(loginData.userName == '') return
  axios.get(`/getUserAvatar?user_name=${loginData.userName}`).then(res => {
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
  }).catch(err => {
    console.log(err);
  })
}

// 跳转注册
const jumpToRegister = () => {
  router.push('/register')
}
// 登录
const login = () => {
  axios.post('/login', {
    user_name: loginData.userName,
    password: loginData.password
  }).then(res => {
    if(res.data.code == 0) {
      const userInfo = res.data.result.userInfo
      const token = res.data.result.token
      // 同步数据
      store.isLogin = true
      store.isAdmin = userInfo.is_admin
      store.userName = userInfo.user_name
      store.avatarPath = `http://localhost:3000/avatar/${userInfo.avatar_path}`
      // 存储token
      localStorage.setItem('token', token)
      if(store.isAdmin) {
        router.replace('/userManage')
      }
      else {
        router.replace('/')
      }
      ElMessage({
        message: `欢迎您，${store.userName}`,
        type: 'success',
      })
    }
    else {
      loginData.password = ''
      nextTick(() => {
        passwordInput.value.focus()
      })
      ElMessage({
        message: `密码错误，请重试`,
        type: 'error',
      })
    }
  }).catch(err => {
    console.log(err);
  })
}
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 20px;

}
.logo-avatar {
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
.buttons {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .login-button {
    width: 138px;
  }
  .register-button {
    width: 50px;
  }
}
</style>