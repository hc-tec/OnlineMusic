<template>
  <!-- 添加评论的dialog -->
  <el-dialog
    v-model="data.commentDialogVisible"
    title="添加评论"
    width="50%"
    align-center
  >
    <el-input resize="none" type="textarea" :rows="6" v-model="data.newComment" placeholder="快来分享听歌感悟吧"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.commentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addComment" :disabled="!data.newComment">
          确定添加
        </el-button>
      </span>
    </template>
  </el-dialog>

  <div class="allcomments-container">
    <div class="title">
      <span class="key">全部评论</span>
      <div class="song-info">
        <img src="../assets/OnlineMusic.svg" alt="">
        <div class="song-name">
          <div>{{ props.song_name }}</div>
          <div id="singer-name">{{ props.singer_name }}</div>
        </div>
      </div>
    </div>
    <!-- 热门评论 -->
    <div class="comment-title-container">
      <h6 class="comment-title">
        <span>热门评论</span>
      </h6>
      <el-button class="add-comment" @click="data.commentDialogVisible = true" :disabled="!store.isLogin">写评论</el-button>
    </div>
    <div class="comment-v-for-container">
      <transition name="comment">
        <el-empty description="无评论信息" v-if="!data.commentList.length"/>
        <div v-else >
          <Comment v-for="item in commentListSortByFavour" :key="item.id"
            :avatar_path="item.avatar_path"
            :user_name="item.user_name"
            :content="item.content"
            :publish_time="item.publish_time"
            :favour="item.favour"
            :id="item.id"
            :has_zan="item.has_zan"
            :deleteComment="deleteComment"
            :handleFavour="handleFavour"
          ></Comment>
        </div>
      </transition>
    </div>
    
    
    

    
  
  </div>


</template>

<script setup>
import { onMounted, reactive, watch, computed } from 'vue'
import axios from '../utils/axios';
import { useStore } from '../pinia';
import { dayjs } from 'element-plus';

const store = useStore()

const props = defineProps({
  // id 为歌曲的id
  id: String,
  singer_name: String,
  song_name: String
})

const data = reactive({
  commentList: [],
  commentDialogVisible: false,
  newComment: '',
})

const commentListSortByFavour = computed(() => {
  return data.commentList.sort((a, b) => {
    return b.favour - a.favour
  })
})

watch(() => props.id, () => {
  let param = ''
  if(store.isLogin) param = '&user_id=' + store.id
  axios.get(`/getComment?id=${props.id}${param}`).then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.commentList.push({
          id: result.id,
          user_id: result.user_id,
          user_name: result.user_name,
          avatar_path: `${import.meta.env.VITE_HOSTPORT}/avatar/${result.avatar_path}`,
          song_id: result.song_id,
          content: result.content,
          has_zan: result.has_zan,
          favour: result.favour,
          publish_time: dayjs(result.publish_time).format('YYYY年MM月DD日 HH:mm')
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
})

const addComment = () => {
  if(!store.isLogin) return
  axios.post('/addComment', {
    song_id: props.id,
    content: data.newComment
  }).then( res => {
    if(res.data.code == 0) {
      const { avatar_path, publish_time, ...resValue } = res.data.result
      data.commentList.push({
        avatar_path: `${import.meta.env.VITE_HOSTPORT}/avatar/${avatar_path}`,
        publish_time: dayjs(publish_time).format('YYYY年MM月DD日 HH:mm'),
        ...resValue
      })
      data.commentDialogVisible = false
      ElMessage({
        message: '发表评论成功',
        type: 'success',
        duration: 1000
      })
    }
    else {
      data.commentDialogVisible = false
      ElMessage({
        message: '发表评论失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

const deleteComment = (id) => {
  ElMessageBox.confirm(
  `此操作将彻底删除该评论`,
  '警告',
  {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }
  )
  .then(() => {
    const requestPath = store.isAdmin ? '/adminDeleteComment' : '/deleteComment'
    axios.post(requestPath, {id}).then(res => {
      if(res.data.code == 0) {
        for (let index = 0; index < data.commentList.length; index++) {
          const element = data.commentList[index];
          if(element.id == id) {
            data.commentList.splice(index, 1)
            break;
          }
        }
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
      }
      else {
        ElMessage({
          message: '删除失败',
          type: 'error',
          duration: 1000
        })
      }
    }).catch(err => {
      console.log(err);
    })
  })
  .catch(() => {})
}

const handleFavour = (id, has_zan, favour) => {
  if(!store.isLogin) {
    ElMessage({
      message: '请登录',
      type: 'warning',
      duration: 1000
    })
    return
  }
  
  axios.post('/handleFavour', {id, has_zan, favour}).then(res => {
    if(res.data.code == 0) {
      for (let index = 0; index < data.commentList.length; index++) {
        const element = data.commentList[index];
        if(element.id == id) {
          element.has_zan = res.data.result.has_zan
          element.favour = res.data.result.favour
          break;
        }
      }
    }
    else {
      ElMessage({
        message: '切换点赞状态失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

onMounted(() => {
  
})
</script>

<style scoped lang="less">
.allcomments-container {
  width: 100%;

  .title {
    margin-top: 30px;
    margin-bottom: 20px;
    .key {
      font-size: 40px;
      font-weight: 700;
      margin-right: 8px;
    }
    .song-info {
      margin-top: 20px;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgb(239, 239, 245);
      background-color: white;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      
      img {
        width: 60px;
        height: 60px;
        margin-right: 30px;
      }

      .song-name {
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 18px;

        & :nth-child(2) {
          transition: all .3s;
          font-size: 14px;
          cursor: pointer;
          color: #717171;
          margin-top: 5px;
        }
        #singer-name:hover {
          color: @main-color;
        }
      }
    }
  }

}

.comment-title-container {
  margin: 40px 0 20px 0;
  display: flex;
  align-items: end;
}
.comment-title {
  border-left: solid 4px @main-color;
  padding-left: 15px;

  span {
    font-size: 18px;
  }
}

.add-comment {
  margin-left: auto;
}

.comment-v-for-container {
  padding-bottom: 30px;
}
.comment-enter-active {
  animation: opacity-from-to 1s;
}

</style>