<template>
  <div class="container">
    <div class="avatar" :style="{backgroundImage: `url(${data.avatarUrl})`}">
      <div class="mask">
        <el-upload
          :on-change="avatarChange" 
          :auto-upload="false" 
          :show-file-list="false" 
          list-type="picture"
          accept="image/jpeg, image/webp, image/png" 
        >
          <el-icon><Edit /></el-icon>
        </el-upload>
      </div>
    </div>
    <el-button type="primary" plain :disabled="!data.canSave" @click="saveChange">保存</el-button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from '../../utils/axios';
import { useStore } from '../../pinia'
import { ImageJudger } from '../../utils/ImageJudger.ts'

const store = useStore()

const data = reactive({
  avatarUrl: store.avatarPath,
  canSave: false,
  uploadFile: null,
})

// 选择的文件变化时
const avatarChange = (file) => {
  // 获取文件真实类型，不受后缀名影响
  let imageJudger = new ImageJudger(file.raw)
  imageJudger.getImageType(imageType => {
    if(!['JPG','PNG','WEBP'].includes(imageType)) {
      ElMessage.error('上传文件格式不合法')
    }
    else if(file.raw.size > 1024 * 1024 * 2) {
      ElMessage.warning('头像文件过大')
    }
    else {
      data.canSave = true
      data.avatarUrl = file.url
      data.uploadFile = file.raw
    }
  })
}

const saveChange = () => {
  let formData = new FormData()
  formData.append('file', data.uploadFile)

  axios.post('/changeAvatar', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
  .then(res => {
    if(res.data.code == 0) {
      store.avatarPath = `${import.meta.env.VITE_HOSTPORT}/avatar/${res.data.result.newAvatarName}`
      ElMessage.success('头像更新成功')
      data.canSave = false
    }
    else {
      ElMessage.error('头像更新失败')
    }
  })
  .catch((error) => {
    console.log(error);
  })
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .avatar {
    width: 120px;
    height: 120px;
    background-size: cover;
    background-repeat: no-repeat;
    background-origin: 60px, 60px;
    border-radius: 50%;
    transition: .3s;

    .mask {
      transition: .3s;
      border-radius: 50%;
      opacity: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.3);

      &:hover {
        opacity: 1;
      }

      .el-icon {
        transition: .2s;
        transform: scale(1.9);
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          color: @main-color;
          transform: scale(2);
          cursor: pointer;
        }
        &:active {
          transform: scale(1.8);
        }
      }
    }
  }

  .el-button {
    width: 80px;
    margin-top: 40px;
  }
}
</style>