<template>
  <div class="song-container"
    @dblclick="handleDbCilck"
    :style="{
      boxShadow: `0px 0px 4px 0px${props.isPlaying? '#409EFF':'rgb(239, 239, 245)'}`
  }">
    <!-- 歌名和歌手名 -->
    <div class="name-andsinger">
      <div class="name">{{ props.song_name }}</div>
      <div class="singer" @click.stop="clickSinger(props.singer_id, props.singer_name)"><span>{{ props.singer_name }}</span></div>
    </div>
    <div class="middle-info">
      <div v-if="props.listen_time">{{ props.listen_time }}</div>
      <div v-else-if="props.listen_num">{{ props.listen_num }}</div>
      <div v-else>{{ props.publish_time }}</div>
    </div>
    <div class="end">
      <!-- 添加收藏 -->
      <div class="opra heart" v-if="!props.isAdmin" @click.stop="props.handleOpra(props.id, props.has_love)">
        <HeartIcon myIconSize="18px" :myIconColor="props.has_love? '#c10000' : 'darkgray'"></HeartIcon>
      </div>
      <!-- 删除 -->
      <div class="opra" v-else @click.stop="props.handleOpra(props.id)">
        <el-button circle type="danger" plain size="small"><el-icon><Minus /></el-icon></el-button>
      </div>
      
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
import { useStore } from '../pinia';
const store = useStore()
const props = defineProps({
  id: Number,
  publish_time: String,
  song_name: String,
  singer_id: Number,
  singer_name: String,
  visitors: Number,
  listen_time: String,
  listen_num:  Number,
  file_name: String,

  isAdmin: {
    type: Boolean,
    default: false,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  has_love: {
    type: Boolean,
    default: false,
  },
  // 方法
  handleOpra: {
    type: Function,
    default: () => {}
  },

})

const handleDbCilck = () => {
  if(store.isAdmin) return
  store.play(props)
}
const clickSinger = (singer_id, singer_name) => {
  if(store.isAdmin) return
  console.log('跳转到歌手', singer_id, singer_name);
}
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
  justify-content: space-between;
  align-items: center;

  .name-andsinger {
    display: flex;
    height: 100%;
    width: 160px;
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
    margin-right: 20px;
  }

  .end {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100px;
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
    }
    .heart {
      :deep(svg) {
        path {
          transition: all .3s;
        }
      }
      &:hover {
        :deep(svg) path{
          fill: #c10000;
        }
        
      }
    }
  }
}
</style>