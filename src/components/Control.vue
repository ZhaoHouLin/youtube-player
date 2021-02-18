<script>
import { ref, computed} from 'vue'
import { useStore } from 'vuex'
import { apiGetCommonFn } from '../api'
export default {
  setup() {
    const store = useStore()

    const { loadVideo, loadPlaylist } = apiGetCommonFn()
    
    const volume = ref(50)


    const ytId = computed(()=> {
      return store.getters.ytId
    })
    const player = computed(()=> {
      return store.getters.player
    })
    const playerState = computed(()=> {
      return store.getters.playerState
    })
    const playlist = computed(()=> {
      return store.getters.playList
    })
    const info = computed(()=> {
      return store.getters.info
    })
    // const playlist = store.state.playList

    const currentTime = computed({                  //雙向綁定vuex寫法
      set(val) {
        store.dispatch('commitCurrentTime',val)
      },
      get() {
        return store.getters.currentTime
      }
    })

    const duration = computed(()=> {
      return store.getters.duration
    })

    const setCurrentTime = ()=> {
      player.value.seekTo(currentTime.value,true)
    }

    const formatTime = (val)=> {
      let dMinutes = '00'+Math.floor(val/60)
      let dSeconds = '00'+Math.floor(val%60)
      return `${dMinutes.substring(dMinutes.length-2)}:${dSeconds.substring(dSeconds.length-2)}`
    }

    const loadVideoCover = computed(()=> {
       return `http://img.youtube.com/vi/${ytId.video}/maxresdefault.jpg`
    })


    const previousVideo = ()=> {
      // whichLoop.value = 3
      // isOneLoop.value = false
      store.dispatch('commitIsOneLoop',false)
      // store.dispatch('commitPlaylist',player.value.getPlaylist())
      player.value.previousVideo()
      // ytId.value.index = playlist.value.indexOf(info.value.data.video_id) - 1
      // ytId.value.video = playlist.value[ytId.value.index]
      
      store.dispatch('commitYtIdIndex',(playlist.value.indexOf(info.value.data.video_id) - 1))
      console.log('0?',playlist.value[ytId.value.index]);
      store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])

      if(ytId.value.index < 0) {
        store.dispatch('commitYtIdIndex',playlist.value.length-1)
        store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
      }
      // loadVideo()
      loadPlaylist(ytId.value.list,ytId.value.index) 
    } 

    const stopVideo = ()=> {
      player.value.stopVideo()
    }

    const playPauseVideo = ()=> {
      player.value.playVideo()
      // playerState.value = player.value.getPlayerState()
      store.dispatch('commitPlayerState',player.value.getPlayerState())
      if(playerState.value == 2) player.value.playVideo()
      if(playerState.value == 1) player.value.pauseVideo()
    }

    const nextVideo = ()=> {
      store.dispatch('commitIsOneLoop',false)
      player.value.nextVideo()
      console.log('val',playlist);
      store.dispatch('commitYtIdIndex',(playlist.value.indexOf(info.value.data.video_id) + 1))
      console.log('ytid',ytId.value.index);
      store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
      console.log('state',store.state.playList.length);
      if(ytId.value.index > playlist.value.length-1) {
        store.dispatch('commitYtIdIndex',0)
        store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
      } 
      // loadVideo()
      loadPlaylist(ytId.value.list,ytId.value.index)      //單曲循環後確保清單播放
    }

    const randomVideo = ()=> {
      isRandom.value = !isRandom.value
      player.value.setShuffle(isRandom.value)
    }

    const oneLoop = ()=> {
      // isOneLoop.value = true
      console.log('ll',playlist.value);
      store.dispatch('commitIsOneLoop',true)
      // ytId.value.video = info.value.data.video_id
      store.dispatch('commitYtIdVideo',info.value.data.video_id)
    }

    const mute = ()=> {
      if (player.value.isMuted()) {
        player.value.unMute()
        volume.value = player.value.getVolume()
      } else {
        player.value.mute()
        volume.value = 0
      }
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

    const changeVolume = (val)=> {
      player.value.unMute()
      volume.value = val
      player.value.setVolume(volume.value)
    }

    const buttonPlayPause = computed(()=> {
      if(playerState.value == 2 || playerState.value == 3) return true
      if(playerState.value == 1 ) return false
    })

    return {
      currentTime,
      setCurrentTime,
      formatTime,
      duration,
      loadVideoCover,
      previousVideo,
      stopVideo,
      playPauseVideo,
      nextVideo,
      randomVideo,
      oneLoop,
      mute,
      volumeRange,
      changeVolume,
      volume,
      buttonPlayPause
    }
  }
}
</script>

<template lang='pug'>
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
</template>

<style lang='stylus'>
@import '../css/style.styl'

img
  size(100%,40vh)
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
</style>