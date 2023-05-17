<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>
  <router-view v-else></router-view>
</template>

<script setup>
import { useStore } from "../pinia";
const store = useStore()

</script>

<style scoped lang="less">

</style>