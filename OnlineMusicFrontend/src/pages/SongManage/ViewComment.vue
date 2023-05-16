<template>
  <div class="viewcomment-container">
    <AllComments :id="data.id" :singer_name="data.singer_name" :song_name="data.song_name"></AllComments>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import router from '../../router'

const data = reactive({
  id: '', 
  singer_name: '',
  song_name: '',
})

onMounted(() => {
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.singer_name = routeValue.singer_name
  data.song_name = routeValue.song_name
})
</script>

<style scoped lang="less">
.viewcomment-container {
  width: 80%;
  max-width: 1000px;
  min-width: 800px;
}
</style>