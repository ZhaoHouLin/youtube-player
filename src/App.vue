<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'

// 高解析度大圖（1280 × 720）
// http://img.youtube.com/vi/xxxxxxx/maxresdefault.jpg
// 標準清晰圖 （640 × 480）
// http://img.youtube.com/vi/xxxxxxx/sddefault.jpg
// 高品質縮圖（480×360）
// https://img.youtube.com/vi/xxxxxxx/hqdefault.jpg
// 播放器背景縮圖（480×360）
// http://img.youtube.com/vi/xxxxxxx/0.jpg　
// 影片開始畫面縮圖（120×90）
// http://img.youtube.com/vi/xxxxxxx/1.jpg
// 影片中間片段縮圖（120×90）
// http://img.youtube.com/vi/xxxxxxx/2.jpg
// 影片結束縮圖（120×90）
// http://img.youtube.com/vi/xxxxxxx/3.jpg

export default {

  setup() {

    let player = reactive()
    let playerState = ref()

    // const ytId = ref('PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI')
    const ytId = reactive({
      list: '',
      video: '',
      index: 0
    })
    const done = ref(false)

    const playlist = reactive({
      data: []
    })
    const info = reactive({data:''})
    const volume = ref(100)
    let duration = ref('00')
    let currentTime = ref(0)
    let ytUrl = ref('')
    const isOneLoop = ref(false)
    const isRandom = ref(false)
    // https://www.youtube.com/watch?v=l4ZLQJgv-Q8&list=PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI&index=3&ab_channel=CHMusicChannel

    // https://www.youtube.com/watch?list=PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI&v=l4ZLQJgv-Q8&feature=emb_logo&ab_channel=CHMusicChannel

    // https://www.youtube.com/watch?v=loxujxwIb5U&ab_channel=nearestevil



    const handleUrlVideoId = (arr)=> {
      console.log('arr',arr);
      let filterVid = arr.filter((item)=> item.indexOf('v=') !==-1)
      ytId.video = filterVid[0].split('v=')[1]
      isRandom.value = false
    }

    const urlGetId = ()=> {
      let idHandleArray = ytUrl.value.split('&')
      handleUrlVideoId(idHandleArray)
      if(ytUrl.value.indexOf('list=') !== -1){
        let filterListId = idHandleArray.filter((item)=> item.indexOf('list=') !==-1)
        let filterIndex = idHandleArray.filter((item)=> item.indexOf('index=') !==-1)
        ytId.list = filterListId[0].split('list=')[1]

        if (filterIndex.indexOf('index=')!==-1) {
          ytId.index = filterIndex[0].split('index=')[1]-1
        } else {
          loadVideo(ytId.video)     //消除輸入另一個播放清單切換不過去的問題
        }
        loadPlaylist(ytId.list,ytId.index)
      } else {
        loadVideo(ytId.video)
      }
    }

    const loadVideoCover = computed(()=> {
       return `http://img.youtube.com/vi/${ytId.video}/maxresdefault.jpg`
    })
     
    const onPlayerReady = (event)=> {
      event.target.playVideo()
    }

    const playPauseVideo = ()=> {
      player.playVideo()
      playerState.value = player.getPlayerState()
      if(playerState.value == 2) player.playVideo()
      if(playerState.value == 1) player.pauseVideo()
    }

    const pauseVideo = ()=> {
      console.log(player.getPlayerState());
      player.pauseVideo()
    }

    const stopVideo = ()=> {
      player.stopVideo()
    }

    const nextVideo = ()=> {
      isOneLoop.value = false
      player.setLoop(true)
      player.nextVideo()
      ytId.index = playlist.data.indexOf(info.data.video_id) + 1
      ytId.video = playlist.data[ytId.index]
      console.log('nextlist',playlist.data);
      if(ytId.index > playlist.data.length-1) {
        ytId.index = 0
        ytId.video = playlist.data[ytId.index]
      } 
      loadVideo()
      loadPlaylist(ytId.list,ytId.index)      //單曲循環後確保清單播放
    }

    const previousVideo = ()=> {
      isOneLoop.value = false
      player.setLoop(true)
      player.previousVideo()
      ytId.index = playlist.data.indexOf(info.data.video_id) - 1
      ytId.video = playlist.data[ytId.index]
      if(ytId.index < 0) {
        ytId.index = playlist.data.length-1
        ytId.video = playlist.data[ytId.index]
      }
      loadVideo()
      loadPlaylist(ytId.list,ytId.index) 
    } 

    const getPlaylist = ()=> {  
      duration.value = Math.floor(player.getDuration())
      info.data = player.getVideoData()
      info.videoUrl = player.getVideoUrl()
      currentTime.value = player.getCurrentTime()
      player.setVolume(volume.value)
      playlist.data = player.getPlaylist()
    }

    const loadVideo = (id)=> {
      player.loadVideoById({
        videoId: id,
      })
    }

    const loadPlaylist = (id,idx)=> {
      player.loadPlaylist({
        listType: 'playlist',
        list: id,
        index: idx
      })  
    }

    const randomVideo = ()=> {
      isRandom.value = !isRandom.value
      console.log(isRandom.value);
      player.setShuffle(isRandom.value)
    }

    const oneLoop = ()=> {
      isOneLoop.value = true
      console.log(isOneLoop.value);
      ytId.video = info.data.video_id
      // loadVideo(ytId.video)
    }
    const listLoop = ()=> {
      player.setLoop(true)
    }

    const formatTime = (val)=> {
      let dMinutes = '00'+Math.floor(val/60)
      let dSeconds = '00'+val%60
      return `${dMinutes.substring(dMinutes.length-2)}:${dSeconds.substring(dSeconds.length-2)}`
    }
    
    const changeVolume = (val)=> {
      volume.value = val
      player.setVolume(volume.value)
    }

    const setCurrentTime = ()=> {
      player.seekTo(currentTime.value,true)
    }

    const currentTimer = ()=> {
      setInterval(() => {
        currentTime.value = Math.floor(player.getCurrentTime())
      }, 1000);
    }

    const onPlayerStateChange = (event)=> {
      if ((event.data == YT.PlayerState.BUFFERING) && !isOneLoop.value) {
        getPlaylist() 
      }
      if ((event.data == YT.PlayerState.ENDED || YT.PlayerState.CUED ) && !isOneLoop.value) {
        getPlaylist() 
      }
      if (event.data == YT.PlayerState.ENDED && isOneLoop.value) {
        loadVideo(ytId.video)
      } 
    }



    const ytAPI = ()=> {
      window.onYouTubeIframeAPIReady = ()=> {
        player = new YT.Player('player', {
          events: {
            'onStateChange': onPlayerStateChange
          }
        })     
      }
    }

    onMounted(()=> {
      ytAPI()
      currentTimer()
      
    })

    return {
      player,
      onPlayerReady,
      playPauseVideo,
      pauseVideo,
      stopVideo,
      nextVideo,
      previousVideo,
      loadPlaylist,
      getPlaylist,
      playlist,
      volume,
      changeVolume,
      info,
      duration,
      setCurrentTime,
      currentTime,
      formatTime,
      ytUrl,
      urlGetId,
      loadVideoCover,
      listLoop,
      oneLoop,
      randomVideo
      // duration
    }
  }
}
</script>


<template lang='pug'>
#player(ref='player' loop)
img(:src="loadVideoCover", alt="alt")
button(@click='stopVideo') stop
//- button(@click='pauseVideo') pause
button(@click='playPauseVideo') play & pause
button(@click='nextVideo') nextVideo
button(@click='previousVideo') previousVideo

button(@click='loadPlaylist') list
button(@click='urlGetId') get
button(@click='randomVideo') random
button(@click='listLoop') listLoop
button(@click='oneLoop') oneLoop

input(type="range" id="vol" name="vol" min="0" max="100" step=1 @change='changeVolume(volume)' v-model.number='volume' )

input(type='text' v-model='ytUrl' @input='urlGetId')

//- h1 {{volume}}

label {{formatTime(currentTime)}}
input(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' ) 
label {{formatTime(duration)}}


a(:href="info.videoUrl")
  h2 名稱: {{info.data.title}} 
  h2 {{info.data.video_id}}

</template>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

#player
  width 600px
  height 200px

img
  width 400px
  height auto
</style>
  