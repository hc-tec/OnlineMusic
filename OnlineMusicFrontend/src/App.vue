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
const store = useStore()

</script>

<style scoped lang="less">
.body-container {
  padding-top: 60px;
}
</style>
