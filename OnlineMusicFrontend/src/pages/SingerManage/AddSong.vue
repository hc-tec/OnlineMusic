<template>
  <div class="input-row">
    <div class="input-label"></div>
    <div class="input-container">
      <h2 class="addsong-title">
        为歌手<span>{{ data.singer_name }}</span>添加歌曲
      </h2>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label">歌曲名：</div>
    <div class="input-container">
      <el-input v-model="data.song_name" placeholder="仅能包含汉字和字母，以及空格" @input="handleInput" maxLength="16" ref="songName"/>
    </div>
  </div>
  
  <div class="input-row" :style="{height: '140px'}">
    <div class="input-label">歌词：</div>
    <div class="input-container">
      <el-input resize="none" type="textarea" :rows="6" v-model="data.lyric" placeholder="歌词可以为空"/>
    </div>
  </div>
  <div class="input-row">
    <div class="input-label"></div>
    <div class="input-container">
      <div class="addsong-buttons">
        <el-upload
          :on-change="songChange" 
          :auto-upload="false" 
          :show-file-list="false" 
          accept="audio/mp3" 
        >
          <el-button type="primary">{{data.uploadFile? '替换歌曲文件' : '选择歌曲文件' }}</el-button>
        </el-upload>
        <el-button @click="addSong" :disabled="!data.song_name || !data.uploadFile">确定</el-button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import router from '../../router'
import axios from '../../utils/axios'

const songName = ref(null)

const data = reactive({
  song_name: '',
  lyric: '',
  uploadFile: null,
  id: '',
  singer_name: ''
})

const addSong = () => {
  let formData = new FormData()
  formData.append('file', data.uploadFile)
  formData.append('singer_id', data.id)
  formData.append('lyric', data.lyric)
  formData.append('song_name', data.song_name)

  axios.post('/addSong', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  }).then(res => {
    if(res.data.code == 0) {
      data.uploadFile = null
      ElMessage.success('添加音乐成功')
    }
    else if(res.data.code == 10025) {
      songName.value.focus()
      ElMessage.warning('该音乐已存在')
    }
    else{
      ElMessage.error('添加音乐失败')
    }
  }).catch(err => {
    console.log(err)
  })
}

const songChange = (file) => {
  if(file.raw.size > 1024 * 1024 * 10) {
    ElMessage.warning('音乐文件过大')
    return
  }
  else if (file.raw.type != 'audio/mpeg') {
    ElMessage.warning('文件格式不合法')
    return
  }
  data.uploadFile = file.raw
}
const handleInput = () => {
  let temp = data.song_name
  temp = temp.replace(/[^\u4e00-\u9fa5A-z\s]|[\^\\_\[\]`]/g, '').trim()
  data.song_name = temp.replace(/[\s]{2,}/g, ' ')
}
onMounted(() => {
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.singer_name = routeValue.singer_name

  nextTick(() => {
    songName.value.focus()
  })
})
</script>

<style scoped lang="less">
.addsong-title {
  font-size: 18px;
  span {
    position: relative;
    opacity: .7;
    border-radius: 8px;
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
      border-radius: 8px;
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
    .addsong-buttons {
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