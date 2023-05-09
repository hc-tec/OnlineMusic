<template>
  <div class="register-container">
    <!-- 输入框 -->
    <el-input v-model="registerData.userName" class="register-input" placeholder="账号" maxlength="7" @input="handleInput('userName')" ref="userNameInput">
      <template #prefix>
        <el-icon><UserFilled /></el-icon>
      </template>
    </el-input>
    <el-input v-model="registerData.password" class="register-input" placeholder="密码" type="password" show-password maxlength="12" @input="handleInput('password')">
      <template #prefix>
        <el-icon><Lock /></el-icon>
      </template>
    </el-input>
    <el-input v-model="registerData.password2" class="register-input" placeholder="确认密码" type="password" show-password maxlength="12" @input="handleInput('password2')" @blur="handleBlur" ref="password2Input">
      <template #prefix>
        <el-icon><Key /></el-icon>
      </template>
    </el-input>
    <!-- 注册按钮 -->
    <div class="buttons">
      <el-button type="primary" plain :disabled="!registerData.canRegister" class="register-button" @click="register">注册</el-button>
    </div>
    
  </div>
  
</template>

<script setup>
import { reactive, computed, nextTick, ref, onActivated } from 'vue'
import axios from '../utils/axios';
import router from '../router'
import { useStore } from '../pinia'
import _ from 'lodash'

const store = useStore()
const userNameInput = ref(null)
const password2Input = ref(null)

// 自动获取焦点
onActivated(() => {
  nextTick(() => {
    userNameInput.value.focus()
  })
})

const registerData = reactive({
  userName: '',
  password: '',
  password2: '',
})

registerData.canRegister = computed(() => {
  if(!registerData.userName || !registerData.password || !registerData.password2) return false
  return registerData.password == registerData.password2
})

const handleInput = (el) => {
  if (el == 'userName') {
    registerData.userName = registerData.userName.replace(/[^\u4e00-\u9fa5A-z0-9]|_/g, '')
    if(registerData.userName == '') {
      registerData.avatarUrl = ''
    }
  }
  else if(el == 'password') {
    registerData.password = registerData.password.replace(/[^A-z0-9/]|_/g, '')
  }
  else {
    registerData.password2 = registerData.password2.replace(/[^A-z0-9/]|_/g, '')
  }
}

const handleBlur = _.debounce(() => {
  if(registerData.password && registerData.password2 && registerData.password != registerData.password2) {
    nextTick(() => {
      password2Input.value.focus()
    })
    ElMessage({
      message: '密码两次的输入不一致',
      type: 'warning',
    })
  }
}, 500)

// 注册
const register = () => {
  axios.post('/register', {
    user_name: registerData.userName,
    password: registerData.password
  }).then(res => {
    if(res.data.code == 0){
      ElMessageBox.confirm('请问是否立即使用此账号登入？', '注册成功', {
        autofocus: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        axios.post('/login', {
          user_name: registerData.userName,
          password: registerData.password
        }).then(res2 => {
          const userInfo = res2.data.result.userInfo
          const token = res2.data.result.token
          // 同步数据
          store.isLogin = true
          store.isAdmin = userInfo.is_admin
          store.userName = userInfo.user_name
          store.avatarPath = `http://localhost:3000/avatar/${userInfo.avatar_path}`
          // 存储token
          localStorage.setItem('token', token)
          router.replace('/')
          ElMessage({
            message: `欢迎您，${store.userName}`,
            type: 'success',
          })
        }).catch(err2 => {
          console.log(err2);
        })
      }).catch(() => {})
    }
    else {
      registerData.userName = ''
      nextTick(() => {
        userNameInput.value.focus()
      })
      ElMessage({
        message: `用户已存在`,
        type: 'warning',
      })
    }
  }).catch(err => {
    console.log(err);
  })
}
</script>

<style scoped lang="less">
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 20px;
}

.register-input {
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

  .register-button {
    width: 200px;
  }
}

</style>