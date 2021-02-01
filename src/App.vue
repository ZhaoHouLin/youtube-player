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

    const ytId= ref('PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI')

    const done = ref(false)

    const playlist = ref()
    const info = reactive({data:''})
    const volume = ref(100)
    let duration = ref()
    let currentTime = ref(0)
    let ytUrl = ref('')
    let videoCover = ref('')

    // https://www.youtube.com/watch?v=l4ZLQJgv-Q8&list=PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI&index=3&ab_channel=CHMusicChannel

    // https://www.youtube.com/watch?list=PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI&v=l4ZLQJgv-Q8&feature=emb_logo&ab_channel=CHMusicChannel

    // https://www.youtube.com/watch?v=loxujxwIb5U&ab_channel=nearestevil

    const urlGetId = ()=> {
      let idHandleArray = ytUrl.value.split('&')
      if(ytUrl.value.indexOf('list=')!==-1){
        let listId = idHandleArray.filter((item)=> {
          return item.indexOf('list=') !==-1
        })
        let idResult = listId[0].split('list=')[1]
        ytId.value = idResult
        loadPlaylist()
      } else {
        let vId = idHandleArray.filter((item)=> {
          return item.indexOf('v=') !==-1
        })
        let idResult = vId[0].split('v=')[1]
        ytId.value = idResult
        loadVideo()
      }
    }

    const loadVideoCover = computed(()=> {
      // return `http://img.youtube.com/vi/${ytId.value}/sddefault.jpg`
      // return `http://img.youtube.com/vi/${ytId.value}/0.jpg`
      return `http://img.youtube.com/vi/${ytId.value}/maxresdefault.jpg`
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
      console.log('data',info.data);
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
      console.log('e',event);
      if (event.data == YT.PlayerState.BUFFERING) {
        getPlaylist() 
      }
      if (event.data == YT.PlayerState.ENDED ||YT.PlayerState.CUED) {
        duration.value = Math.floor(player.getDuration())
        getPlaylist() 
      }
    }

    const loadVideo = ()=> {
      player.loadVideoById({
        videoId: ytId.value,
      })
    }

    const loadPlaylist = ()=> {
      player.loadPlaylist({
        listType: 'playlist',
        list: ytId.value,
      })
    }

    const ytAPI = ()=> {
      window.onYouTubeIframeAPIReady = ()=> {
        player = new YT.Player('player', {
          events: {
            // 'onReady': onPlayerReady,
            // 'onReady': loadPlaylist,
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
      loadVideoCover
      // duration
    }
  }
}
</script>


<template lang='pug'>
#player(ref='player')
img(:src="loadVideoCover", alt="alt")
button(@click='stopVideo') stop
//- button(@click='pauseVideo') pause
button(@click='playPauseVideo') play & pause
button(@click='nextVideo') nextVideo
button(@click='previousVideo') previousVideo

button(@click='loadPlaylist') list
button(@click='urlGetId') zz

input(type="range" id="vol" name="vol" min="0" max="100" step=1 @change='changeVolume(volume)' v-model.number='volume' )

input(type='text' v-model='ytUrl' @input='urlGetId')
h2 {{ytUrl}}

h1 {{volume}}

label {{formatTime(currentTime)}}
input(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' ) 
label {{formatTime(duration)}}


a(:href="info.videoUrl")
  h2 名稱: {{info.data.title}} 

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
  