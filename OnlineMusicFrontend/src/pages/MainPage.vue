<template>
  <el-empty description="管理员禁入" v-if="store.isAdmin" style="height: 100%;"/>
  <div v-else class="mainpage-container">

  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'

const store = useStore()
</script>

<style scoped lang="less">
.mainpage-container {

}
</style>