<template>
  <div class="songkudetail-container">
    <div class="songkuinfo-container">
      <div class="image" :style="{backgroundImage: `url(${props.file_path})`}"></div>
      <div class="into">
        <span>歌单简介</span>
        {{ props.description || '什么简介也没写^_^' }}
      </div>
      <div class="into">
        <el-button round @click="">{{ store.isAdmin? '编辑歌单':'播放歌单' }}</el-button>
      </div>
    </div>
    <div class="songandtitle-container">
      <div class="songku-name">
        <span>{{ props.ku_name }}</span>
      </div>
      <div class="addsong-button" v-if="store.isAdmin">
        <el-button @click="">添加歌曲</el-button>
      </div>
      <Song
        :song_name="'来自天堂的魔鬼'"
        singer_name="邓紫棋"
        :visitors="23"
        :listen_num="2"
        :showListenNum="true"
      ></Song>
    
    </div>
  </div>
  
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { useStore } from '../pinia';
import axios from '../utils/axios';
import { dayjs } from 'element-plus';

const store = useStore()

const props = defineProps({
  file_path: String,
  ku_name: String,
  id: String,
  description: String,
})
const dbclick = () => {
  console.log('s');
}
watch(() => props.id, () => {

})
</script>

<style scoped lang="less">
.songkudetail-container {
  width: 100%;
  height: 100%;
  display: flex;
  // background-color: rgb(255, 255, 255);
  justify-content: flex-start;
  align-items: flex-start;
  .songkuinfo-container {
    flex: 1;
    min-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .image {
      margin-top: 20px;
      border-radius: 20px;
      width: 80%;
      aspect-ratio: 1/1;
      background-size: cover;
      background-position: center 0;
    }

    .into {
      width: 80%;
      margin-top: 20px;
      margin-left: 5px;

      span {
        display: block;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 12px;
      }
    }
    

  }
  .songandtitle-container {
    margin-left: 50px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    flex: 3;

    .songku-name {
      span {
        font-size: 30px;
        font-weight: 700;
      }
    }
    .addsong-button {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      justify-content: flex-end;

    }
  }
}
</style>