<template>
  <el-empty description="没有管理员权限" v-if="!store.isAdmin"/>

  <div v-else class="editsong-container">
    <div class="input-row">
      <div class="input-label"></div>
      <div class="input-container">
        <h2 class="editsong-title">
          编辑歌手<span>{{ data.singer_name }}</span>的歌曲
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
        <div class="editsong-buttons">
          <el-upload
            :on-change="songChange" 
            :auto-upload="false" 
            :show-file-list="false" 
            accept="audio/mp3" 
          >
            <el-button type="primary">{{data.uploadFile? '替换歌曲文件' : '选择歌曲文件' }}</el-button>
          </el-upload>
          <el-button @click="editSong" :disabled="!data.song_name">确定</el-button>
        </div>
      </div>
    </div>
  </div>
  

</template>

<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { useStore } from '../../pinia'
import router from '../../router'
import axios from '../../utils/axios'

const store = useStore()
const songName = ref(null)

const data = reactive({
  song_name: '',
  lyric: '',
  uploadFile: null,
  id: '',
  singer_name: '',
  old_file_name: '',
  singer_id: '',
})

const editSong = () => {
  let formData = new FormData()
  if(data.uploadFile) {
    formData.append('file', data.uploadFile)
    formData.append('old_file_name', data.old_file_name)
  }
  formData.append('id', data.id)
  formData.append('singer_id', data.singer_id)
  formData.append('lyric', data.lyric)
  formData.append('song_name', data.song_name)
  

  axios.post('/changeSong', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  }).then(res => {
    if(res.data.code == 0 || res.data.code == 10027) {
      data.uploadFile = null
      router.replace('/songManage/viewSong')
      ElMessage.success('编辑音乐成功')
    }
    else if(res.data.code == 10025) {
      songName.value.focus()
      ElMessage.warning('音乐名已存在')
    }
    else{
      ElMessage.error('编辑音乐失败')
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
  temp = temp.replace(/[^\u4e00-\u9fa5A-Za-z\s]/g, '').trim()
  data.song_name = temp.replace(/[\s]{2,}/g, ' ')
}
onMounted(() => {
  const routeValue = router.currentRoute.value.query
  data.id = routeValue.id
  data.song_name = routeValue.song_name
  data.singer_name = routeValue.singer_name
  data.old_file_name = routeValue.file_name
  data.singer_id = routeValue.singer_id

  axios.get(`/getSongLyric?id=${data.id}`).then(res => {
    if(res.data.code == 0) {
      data.lyric = res.data.result
    }
  }).catch(err => {
    console.log(err)
  })

  nextTick(() => {
    songName.value.focus()
  })
})
</script>

<style scoped lang="less">
.editsong-container {
  width: 80%;
  max-width: 1000px;
  min-width: 800px;
  height: 90%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 6px 1px #dedede;
}
.editsong-title {
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
    .editsong-buttons {
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