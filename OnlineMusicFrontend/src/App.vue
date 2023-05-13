<template>
  <Header></Header>

  <div class="body-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </div>
  
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './pinia'
import Header from './components/Header.vue'
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 
import axios from './utils/axios';

NProgress.configure({ showSpinner: false })
const store = useStore()

// 自动登录
onMounted(() => {
  if(!localStorage.getItem('token')) return
  axios.post('/autoLogin').then(res => {
    if(res.data.code == 0) {
      const userInfo = res.data.result.userInfo
      // 同步数据
      store.isLogin = true
      store.isAdmin = userInfo.is_admin
      store.userName = userInfo.user_name
      store.avatarPath = `${import.meta.env.VITE_HOSTPORT}/avatar/${userInfo.avatar_path}`
      ElMessage({
        message: `欢迎您，${store.userName}`,
        type: 'success'
      })
    }
    else {
      ElMessage({
        message: `身份信息过期，请重新登录`,
        type: 'warning'
      })
    }
  }).catch(err => {
    console.log(err);
  })
})

</script>

<style lang="less">
// 进度条颜色
#nprogress .bar {
  background: @main-color !important;  //颜色
}
.body-container {
  box-sizing: border-box;
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.el-avatar > img{
  width: 100%;
}

@keyframes opacity-from-to {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
