<script>
import { ref, computed} from 'vue'
export default {
  setup() {
    const currentTime = ref(0)
    const duration = ref('00')
    const volume = ref(50)
    const ytId = computed(()=> {
      return store.getters.ytId
    })
    const player = computed(()=> {
      return store.getters.player
    })

    const setCurrentTime = ()=> {
      player.seekTo(currentTime.value,true)
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

    const stopVideo = ()=> {
      console.log(player.getPlayerState());
      player.stopVideo()
    }

    const playPauseVideo = ()=> {
      player.playVideo()
      playerState.value = player.getPlayerState()
      console.log(player.getPlayerState());
      if(playerState.value == 2) player.playVideo()
      if(playerState.value == 1) player.pauseVideo()
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

    const randomVideo = ()=> {
      isRandom.value = !isRandom.value
      console.log(isRandom.value);
      player.setShuffle(isRandom.value)
    }

    const oneLoop = ()=> {
      isOneLoop.value = true
      ytId.video = info.data.video_id
    }

    const mute = ()=> {
      if (player.isMuted()) {
        player.unMute()
        volume.value = player.getVolume()
      } else {
        player.mute()
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
      player.unMute()
      volume.value = val
      player.setVolume(volume.value)
    }

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
      volume
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