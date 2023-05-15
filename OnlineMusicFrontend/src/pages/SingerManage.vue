<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <div v-else class="container">
    <div class="menu">
      <el-menu
        :default-active="data.activeIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item index="/singerManage/viewSinger">
          <span>歌手列表</span>
        </el-menu-item>
        <el-menu-item index="/singerManage/addSinger">
          <span>添加歌手</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useStore } from "../pinia";
import router from '../router';

const store = useStore()
const data = reactive({

})

data.activeIndex = computed(() => {
  const res = router.currentRoute.value.path.match('^/[^/]+/[^/]+')
  return res? res[0] : ''
})

const handleSelect = (key, keyPath) => {
  router.replace(key)
}

</script>

<style scoped lang="less">
.container {
  background-color: rgb(255, 255, 255);
  width: 80%;
  max-width: 1000px;
  min-width: 800px;
  height: 90%;
  min-height: 400px;
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
    position: relative;
    overflow: hidden;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.el-menu-vertical-demo {
  border-right: none;
  width: 120px;
  .el-menu-item {
    justify-content: center;
  }
}

</style>