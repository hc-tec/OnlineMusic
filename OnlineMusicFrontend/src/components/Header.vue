<template>
  <div class="header-container">
    <!-- logo -->
    <img class="logo" src="../assets/OnlineMusic.svg" alt="">
    <!-- 导航栏 -->

    <el-menu
      :default-active="headerData.activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <template v-if="!store.isAdmin">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/loveSongs">我喜欢</el-menu-item>
        <el-menu-item index="/historySongs">历史记录</el-menu-item>
      </template>
      <template v-else>
        <el-menu-item index="/userManage">用户管理</el-menu-item>
        <el-menu-item index="/singerManage">歌手管理</el-menu-item>
        <el-menu-item index="/songManage">歌曲管理</el-menu-item>
        <el-menu-item index="/songKuManage">歌单管理</el-menu-item>
        <el-menu-item index="/commentManage">评论管理</el-menu-item>
      </template>
    </el-menu>

    <!-- 搜索框和头像 -->
    <div class="search-and-avatar">
      <!-- 搜索框 -->
      <el-input v-model="headerData.searchInput" class="search-input" placeholder="搜索音乐或歌手" clearable v-if="!store.isAdmin">
        <template #prefix>
          <el-icon><search/></el-icon>
        </template>
      </el-input>
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- 头像 -->
          <el-avatar :size="36" :src="store.avatarPath">
            <img src="../assets/unLogin.svg" />
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="avatar-menu">
            <div v-if="store.isLogin">
              <el-dropdown-item @click="jumpToUserCenter">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="exitLogin">退出登录</el-dropdown-item>
            </div>
            <div v-else>
              <el-dropdown-item @click="jumpToLogin">去登录</el-dropdown-item>
            </div>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 用户名 -->
      <el-text class="user-name">{{ store.userName || '未登录' }}</el-text>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useStore } from '../pinia'
import router from '../router';

const store = useStore()
const headerData = reactive({
  searchInput: '',
})

headerData.activeIndex = computed(() => {
  const res = router.currentRoute.value.path.match('^/[A-z]*')
  return res? res[0] : ''
})

// 标签页触发动作
const handleSelect = (key, keyPath) => {
  router.replace(key)
}

const jumpToLogin = () => {
  router.push('/login')
}
const jumpToUserCenter = () => {
  router.push('/userCenter')
}
const exitLogin = () => {
  localStorage.removeItem('token')
  router.replace('/')
  store.isLogin = false
  store.isAdmin = false
  store.avatarPath = ''
  store.userName = ''

  ElMessage({
    message: `登出成功`,
    type: 'success',
    duration: 1000
  })
}
</script>

<style scoped lang="less">

.header-container {
  z-index: 99;
  animation: opacity-from-to .5s;
  box-sizing: border-box;
  padding: 0 30px;
  position: fixed;
  width: 100%;
  height: 60px;
  background-image:radial-gradient(transparent 1px, white 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(10px);
  
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.logo {
  width: 36px;
}
.search-and-avatar {
  height: 100%;
}
.search-input {
  width: 200px;
  margin-right: 20px;
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
.el-dropdown-link {
  padding-right: 10px;
  &:hover {
    cursor: pointer;
  }
}

.user-name {
  font-weight: bold;
  animation: opacity-from-to 1s;
}
.el-menu-demo {
  border-bottom: none;
  background-color: transparent;
  .el-menu-item {
    padding: 0 28px;
  }
}


// 响应式
@media screen and (max-width: 800px) {
  .header-container {
    padding: 0 10px;
  }
  .user-name {
    display: none;
  }
}

</style>
