<template>
  <div class="addsongku-container">
    <div class="input-row">
      <div class="input-label"></div>
      <div class="input-container">
        <h2 class="addsongku-title">
          创建新的歌单
        </h2>
      </div>
    </div>
    <div class="input-row">
      <div class="input-label">歌单名：</div>
      <div class="input-container">
        <el-input v-model="data.ku_name" placeholder="仅能包含汉字和字母，以及空格" @input="handleInput" maxLength="16" ref="kuName"/>
      </div>
    </div>
    
    <div class="input-row" :style="{height: '140px'}">
      <div class="input-label">歌单简介：</div>
      <div class="input-container">
        <el-input resize="none" type="textarea" :rows="6" v-model="data.description" placeholder="歌单简介可以为空"/>
      </div>
    </div>
    <div class="input-row">
      <div class="input-label"></div>
      <div class="input-container">
        <div class="addsongku-buttons">
          <el-upload
            :on-change="songKuChange" 
            :auto-upload="false" 
            :show-file-list="false" 
            accept="image/jpeg, image/webp, image/png" 
          >
            <el-button type="primary">{{data.uploadFile? '替换歌单封面文件' : '选择歌单封面文件' }}</el-button>
          </el-upload>
          <el-button @click="addSongKu" :disabled="!data.ku_name">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import router from '../../router'
import axios from '../../utils/axios'

const kuName = ref(null)

const data = reactive({
  ku_name: '',
  description: '',
  uploadFile: null,
})

const addSongKu = () => {
  let formData = new FormData()
  formData.append('file', data.uploadFile)
  formData.append('description', data.description)
  formData.append('ku_name', data.ku_name)

  axios.post('/addSongKu', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  }).then(res => {
    if(res.data.code == 0) {
      data.uploadFile = null
      router.back()
      ElMessage({
        message: '新建歌单成功',
        type: 'success',
        duration: 1000
      })
    }
    else if(res.data.code == 10050) {
      kuName.value.focus()
      ElMessage({
        message: '该歌单已存在',
        type: 'warning',
        duration: 1000
      })
    }
    else{
      ElMessage({
        message: '新建歌单失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

const songKuChange = (file) => {
  if(file.raw.size > 1024 * 1024 * 5) {
    ElMessage({
        message: '歌单封面文件过大',
        type: 'warning',
        duration: 1000
      })
    return
  }
  else if (!['image/jpeg', 'image/webp', 'image/png'].includes(file.raw.type)) {
    ElMessage({
        message: '文件格式不合法',
        type: 'warning',
        duration: 1000
      })
    return
  }
  data.uploadFile = file.raw
}
const handleInput = () => {
  let temp = data.ku_name
  temp = temp.replace(/[^\u4e00-\u9fa5A-Za-z\s]/g, '').trim()
  data.ku_name = temp.replace(/[\s]{2,}/g, ' ')
}
onMounted(() => {
  nextTick(() => {
    kuName.value.focus()
  })
})
</script>

<style scoped lang="less">
.addsongku-container {
  width: 80%;
  min-width: 800px;
  max-width: 1000px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.addsongku-title {
  font-size: 18px;
  span {
    position: relative;
    opacity: .8;
    border-radius: 6px;
    padding: 0 5px;
    margin: 0 5px;
    display: inline-block;
    transform: translateY(1px);
    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 6px;
      background-color: @main-color;
      opacity: .3;
    }
  }
}
.input-row {
  width: 60%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;

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
    .addsongku-buttons {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .el-button {
        margin-right: 40px;
        margin-top: 20px;
      }
    }
  }
  
}
</style>