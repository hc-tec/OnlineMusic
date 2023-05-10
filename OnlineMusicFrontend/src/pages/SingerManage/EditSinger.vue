<template>

<el-input v-model="data.id" readonly/>
<el-input v-model="data.singer_name"/>
<el-input v-model="data.gender"/>
<el-radio-group v-model="data.gender">
  <el-radio label="男" border>男<el-icon><Male /></el-icon></el-radio>
  <el-radio label="女" border>女</el-radio>
  <el-radio label="无" border>无</el-radio>
</el-radio-group>
<el-input v-model="data.birthday"/>
<el-date-picker
  v-model="data.birthday"
  type="date"
  placeholder="生日"
  value-format="YYYY-MM-DD"
/>
<el-input v-model="data.description"/>
  
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../../pinia"
import axios from '../../utils/axios'
import router from '../../router'
const data = reactive({
  singer_name: '',
  id: '',
  gender: '无',
  description: '',
  birthday: '',

})


onMounted(() => {
  console.log(router.currentRoute.value);
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.singer_name = routeValue.singer_name
  data.description = routeValue.description
  data.gender = routeValue.gender
  data.birthday = routeValue.birthday == '未知'? '' : routeValue.birthday
})


// 歌手名字格式（仅能为中文英文和空格，首位不能有任意位空格，中间不能有超过一位的空格）
const handleInput = (el) => {
  let temp = data.singerName
  temp = temp.replace(/[^\u4e00-\u9fa5A-z\s]|_/g, '').trim()
  data.singerName = temp.replace(/[\s]{2,}/g, ' ')
}
</script>

<style scoped lang="less">

</style>