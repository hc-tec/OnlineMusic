<template>
  <div class="input-row">
    <div class="input-label">编号：</div>
    <div class="input-container">
      <el-input v-model="data.id" :disabled="true" readonly/>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label">歌手名：</div>
    <div class="input-container">
      <el-input v-model="data.singer_name" placeholder="仅能包含汉字和字母，以及空格" @input="handleInput" maxLength="16" ref="singerName"/>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label">性别：</div>
    <div class="input-container">
      <el-radio-group v-model="data.gender">
        <el-radio label="男" border>男</el-radio>
        <el-radio label="女" border>女</el-radio>
        <el-radio label="无" border>无</el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label">生日：</div>
    <div class="input-container">
      <el-date-picker
        v-model="data.birthday"
        type="date"
        placeholder="点击以选择日期"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
      />
    </div>
  </div>
  <div class="input-row">
    <div class="input-label">歌手简介：</div>
    <div class="input-container">
      <el-input v-model="data.description"/>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label"></div>
    <div class="input-container">
      <el-button @click="editSinger" :disabled="!data.singer_name">保存</el-button>
    </div>
  </div>

</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from '../../utils/axios'
import router from '../../router'

const singerName = ref(null)

const data = reactive({
  singer_name: '',
  id: '',
  gender: '无',
  description: '',
  birthday: '',
})


onMounted(() => {
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.singer_name = routeValue.singer_name
  data.description = routeValue.description
  data.gender = routeValue.gender
  data.birthday = routeValue.birthday == '未知'? '' : routeValue.birthday
})


// 歌手名字格式（仅能为中文英文和空格，首位不能有任意位空格，中间不能有超过一位的空格）
const handleInput = () => {
  let temp = data.singer_name
  temp = temp.replace(/[^\u4e00-\u9fa5A-Za-z\s]/g, '').trim()
  data.singer_name = temp.replace(/[\s]{2,}/g, ' ')
}

const editSinger = () => {
  let editInfo = {}
  editInfo.id = data.id
  editInfo.singer_name = data.singer_name
  if(data.description) editInfo.description = data.description
  if(data.birthday) editInfo.birthday = data.birthday
  if(data.gender == '男') {
    editInfo.gender = 1
  }
  else if (data.gender == '女') {
    editInfo.gender = 0
  }

  axios.post('/changeSinger', editInfo).then(res => {
    if(res.data.code == 0) {
      router.replace('/singerManage/viewSinger')
      ElMessage.success('更新歌手信息成功')
    }
    else if (res.data.code == 10017) {
      singerName.value.focus()
      ElMessage.warning('该歌手已存在')
    }
    else {
      router.replace('/singerManage/viewSinger')
      ElMessage.success('更新歌手信息成功')
    }
  }).catch(err => {
    console.log(err);
  })


}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
</script>

<style scoped lang="less">
.input-row {
  width: 60%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;

  .input-label {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100px;
    margin-right: 20px;
  }
  .input-container {
    flex: 1;
    .el-input {
      width: 249px;
    }
  }
  
}

.el-button {
  margin-top: 20px;
  width: 155px;
}
</style>