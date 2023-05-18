<template>
  <div class="songku-container" @click="handleClick(props.id, props.songKuName, props.imgSrc, props.description)">
    <div class="img-container">
      <div class="img-foot" v-if="store.isAdmin"></div>
      <div class="mask">
        <div class="opra-button" v-if="store.isAdmin">
          <el-icon class="opra-icon" @click.stop="props.handleIconClick(props.id)">
            <Delete/>
          </el-icon>
        </div>
      </div>
      <div :style="{
        backgroundImage: `url(${props.imgSrc})`
      }" class="songku-img">
      </div>
    </div>
    <div class="songku-name">
      {{props.songKuName}}
    </div>
    
  </div>
  
  
</template>

<script setup>
import { useStore } from "../pinia";
const store = useStore()
const props = defineProps({
  imgSrc: String,
  songKuName: String,
  handleClick: Function,
  handleIconClick: Function,
  id: Number,
  description: String,
})
</script>

<style scoped lang="less">
.songku-container {
  height: 240px;
  .img-container {
    width: 200px;
    height: 200px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      .songku-img {
        transform: scale(1.1);
        filter: blur(1px);
      }
      .mask {
        display: block;
      }
      .img-foot {
        transform: rotate(-15deg);
      }
    }
    .mask {
      transition: all .3s;
      opacity: .9;
      display: none;
      z-index: 9;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1));
    }
    .songku-img {
      overflow: hidden;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center 0;
      transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
    .img-foot {
      z-index: 8;
      position: absolute;
      transition: all .3s;
      width: 150%;
      height: 50%;
      bottom: -100px;
      left: 0;
      opacity: .8;
      background-color: @main-color;
      transform-origin: 0 0 ;
    }
  }
}
.opra-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 30px;
  height: 30px;
  :deep(.opra-icon) {
    width: 100%;
    height: 100%;
    svg {
      transition: all .2s;
      width: 100%;
      height: 100%;
      path {
        transition: all .3s;
        fill: rgba(255, 255, 255, 0.8);
      }
      &:hover {
        path {
          opacity: .6;
        }
      }
      &:active {
        transform: scale(.95);
      }
    }
    
  }
}
.songku-name {
  margin-top: 6px;
  margin-left: 6px;
  font-size: 20px;
  font-weight: bold;
}
</style>