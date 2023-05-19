<template>
  <div  class="musicctrl-container" v-if="!store.isAdmin">
    <div class="data-container">
      <div class="control">
        <div class="control-icon small squre" >
          <el-icon><ArrowUpBold /></el-icon>
        </div>
      </div>
     
      <div class="data">
        <div class="name">{{ store.playingSong.song_name }}</div>
        <div class="singer" @click.stop="store.clickSinger(store.playingSong.singer_id, store.playingSong.singer_name)"><span>{{ store.playingSong.singer_name }}</span></div>
      </div>
    </div>
    
    <div class="control">
      <div class="control-icon small" >
        <NextMusic myIconSize="20px" :change="true"></NextMusic>
      </div>
      <div class="control-icon">
        <PlayIcon myIconSize="30px" v-show="!store.playingSong.state"></PlayIcon>
        <PauseIcon myIconSize="25px" v-show="store.playingSong.state"></PauseIcon>
      </div>
      <div class="control-icon small" >
        <NextMusic myIconSize="20px" :change="false"></NextMusic>
      </div>
    </div>
    <div class="menu">3</div>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { useStore } from "../pinia";
import axios from '../utils/axios'
import PlayIcon from './icon/PlayIcon.vue';

const store = useStore()
</script>

<style scoped lang="less">
.musicctrl-container {
  z-index: 99;
  animation: opacity-from-to .5s;
  box-sizing: border-box;
  padding: 0 50px;
  position: fixed;
  width: 100%;
  height: 70px;
  bottom: 0;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
}

.data-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.data {
  margin-left: 10px;
  padding-right: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .name {
    font-size: 16px;
    font-weight: 700;
  }
  .singer {
    cursor: pointer;
    font-size: 13px;
    span {
      transition: all .2s;
      &:hover {
        color: @main-color;
      }
    }
  }
}

.control {
  display: flex;
  justify-content: center;
  align-items: center;
  .control-icon {
    margin: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .3s;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: @main-color;
      :deep(svg) {
        path {
          fill: white;
        }
      }
    }

    :deep(svg) {
      path {
        transition: all .3s;
        fill: @main-color;
      }
    }
  }
  .small {
    width: 35px;
    height: 35px;
  }
  .squre {
    border-radius: 8px;
  }
}

</style>