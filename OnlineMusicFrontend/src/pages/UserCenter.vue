<template>

  <div class="usercenter-container">
    <div class="menu">
      <el-menu
        :default-active="userCenterData.activeIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="/userCenter/changePassword">
          <span>密码修改</span>
        </el-menu-item>
        <el-menu-item index="/userCenter/changeAvatar">
          <span>头像修改</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import router from '../router';

const userCenterData = reactive({

})

userCenterData.activeIndex = computed(() => {
  const res = router.currentRoute.value.fullPath.match('^/[^/]+/[^/]+')
  return res? res[0] : ''
})

const handleSelect = (key, keyPath) => {
  router.replace(key)
}

</script>

<style scoped lang="less">
.usercenter-container {
  background-color: rgb(255, 255, 255);
  width: 70%;
  max-width: 800px;
  min-width: 600px;
  min-height: 400px;
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 6px 1px #dedede;
  .menu {
    height: 90%;
    border-right: dotted 2px #dcdfe6;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-menu-vertical-demo {
    border-right: none;
    width: 120px;
    .el-menu-item {
      justify-content: center;
    }
  }
}
</style>