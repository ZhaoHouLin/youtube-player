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

    const done = ref(false)

    const playlist = ref()
    const info = reactive({data:''})
    const volume = ref(100)
    let duration = ref()
    let currentTime = ref(0)
    // let duration = ref(0)


    const onPlayerReady = (event)=> {
      event.target.playVideo()
    }

    const playPauseVideo = ()=> {
      player.playVideo()
      playerState.value = player.getPlayerState()
      if(playerState.value == 2) player.playVideo()
      if(playerState.value == 1) player.pauseVideo()
      // console.log(playerState.value)
      // console.log(player.getPlaylistIndex());
    }

    const pauseVideo = ()=> {
      console.log(player.getPlayerState());
      player.pauseVideo()
    }

    const stopVideo = ()=> {
      player.stopVideo()
    }

    const nextVideo = ()=> {
      player.nextVideo()
      getPlaylist()
    }

    const previousVideo = ()=> {
      player.previousVideo()
      getPlaylist()
    } 

    const getPlaylist = ()=> {  
      info.data = player.getVideoData()
      info.videoUrl = player.getVideoUrl()
      currentTime.value = player.getCurrentTime()
      player.setVolume(volume.value)
      console.log('duration',duration.value);
      console.log('currentTime',currentTime.value);
    }

    const formatDuration = computed(()=> {
      let dMinutes = '00'+Math.floor(duration.value/60)
      let dSeconds = '00'+duration.value%60
      return `${dMinutes.substring(dMinutes.length-2)}:${dSeconds.substring(dSeconds.length-2)}`
    })

    const formatCurrentTime = computed(()=> {
      let cMinutes = '00'+Math.floor(currentTime.value/60)
      let cSeconds = '00'+currentTime.value%60
      return `${cMinutes.substring(cMinutes.length-2)}:${cSeconds.substring(cSeconds.length-2)}`
    })

    const changeVolume = (val)=> {
      volume.value = val
      player.setVolume(volume.value)
    }

    const setCurrentTime = ()=> {
      player.seekTo(currentTime.value)
    }
    const currentTimer = ()=> {
      setInterval(() => {
        currentTime.value = Math.floor(player.getCurrentTime())
        // console.log(currentTime);
      }, 1000);
    }

    const onPlayerStateChange = (event)=> {
      console.log('e',event.data);
      if (event.data == YT.PlayerState.BUFFERING) {
        console.log('finish');
        getPlaylist() 
      }
      if (event.data == YT.PlayerState.ENDED ||YT.PlayerState.CUED) {
        duration.value = Math.floor(player.getDuration())
      }
    }

    const loadPlaylist = ()=> {
      player.loadPlaylist({
        listType: 'playlist',
        list:'PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI',
        index: 2,
      })
    }

    const ytAPI = ()=> {
      window.onYouTubeIframeAPIReady = ()=> {
        player = new YT.Player('player', {
          events: {
            // 'onReady': onPlayerReady,
            'onReady': loadPlaylist,
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
      // setDuration,
      getPlaylist,
      playlist,
      volume,
      changeVolume,
      info,
      duration,
      setCurrentTime,
      currentTime,
      formatCurrentTime,
      formatDuration,
      // duration
    }
  }
}
</script>


<template lang='pug'>
#player(ref='player')
button(@click='stopVideo') stop
//- button(@click='pauseVideo') pause
button(@click='playPauseVideo') play & pause
button(@click='nextVideo') nextVideo
button(@click='previousVideo') previousVideo

button(@click='loadPlaylist') list
button(@click='getPlaylist') zz

input(type="range" id="vol" name="vol" min="0" max="100" step=1 @change='changeVolume(volume)' v-model.number='volume' )


h1 {{volume}}
label {{currentTime}}
input(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' ) 
label {{duration}}
h3 {{formatCurrentTime}}
h3 {{formatDuration}}

h2(v-for='item in info.data') {{item}}
h2 {{info.videoUrl}}
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
</style>
