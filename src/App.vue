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
    // let player = reactive()
    // let playerState = ref()

    const player = computed(()=> {
      return store.getters.player
    })

    const playerState = computed(()=> {
      return store.getters.playerState
    })

    const ytId = computed(()=> {
      return store.getters.ytId
    })
    const playlist = computed(()=> {
      return store.getters.playList
    })
    const info = computed(()=> {
      return store.getters.info
    })
    const isOneLoop = computed(()=> {
      return store.getters.isOneLoop
    })

    const { loadVideo, loadPlaylist } = apiGetCommonFn()

    // const { player,youtubeIframeAPI } = apiGetCommonFn()

    // const ytId = ref('PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI')

    // const loadVideoCover = computed(()=> {
    //    return `http://img.youtube.com/vi/${ytId.video}/maxresdefault.jpg`
    // })

    // const player = computed(()=> {
    //   return store.getters.player
    // })

    // const buttonPlayPause = computed(()=> {
    //   if(playerState.value == 2 || playerState.value == 3) return true
    //   if(playerState.value == 1 ) return false
    // })
     
    const onPlayerReady = (event)=> {
      event.target.playVideo()
    }

    const getPlaylist = ()=> {  
      currentTimer()
      store.dispatch('commitDuration',Math.floor(player.value.getDuration()))
      let payload = {
        data: player.value.getVideoData(),
        videoUrl: player.value.getVideoUrl()
      }
      store.dispatch('commitInfo',payload)

      store.dispatch('commitCurrentTime',player.value.getCurrentTime())
      store.dispatch('commitPlaylist',player.value.getPlaylist())
      // console.log('ll1',store.getters.playlist.length);

    }

    const currentTimer = ()=> {
      setInterval(() => {
        store.dispatch('commitCurrentTime',Math.floor(player.value.getCurrentTime()))
      }, 1000);
    }
 
    const marqueeAnimate = computed(()=> {
      if (playerState.value==3) {
        return {
          'animation-name': `marquee-animate`,
          'animation-duration': `15s`,
          'animation-iteration-count': `infinite`,
          'animation-timing-function': `linear`,
          'animation-direction': `alternate`
        }
      }
    })

    const onPlayerStateChange = (event)=> {
      if ( (event.data == YT.PlayerState.BUFFERING) && !(isOneLoop.value) ) {
        // playerState.value = player.value.getPlayerState()
        store.dispatch('commitPlayerState',player.value.getPlayerState())
        getPlaylist() 
      }
      if ( (event.data == YT.PlayerState.ENDED || YT.PlayerState.CUED ) && !(isOneLoop.value) ) {
        getPlaylist() 
      }
      if ( event.data == YT.PlayerState.ENDED && (isOneLoop.value) ) {
        loadVideo(ytId.value.video)
      } 
      if ( event.data == YT.PlayerState.ENDED && !(isOneLoop.value) ) {
        nextVideo()
        // getPlaylist()
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
      onPlayerReady,
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
  
#player
  size(100%,40vh)
  // display none


  
.info
  flexCenter()
  size(100%,10vh)
  border solid 1px #222
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
  