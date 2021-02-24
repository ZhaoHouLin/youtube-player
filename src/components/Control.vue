<script>
import { ref, computed} from 'vue'
import { useStore } from 'vuex'
import { apiGetCommonFn } from '../api'
export default {
  setup() {
    const store = useStore()

    const { loadVideo, loadPlaylist, nextVideo} = apiGetCommonFn()
    
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
      return store.getters.playlist
    })
    const info = computed(()=> {
      return store.getters.info
    })
    const isOneLoop = computed(()=> {
      return store.getters.isOneLoop
    })
    const isRandom = computed(()=> {
      return store.getters.isRandom
    })

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
       return `http://img.youtube.com/vi/${ytId.value.video}/maxresdefault.jpg`
    })

    const backgroundStyle = computed(()=> {
      return {
        'background-image': `url(http://img.youtube.com/vi/${ytId.value.video}/maxresdefault.jpg)`,
        'background-position': `center`,
        'background-size': `cover`,
        'background-repeat': 'no-repeat',
        'filter': `blur(16px)`

      }
    })

    const previousVideo = ()=> {
      store.dispatch('commitIsOneLoop',false)
      if(isRandom.value) {
        let random = Math.floor(Math.random()*player.value.getPlaylist().length)
        console.log('random',random);
        store.dispatch('commitYtIdIndex',random)
        store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
        player.value.previousVideo()
      } else {
        store.dispatch('commitYtIdIndex',ytId.value.index-1)
        store.dispatch('commitYtIdVideo',playlist.value[ytId.value.index])
  
        if(ytId.value.index < 0) {
          store.dispatch('commitYtIdIndex',player.value.getPlaylist().length-1)
          store.dispatch('commitYtIdVideo',player.value.getPlaylist()[player.value.getPlaylist().length-1])
        }

      }

      loadVideo()
      loadPlaylist(ytId.value.list,ytId.value.index) 
    } 


    const stopVideo = ()=> {
      store.dispatch('commitCurrentTime', 0)
      store.dispatch('commitPlayerState', 1)
      player.value.stopVideo()
    }

    const playPauseVideo = ()=> {
      player.value.playVideo()
      store.dispatch('commitPlayerState',player.value.getPlayerState())

      if(playerState.value == 2) {
        player.value.playVideo()
      }
      if(playerState.value == 1) {
        player.value.pauseVideo()
      }
    }

    const randomVideo = ()=> {
      store.dispatch('commitIsRandom', !isRandom.value)
      store.dispatch('commitIsOneLoop',false)

      console.log(isRandom.value);
    }

    const oneLoop = ()=> {
      store.dispatch('commitIsOneLoop',!isOneLoop.value)
      store.dispatch('commitIsRandom', false)
      store.dispatch('commitYtIdVideo',info.value.data.video_id)
      console.log('oneLoop',store.getters.isOneLoop);
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
      if(playerState.value == 1 ) {
        return true
      } else {
        return false
      }
    })

    const marqueeAnimate = computed(()=> {
      if (playerState.value!==1) {
        return {
          'animation-name': `marquee-animate`,
          'animation-delay': `-1s`,
          'animation-duration': `15s`,
          'animation-iteration-count': `infinite`,
          'animation-timing-function': `linear`,
          'animation-direction': `alternate`
        }
      }
    })

    const hoverId = ref('')
    const mouseOver = (e)=> {
      hoverId.value = e.target.id
    }
    const mouseLeave = ()=> {
      hoverId.value = ''
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
      volume,
      buttonPlayPause,
      backgroundStyle,
      isOneLoop,
      isRandom,
      info,
      marqueeAnimate,
      mouseOver,
      mouseLeave,
      hoverId
    }
  }
}
</script>

<template lang='pug'>
#player

.screen
  img(:src="loadVideoCover", alt="alt")
  .blur-background(:style='backgroundStyle')

