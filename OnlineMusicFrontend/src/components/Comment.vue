<template>
  <div class="comment-container">
    <div class="delete-container" v-if="store.isAdmin || store.userName == data.user_name">
      <el-icon @click="deleteComment(data.id)"><Delete /></el-icon>
    </div>
    <el-avatar :size="54" :src="data.avatar_path">
      <img src="../assets/unLogin.svg" />
    </el-avatar>
    <div class="content-time">
      <div class="content">
        <span class="user-name">{{ data.user_name }}： </span>
        <span class="content-info"> {{ data.content }} </span>
      </div>
      <div class="time">
        <div class="publish-time" >
          <el-icon><Clock /></el-icon>
          {{ data.publish_time }}
        </div>
        <div class="favour" @click="handleFavour(data.id, data.has_zan)">
          <ZanIcon myIconSize="16" :myIconColor="data.has_zan? '#409EFF' : 'darkgrey'"></ZanIcon>
          <span>{{ data.favour }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../pinia'
import {reactive} from 'vue'

const props = defineProps({
  has_zan: Boolean,
  id: Number,
  avatar_path: String,
  user_name: String,
  content: String,
  publish_time: String,
  favour: Number,

  // 方法
  deleteComment: Function,
  handleFavour: Function,
})

const data = reactive({
  has_zan: props.has_zan,
  id: props.id,
  avatar_path: props.avatar_path,
  user_name: props.user_name,
  content: props.content,
  publish_time: props.publish_time,
  favour: props.favour,

})

const store = useStore()

const deleteComment = props.deleteComment

const handleFavour = props.handleFavour


</script>

<style scoped lang="less">
.comment-container {
  margin: 10px 0;
  position: relative;
  transition: all .3s;
  background-color: white;
  width: 100%;
  border-radius: 8px;
  padding: 20px 24px;
  box-sizing: border-box;
  border: 1px solid rgb(239, 239, 245);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  &:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04);
    .delete-container {
      visibility: visible;
      opacity: 1;
    }
  }
  .el-avatar {
    margin-right: 16px;
  }

  .content-time {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 1;
    .content {
      width: 100%;
      .user-name {
        font-weight: bold;
      }
      .content-info {
        font-size: 14px;
      }
    }

    .time {
      font-size: 14px;
      color: darkgrey;
      width: 100%;
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      
      .publish-time {
        display: flex;
        align-items: center;
        .el-icon {
          margin-right: 5px;
        }
      }
    }
  }
}

.favour {
  margin-left: auto;
  :deep(svg) {
    margin-right: 5px;
    transform: translateY(1px);
    path {
      transition: all .3s;
    }
  }
  &:hover {
    cursor: pointer;
    :deep(svg) path{
      fill: @main-color;
    }
     
  }
}

.delete-container {
  transition: opacity .5s;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  width: 36px;
  height: 36px;
  background-color: @main-color;
  right: 0px;
  top: 0px;
  border-radius: 4px 8px 4px 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  & :deep(.el-icon)  {
    margin: 0 0 6px 6px;
    svg path {
      fill: white;
    }
  }
  & :hover {
    cursor: pointer;
  }
}

.favour-icon-change {
  path{
    fill: @main-color;
  }
}
</style>