<template>
  <div class="editsongku-container">
    <SongKuDetail
      :id="data.id"
      :ku_name="data.ku_name"
      :file_path="data.file_path"
      :description="data.description"
    ></SongKuDetail>
  </div>
  
  
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import router from '../../router'

const data = reactive({
  id: '', 
  ku_name: '',
  file_path: '',
  description: '',
})

onMounted(() => {
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.ku_name = routeValue.ku_name
  data.file_path = routeValue.file_path
  data.description = routeValue.description
})
</script>

<style scoped lang="less">
.editsongku-container {
  width: 80%;
  padding-top: 20px;
  height: 100%;
}
</style>