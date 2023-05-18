<template>
  <!-- 添加歌曲到歌单的dialog -->
  <el-dialog
    v-model="data.addSongDialogVisible"
    title="选择歌曲添加到本歌单中"
    width="60%"
    class="addsongtoku-dialog"
    align-center
  >
    <!-- 表格起点 -->
    <el-table :data="filterTableData" style="width: 100%; height: 400px;" 
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="song_name" label="歌曲名"  />
      <el-table-column prop="id" label="编号"/>
      <el-table-column prop="singer_name" label="所属歌手"  />
      <el-table-column prop="publish_time" label="发布时间" width="160"/>
      <el-table-column prop="visitors" label="访问量" align="center" sortable width="90"/>

      <template #empty>
          <el-empty description="无歌曲可供添加"/>
      </template>
    </el-table>
    <!-- 表格终点 -->
    <template #footer>
      <span>
        <el-button @click="data.addSongDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd" :disabled="!data.selectSong.length">
          确定添加
        </el-button>
      </span>
    </template>
  </el-dialog>


  <div class="songkudetail-container">
    <div class="songkuinfo-container">
      <div class="image" :style="{backgroundImage: `url(${props.file_path})`}"></div>
      <div class="into">
        <span>歌单简介</span>
        {{ props.description || '什么简介也没写^_^' }}
      </div>
      <div class="into">
        <el-button round @click="playSongKu" v-if="!store.isAdmin">播放歌单</el-button>
      </div>
    </div>
    <div class="songandtitle-container">
      <div class="songku-name">
        <span>{{ props.ku_name }}</span>
      </div>
      <div class="addsong-button" v-if="store.isAdmin">
        <el-button @click="addSongToSongKu">添加歌曲</el-button>
      </div>
      <el-empty style="width: 100%;" description="歌单中无歌曲信息" v-if="!data.songKuSongList.length"/>
      <div v-else style="width: 100%;">
        <div class="songcomponent-container" v-for="item in data.songKuSongList" :key="item.song_id">
          <Song
            :id="item.song_id"
            :song_name="item.song_name"
            :singer_id="item.singer_id"
            :singer_name="item.singer_name"
            :visitors="item.visitors"
            :publish_time="item.publish_time"
            :file_name="item.file_name"
            :isAdmin="store.isAdmin"
            :has_love="item.has_love"
            :handleOpra="store.isAdmin? handleOpraDelete : handleOpraLove"
          ></Song>
        </div>
      </div>
      
      
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

const data = reactive({
  songList: [],
  addSongDialogVisible: false,
  selectSong: [],
  songKuSongList: [],
})

const handleSelectionChange = (val) => {
  data.selectSong = []
  for (const item of val) {
    data.selectSong.push(item.id)
  }
}

const filterTableData = computed(() => {
  return data.songList.filter(item => {
    for (const iterator of data.songKuSongList) {
      if(iterator.song_id == item.id) {
        return false
      }
    }
    return true
  })
})

const playSongKu = () => {
  store.playList = data.songKuSongList
}

const addSongToSongKu = () => {
  data.songList = []
  axios.get('getAllSongsSimpleInfo').then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.songList.push({
          id: result.songInfo.id,
          song_name: result.songInfo.song_name,
          singer_id: result.songInfo.singer_id,
          singer_name: result.singer_name,
          visitors: result.songInfo.visitors, 
          file_name: result.songInfo.file_name,
          publish_time: dayjs(result.songInfo.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
      data.addSongDialogVisible = true
    }
  }).catch(err => {
    console.log(err)
  })
}

const confirmAdd = async () => {
  for await (const item of data.selectSong) {
    axios.post('/addSongToSongKu', {
      song_id: item,
      songku_id: props.id
    }).then(res => {
      if(res.data.code == 0) {
        data.addSongDialogVisible = false
        const result = res.data.result
        data.songKuSongList.push({
          song_id: result.id,
          song_name: result.song_name,
          singer_id: result.singer_id,
          singer_name: result.singer_name,
          visitors: result.visitors, 
          file_name: result.file_name,
          publish_time: dayjs(result.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
    }).catch(res => {
      console.log(res);
    })
  }
}

// 双击事件
// const dbclick = () => {
// }

// 管理员删除
const handleOpraDelete = (song_id) => {
  axios.post('/deleteSongFromSongKu', {
    song_id: song_id,
    songku_id: props.id
  }).then(res => {
    if(res.data.code == 0) {
      for (let index = 0; index < data.songKuSongList.length; index++) {
        const element = data.songKuSongList[index];
        if(element.song_id == song_id) {
          data.songKuSongList.splice(index, 1)
          break;
        }
      }
      ElMessage({
        message: '移除成功',
        type: 'success',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

// 用户收藏
const handleOpraLove = (song_id, has_love) => {
  if(!store.isLogin) {
    ElMessage({
      message: '请先登录',
      type: 'warning',
      duration: 1000
    })
    return
  }
  let requestUrl = has_love ? '/deleteLoveSong' : '/addLoveSong'
  axios.post(requestUrl, {song_id}).then(res => {
    if(res.data.code == 0) {
      for (let index = 0; index < data.songKuSongList.length; index++) {
        const element = data.songKuSongList[index];
        if(element.song_id == song_id) {
          element.has_love = !has_love
          break;
        }
      }
    }
    else {
      ElMessage({
        message: '切换收藏状态失败',
        type: 'error',
        duration: 1000
      })
    }
  }).catch(err => {
    console.log(err)
  })
}


watch(() => props.id, () => {
  let param = ''
  if(store.isLogin) param = `&user_id=${store.id}`
  // 获得歌单所有歌曲
  axios.get(`/getAllSongsInSongKu?id=${props.id}${param}`).then(res => {
    if(res.data.code == 0) {
      for (const result of res.data.result) {
        data.songKuSongList.push({
          song_id: result.song_id,
          song_name: result.songInfo.song_name,
          singer_id: result.songInfo.singer_id,
          singer_name: result.singer_name,
          visitors: result.songInfo.visitors, 
          file_name: result.songInfo.file_name,
          has_love: result.has_love,
          publish_time: dayjs(result.songInfo.publish_time).format('YYYY-MM-DD HH:mm')
        })
      }
    }
  })

})
</script>

<style scoped lang="less">
.songkudetail-container {
  width: 100%;
  height: 100%;
  display: flex;
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
    overflow: overlay;
    padding-right: 20px;
    margin-left: 40px;
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

.songcomponent-container {
  margin-top: 20px;
  width: 100%;
}

</style>