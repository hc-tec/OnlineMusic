<template>
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
    <h6 class="comment-title"><span>热门评论</span></h6>
    <div v-for="item in data.commentList" :key="item.id">
      <Comment
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
    
  
  </div>


</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
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
          has_zan: result.has_zan ? true : false,
          favour: result.favour,
          publish_time: dayjs(result.publish_time).format('YYYY年MM月DD日 HH:mm')
        })
      }
    }
  }).catch(err => {
    console.log(err)
  })
})

const deleteComment = (id) => {
  console.log(id);
}

const handleFavour = (id, has_zan) => {
  
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

.comment-title {
  margin: 40px 0 20px 0;
  border-left: solid 4px @main-color;
  line-height: 20px;
  padding-left: 15px;

  span {
    font-size: 18px;
  }
}

</style>