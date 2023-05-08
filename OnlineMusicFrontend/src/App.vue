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
import { useStore } from './pinia'
import Header from './components/Header.vue'
import NProgress from "nprogress";
import "nprogress/nprogress.css"; 

NProgress.configure({ showSpinner: false })
const store = useStore()

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
</style>
