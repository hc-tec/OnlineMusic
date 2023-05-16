<template>
  <div class="songku-container">
    <div class="img-container" :style="{width: props.mySize, height: props.mySize}">
      <div class="mask">
        <div class="opra-button">
          <el-icon class="opra-icon"><VideoPlay /></el-icon>
        </div>
      </div>
      <div :style="{
        backgroundImage: `url(${props.imgSrc})`
      }" class="songku-img">
      </div>
    </div>
    
  </div>
  
  
</template>

<script setup>
const props = defineProps(['mySize', 'imgSrc' ])
</script>

<style scoped lang="less">
.songku-container {
  .img-container {
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
  }
  
}

.opra-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 40px;
  height: 40px;

  :deep(.opra-icon) {
    width: 100%;
    height: 100%;
    svg {
      width: 100%;
      height: 100%;
      path {
        fill: rgba(255, 255, 255, 0.8);
      }
    }
    
  }
}
</style>