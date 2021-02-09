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

    

    const playlist = reactive({
      data: []
    })
    const info = reactive({data:''})
    const volume = ref(50)
    let duration = ref('00')
    let currentTime = ref(0)
    let ytUrl = ref('')
    const isOneLoop = ref(false)
    // const whichLoop = ref(3)
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

    const buttonPlayPause = computed(()=> {
      if(playerState.value == 2 || playerState.value == 3) return true
      if(playerState.value == 1 ) return false
    })
     
    const onPlayerReady = (event)=> {
      event.target.playVideo()
    }

    const volumeRange = computed(()=> {
      if (volume.value > 0 && volume.value < 50) return 2
      if (volume.value > 50 && volume.value < 70) return 3
      if (volume.value > 70) return 4
      if (volume.value == 0) {
        return 1
      } else {
        return 2
      }
    })

    const mute = ()=> {
      if (player.isMuted()) {
        player.unMute()
        volume.value = player.getVolume()
      } else {
        player.mute()
        volume.value = 0
      }
    }
    const playPauseVideo = ()=> {
      player.playVideo()
      playerState.value = player.getPlayerState()
      console.log(player.getPlayerState());
      if(playerState.value == 2) player.playVideo()
      if(playerState.value == 1) player.pauseVideo()
    }

    const pauseVideo = ()=> {
      player.pauseVideo()
    }

    const stopVideo = ()=> {
      console.log(player.getPlayerState());
      player.stopVideo()
    }

    const nextVideo = ()=> {
      // whichLoop.value = 3
      isOneLoop.value = false
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
      // whichLoop.value = 3
      isOneLoop.value = false
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
      ytId.video = info.data.video_id
    }

    // const listLoop = ()=> {
    //   whichLoop.value = 2
    //   // player.setLoop(true)
    // }

    const formatTime = (val)=> {
      let dMinutes = '00'+Math.floor(val/60)
      let dSeconds = '00'+val%60
      return `${dMinutes.substring(dMinutes.length-2)}:${dSeconds.substring(dSeconds.length-2)}`
    }
    
    const changeVolume = (val)=> {
      player.unMute()
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
      if ( (event.data == YT.PlayerState.BUFFERING) && !(isOneLoop.value) ) {
        playerState.value = player.getPlayerState()
        getPlaylist() 
      }
      if ( (event.data == YT.PlayerState.ENDED || YT.PlayerState.CUED ) && !(isOneLoop.value) ) {
        getPlaylist() 
      }
      if (event.data == YT.PlayerState.ENDED && (isOneLoop.value) ) {
        loadVideo(ytId.video)
      } 
      if ( event.data == YT.PlayerState.ENDED && !(isOneLoop.value) ) {
        nextVideo()
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
      // listLoop,
      oneLoop,
      randomVideo,
      playerState,
      buttonPlayPause,
      mute,
      volumeRange
      // duration
    }
  }
}
</script>


<template lang='pug'>
.user-enter-url
  input(type='text' v-model='ytUrl' placeholder='enter YouTube video url')
  button(@click='urlGetId' ) send

#player(ref='player')

img(:src="loadVideoCover", alt="alt")

.progress-bar
  label {{formatTime(currentTime)}}
  input.bar(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' ) 
  label {{formatTime(duration)}}

.control
  button(@click='previousVideo')
    i.fas.fa-step-backward
  button(@click='stopVideo')
    i.fas.fa-stop
  button(@click='playPauseVideo')
    i(:class='["fas",{"fa-play":!buttonPlayPause},{"fa-pause":buttonPlayPause}]')
  button(@click='nextVideo')
    i.fas.fa-step-forward

  button(@click='randomVideo')
    i.fas.fa-random

  button(@click='oneLoop' title='test')
    i.fas.fa-undo

.volume-range
  button(@click='mute')
    i(:class='["fas",{"fa-volume-mute": volumeRange==1},{"fa-volume-off": volumeRange==2},{"fa-volume-down": volumeRange==3},{"fa-volume-up": volumeRange==4}]')
  input(type="range" id="vol" name="vol" min="0" max="100" step=1 @change='changeVolume(volume)' v-model.number='volume' )

.info
  a(:href="info.videoUrl")
    h3 {{info.data.title}} 
    //- h2 {{info.data.video_id}}
  
</template>

<style lang="stylus">
@import './css/style.styl'
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  flexCenter(center,center,column)
  size(100%,100vh)

.user-enter-url
  size(100%,auto)
  // border solid 1px #222
  position absolute
  top 0px
  input
    width 80%
  button
    width 20%
#player
  size(100%,50vh)
  display none

img
  size(100%,auto)
.progress-bar
  size(100%,auto)
  border solid 1px #222
  flexCenter()
  .bar
    size(70%,auto)
    margin 0 8px

.control,.volume-range
  size(100%,auto)
  flexCenter()
  button
    outline none
    background-color color-primary-dark
    color color-secondary
    size(100%,auto)
    padding 8px
    i
      font-size md
      
        
.volume-range
  background-color color-primary-dark
  flexCenter(flex-start,center,)
  button
    size((100/6)%,auto)
    i
      font-size 1.5rem
  input
    // color color-primary-dark
    size((100/6)*5%,0.5vh)

  
.info
  flexCenter()
  size(100%,10vh)
  border solid 1px #222
  overflow hidden
  position relative
  a
    white-space nowrap 
    position absolute
    color color-secondary
    size(100%,auto)
    // left 30px
    h2
      size(100%,auto)


</style>
  