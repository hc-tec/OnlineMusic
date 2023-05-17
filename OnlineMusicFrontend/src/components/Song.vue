<template>
  <div class="song-container" @dblclick="props.handleDbclick(props.id, props.singer_name)">
    <!-- 歌名和歌手名 -->
    <div class="name-andsinger">
      <div class="name">{{ props.song_name }}</div>
      <div class="singer"><span>{{ props.singer_name }}</span></div>
    </div>
    <div class="middle-info">
      <div v-if="props.showLastListenTime">{{ props.listen_time }}</div>
      <div v-else-if="props.showListenNum">{{ props.listen_num }}</div>
      <div v-else>{{ props.publish_time }}</div>
    </div>
    <div class="end">
      
      <div class="visitors-container">
        <div>
          <HotIcon myIconSize="18px" myIconColor="#c10000"></HotIcon>
          <span>{{ props.visitors }}</span>
        </div>

      </div>
      
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: String,
  publish_time: String,
  song_name: String,
  singer_name: String,
  visitors: Number,
  listen_time: String,
  listen_num:  Number,

  showDelete: Boolean,
  showHeart: Boolean,
  showListenNum: Boolean,
  showLastListenTime: Boolean,
  // 方法
  handleDbclick: {
    type: Function,
    default: () => {}
  },
  handleOpra: {
    type: Function,
    default: () => {}
  }
})
</script>

<style scoped lang="less">
.song-container {
  &:hover {
    border: 1px solid @main-color;
  }
  width: 100%;
  height: 82px;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  cursor: pointer;
  transition: all .3s;
  border: 1px solid rgb(239, 239, 245);
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .name-andsinger {
    display: flex;
    height: 100%;
    width: 240px;
    flex-direction: column;
    justify-content: space-around;
    .name {
      font-size: 16px;
      font-weight: 700;
    }
    .singer {
      font-size: 13px;
      span {
        transition: all .2s;
        &:hover {
          color: @main-color;
        }
      }
    }
  }

  .middle-info {

  }

  .end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    .visitors-container {
      width: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      span {
        display: inline-block;
        transform: translateY(-2px);
      }
    }
    .opra {
      display: flex;
      align-items: center;
      margin-right: 30px;
    }
  }
}
</style>