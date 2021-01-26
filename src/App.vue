<script>
import { computed, onMounted, reactive, ref } from 'vue'

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
    const done = ref(false)

    const playlist = ref()
    const volume = ref(100)

    let playerState = ref()

    const getDuration = ()=> {
      console.log(player.getDuration());
      return player.getDuration()
    }

    const onPlayerReady = (event)=> {
      // console.log(event);
      event.target.playVideo()
    }

    const playPauseVideo = ()=> {
      player.playVideo()
      playerState.value = player.getPlayerState()
      if(playerState.value == 2) player.playVideo()
      if(playerState.value == 1) player.pauseVideo()
      console.log(playerState.value)
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
    }

    const previousVideo = ()=> {
      player.previousVideo()
    }

    const getPlaylist = ()=> {
      playlist.value = player.getPlaylist()
      console.log(playlist.value)
    }

    const setVolume = ()=> {
      player.setVolume(volume.value)
    }

    const changeVolume = (val)=> {
      console.log('hi',val);
      volume.value = val
      player.setVolume(volume.value)
    }

    const onPlayerStateChange = (event)=> {
      if (event.data == YT.PlayerState.PLAYING && !done.value) {
        setTimeout(stopVideo, 6000);
        done.value = true;
      }
    }

    const loadPlaylist = (event)=> {
      
      player.loadPlaylist({
        listType: 'playlist',
        list:'PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI',
        index: 2,
        // startSeconds: 1,
        // suggestedQuality:String
      })

      player.setVolume(volume.value)
      // playlist.value = player.getPlaylist()
      // console.log(event.target.loadPlaylist);
    }

    const ytAPI = ()=> {
      window.onYouTubeIframeAPIReady = ()=> {
        player = new YT.Player('player', {
          // height: '720',
          // width: '1024',
          // videoId: 'PLHxUjmov4Un9g0lbA20cFpbBlrPvk4OfI',
          // cuePlaylist,
          events: {
            // 'onReady': onPlayerReady,
            'onReady': loadPlaylist,
            
            // 'onStateChange': onPlayerStateChange
          }
        });
      }
      getPlaylist()
      
    }

    onMounted(()=> {
      ytAPI()
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
      getDuration,
      getPlaylist,
      playlist,
      volume,
      changeVolume,
      // getVolume
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


h1(v-for='item in playlist') {{item}}
h1 {{volume}}

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
  width 1024px
  height 400px
</style>
