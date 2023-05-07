<template>
  <div class="header-container">
    <img class="logo" src="../assets/OnlineMusic.svg" alt="">
    <div class="search-and-avatar">
      <!-- 搜索框 -->
      <el-input v-model="headerData.searchInput" class="search-input" placeholder="搜索音乐或歌手" clearable>
        <template #prefix>
          <el-icon class="el-input__icon"><search/></el-icon>
        </template>
      </el-input>
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          <!-- 头像 -->
          <el-avatar :size="36" src="">
            <img
              src="../assets/unLogin.svg"
            />
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="avatar-menu">
            <div v-if="store.isLogin">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
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
import { reactive } from 'vue';
import { useStore } from '../pinia'
import router from '../router';

const store = useStore()


const headerData = reactive({
  searchInput: ''
})

const jumpToLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="less">

.header-container {
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
  & /deep/ .el-input__wrapper {
    border-radius: 16px;
    .el-input__prefix {
      transition: .1s;
    }
    &:focus-within .el-input__prefix {
      color: @main-color;
    }
  }
}
.el-dropdown-link:hover {
  cursor: pointer;
}

.user-name {
  padding-left: 8px;
}
</style>
