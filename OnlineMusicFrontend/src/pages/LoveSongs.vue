<template>
  <el-empty description="请登录" v-if="!store.isLogin" style="height: 100%;"/>
  <el-empty description="管理员禁入" v-else-if="store.isAdmin" style="height: 100%;"/>
  <div v-else class="lovesong-container">
    <h1>我喜欢</h1>
  </div>
  
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'

const store = useStore()
</script>

<style scoped lang="less">

</style>