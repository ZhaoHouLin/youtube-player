<script>
import { computed, onMounted, reactive, ref,  } from 'vue'
import { useStore } from 'vuex'
import Menu from '../src/components/Menu'
import Control from '../src/components/Control'
import { apiGetCommonFn } from '../src/api'

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
  components: {
    Menu,
    Control
  },
  setup() {
    const store = useStore()

    const player = computed(()=> {
      return store.getters.player
    })

    const playerState = computed(()=> {
      return store.getters.playerState
    })

    const playlist = computed(()=> {
      return store.getters.playlist
    })

    const ytId = computed(()=> {
      return store.getters.ytId
    })
    
    const info = computed(()=> {
      return store.getters.info
    })

    

    const isOneLoop = computed(()=> {
      return store.getters.isOneLoop
    })

    const { loadVideo, loadPlaylist, currentTimer, clearTimer, nextVideo } = apiGetCommonFn()

    const getPlaylist = ()=> {
      store.dispatch('commitDuration',Math.floor(player.value.getDuration()))
      let payload = {
        data: player.value.getVideoData(),
        videoUrl: player.value.getVideoUrl()
      }
      store.dispatch('commitInfo',payload)
      store.dispatch('commitCurrentTime',player.value.getCurrentTime())
      store.dispatch('commitPlaylist',player.value.getPlaylist())
    }
 
    const marqueeAnimate = computed(()=> {
      if (playerState.value!==1) {
        return {
          'animation-name': `marquee-animate`,
          'animation-duration': `15s`,
          'animation-iteration-count': `infinite`,
          'animation-timing-function': `linear`,
          'animation-direction': `alternate`
        }
      }
    })


    // 播放器狀態數值:
    // -1 – 未開始
    // 0 – 已结束
    // 1 – 正在播放
    // 2 – 已暫停
    // 3 – 正在緩冲
    // 5 – 已插入視頻 
    
    const onPlayerStateChange = (event)=> {
      if ( (event.data == YT.PlayerState.BUFFERING) && !(isOneLoop.value) ) {
        store.dispatch('commitPlayerState',player.value.getPlayerState())
        getPlaylist() 
      }
      if ( (event.data == YT.PlayerState.ENDED || YT.PlayerState.CUED ) && !(isOneLoop.value) ) {
        getPlaylist() 
        store.dispatch('commitDuration',Math.floor(player.value.getDuration()))
        store.dispatch('commitPlaylist',player.value.getPlaylist())
        // player.value.nextVideo()
        // loadPlaylist(ytId.value.list,ytId.value.index) 
        // store.dispatch('commitYtIdIndex',player.value.getPlaylistIndex)
        // store.dispatch('commitYtIdVideo',playlist.value[player.value.getPlaylistIndex])
      }
      if( event.data == 1 ) {
        currentTimer()
      } else {
        clearTimer()
      }
      if ( event.data == YT.PlayerState.ENDED && isOneLoop.value ) {
        clearTimer()
        loadVideo(ytId.value.video)
      }
      if ( event.data == YT.PlayerState.ENDED && !isOneLoop.value ) {
        nextVideo()
        // clearTimer()
        // store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
        // loadVideo(ytId.value.video)
      }
    }


    const ytAPI = ()=> {
      window.onYouTubeIframeAPIReady = ()=> {
        let payload = new YT.Player('player', {
          events: {
            'onStateChange': onPlayerStateChange
          }
        })    
        store.dispatch('commitPlayer' ,payload )
      }
    }

    onMounted(()=> {
      ytAPI()
    })

    return {
      // onPlayerReady,
      info,
      marqueeAnimate,
    }
  }
}
</script>


<template lang='pug'>

Menu
#player
Control

.info
  a.marquee(:href="info.videoUrl" target='_blank' :style='marqueeAnimate')
    h3 {{info.data.title}} 

  
</template>

<style lang="stylus">
@import './css/style.styl'
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  flexCenter(center,center,column)
  size(100%,100vh)
  overflow hidden
  
#player
  size(100%,30vh)
  // display none

.info
  flexCenter()
  size(100%,20vh)
  background-color color-primary-dark 
  overflow hidden
  position relative
  a.marquee
    white-space nowrap 
    position absolute
    color color-secondary
    size(100%,auto)
     

@keyframes marquee-animate
  0%
    left 0%
  50%
    left -100%
  100%
    left 0%

</style>
  