.progress-bar
  label {{formatTime(currentTime)}}
  .progress-content
    input.bar(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' @mouseover='mouseOver($event)' @mouseleave='mouseLeave') 
    .content
      .slider
        .track
        .range(:style='{"left": `${currentTime/duration*100}%`}')
        .thumb(:style='{"left": `${currentTime/duration*100}%`}' :class='[{"hover": hoverId=="duration"}]')
  label {{formatTime(duration)}}

.control
  button(@click='previousVideo')
    i.fas.fa-step-backward
  button(@click='stopVideo')
    i.fas.fa-stop
  button(@click='playPauseVideo')
    i(:class='["fas",{"fa-play": buttonPlayPause},{"fa-pause": !buttonPlayPause}]')
  button(@click='nextVideo')
    i.fas.fa-step-forward
  button(@click='randomVideo'  :class='["random",{"active": isRandom}]')
    i.fas.fa-random
  button(@click='oneLoop' title='test' :class='["loop",{"active": isOneLoop}]')
    i.fas.fa-undo

.volume-range
  .volume
    button(@click='mute' )
      i(:class='["fas",{"fa-volume-mute": volumeRange==1},{"fa-volume-off": volumeRange==2},{"fa-volume-down": volumeRange==3},{"fa-volume-up": volumeRange==4}]')
  .range-content
    input(type="range" id="vol" name="vol" min="0" max="100" step=1 v-model.number='volume' @mouseover='mouseOver($event)' @mouseleave='mouseLeave' )  
    .content
      .slider
        .track
        .range(:style='{"left": `${volume}%`}')
        .thumb(:style='{"left": `${volume}%`}' :class='[{"hover": hoverId=="vol"}]')

.info
  a.marquee(:href="info.videoUrl" target='_blank' :style='marqueeAnimate')
    h3 {{info.data.title}} 

</template>

<style lang='stylus'>
@import '../css/style.styl'

#player
  size(100%,60vh)
  display none
.screen
  position relative
  background-color color-primary 
  size(100%,60vh)
  padding 1vh
  flexCenter()
  // display none
  img
    border-radius 4%
    size(96%,auto)
    z-index 100
    box-shadow 2px 2px 2px 2px color-primary-dark
    cursor pointer

  .blur-background
    position absolute
    size(100%,50vh)
  

.progress-bar
  size(100%,4vh)
  color color-secondary-dark
  background-color color-primary-dark
  flexCenter()
  .progress-content
    flexCenter(,,column)
    position relative
    size(70%,auto)
    .bar
      size(70%,auto)
      margin 0 8px
    inputRange($width=70%)
    .content
      position relative
      width $width
      .slider
        flexCenter(,,column)
        position relative
        z-index 1
        height 10px
        margin 0 16px
        & > .track
          position absolute
          z-index 1
          left 0
          right 0
          top 0
          bottom 0
          // border-radius 5px
          background-color color-secondary-dark
        & > .range
          position absolute
          z-index 2
          left 0%
          right 0%
          top 0
          bottom 0
          // border-radius 5px
          background-color color-secondary-light 
        & > .thumb
          position absolute
          z-index 3
          width 8px
          height 20px
          background-color color-secondary
          // border-radius 50%
          transition box-shadow .3s ease-in-out
          left 0%
          &.hover
            box-shadow 0 0 0 2px color-secondary-dark
          &.active
            box-shadow 0 0 0 40px rgba(98,0,238,.2)


.control,.volume-range
  flexCenter()
  button
    outline none
    background-color color-primary-dark
    color color-secondary
    size(100%,auto)
    padding 8px
    i
      font-size md

.control
  size(100%,auto)
  .random,.loop
    &.active
      background-color color-secondary
      color  color-primary-dark
  button
    &:active
      background-color color-secondary
      color  color-primary-dark

.volume-range
  size(100%,auto)
  background-color color-primary-dark
  flexCenter(flex-start,center,)
  .volume
    size((100/6)%,100%)
    button
      i
        font-size 1.5rem

  .range-content                  //input range配合js寫法
    size(100%,auto)
    flexCenter(,,column)
    position relative
    inputRange($w=90%)
    .content
      position relative
      width $w
      .slider
        position relative
        z-index 1
        height 10px
        margin 0 15px
        & > .track
          position absolute
          z-index 1
          left 0
          right 0
          top 0
          bottom 0
          border-radius 5px
          background-color color-secondary-dark
        & > .range
          position absolute
          z-index 2
          left 100%
          right 0%
          top 0
          bottom 0
          border-radius 5px
          background-color color-secondary-light 
        & > .thumb
          position absolute
          z-index 3
          width 20px
          height 20px
          background-color color-secondary
          border-radius 50%
          transition box-shadow .3s ease-in-out
          left 50%
          transform translate(-10px, -5px)
          &.hover
            box-shadow 0 0 0 10px color-secondary-dark
          &.active
            box-shadow 0 0 0 40px rgba(98,0,238,.2)


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
    size(auto,auto)






@keyframes marquee-animate
  0%
    transform translateX(-100%)
  100%
    transform translateX(100%)

@media screen and (min-width 720px)
  .screen
    img
      size(auto,100%)
</style>