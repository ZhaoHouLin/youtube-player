<script>
import { ref, computed } from "vue"
import { useStore } from "vuex"
import { apiGetCommonFn } from "../api"
export default {
  setup() {
    const store = useStore()

    const { loadVideo, loadPlaylist, nextVideo } = apiGetCommonFn()

    const ytId = computed(() => {
      //youtube影片ID資料
      return store.getters.ytId
    })
    const player = computed(() => {
      //youtube iframe API 的播放器dom
      return store.getters.player
    })
    const playerState = computed(() => {
      //當前播放狀態
      return store.getters.playerState
    })
    const playlist = computed(() => {
      //播放清單(陣列，內容為各影片的ID)
      return store.getters.playlist
    })
    const info = computed(() => {
      //影片的相關資訊
      return store.getters.info
    })
    const isOneLoop = computed(() => {
      //是否單曲循環的狀態
      return store.getters.isOneLoop
    })
    const isRandom = computed(() => {
      //是否隨機播放的狀態
      return store.getters.isRandom
    })
    const volume = ref(50) //預設音量為50
    const currentTime = computed({
      //雙向綁定vuex寫法
      set(val) {
        store.dispatch("commitCurrentTime", val)
      },
      get() {
        return store.getters.currentTime
      },
    })
    const duration = computed(() => {
      //影片片長時間(秒)
      return store.getters.duration
    })

    const setCurrentTime = () => {
      //設定從第幾秒開始播放
      player.value.seekTo(currentTime.value, true)
    }
    const formatTime = (val) => {
      //格式化影片時間(00:00)
      let dMinutes = "00" + Math.floor(val / 60)
      let dSeconds = "00" + Math.floor(val % 60)
      return `${dMinutes.substring(dMinutes.length - 2)}:${dSeconds.substring(
        dSeconds.length - 2
      )}`
    }
    const previousVideo = () => {
      //前一首影片播放
      store.dispatch("commitIsOneLoop", false)
      if (isRandom.value) {
        let random = Math.floor(
          Math.random() * player.value.getPlaylist().length
        )
        console.log("random", random)
        store.dispatch("commitYtIdIndex", random)
        store.dispatch("commitYtIdVideo", playlist.value[ytId.value.index])
        player.value.previousVideo()
      } else {
        store.dispatch("commitYtIdIndex", ytId.value.index - 1)
        store.dispatch("commitYtIdVideo", playlist.value[ytId.value.index])
        if (ytId.value.index < 0) {
          store.dispatch(
            "commitYtIdIndex",
            player.value.getPlaylist().length - 1
          )
          store.dispatch(
            "commitYtIdVideo",
            player.value.getPlaylist()[player.value.getPlaylist().length - 1]
          )
        }
      }
      loadVideo()
      loadPlaylist(ytId.value.list, ytId.value.index)
    }
    const stopVideo = () => {
      //停止播放
      store.dispatch("commitCurrentTime", 0)
      store.dispatch("commitPlayerState", 1)
      player.value.stopVideo()
    }
    const playPauseVideo = () => {
      //播放和暫停
      player.value.playVideo()
      store.dispatch("commitPlayerState", player.value.getPlayerState())
      if (playerState.value == 2) {
        player.value.playVideo()
      }
      if (playerState.value == 1) {
        player.value.pauseVideo()
      }
    }
    const randomVideo = () => {
      //隨機播放
      store.dispatch("commitIsRandom", !isRandom.value)
      store.dispatch("commitIsOneLoop", false)
    }
    const oneLoop = () => {
      //單手重複播放
      store.dispatch("commitIsOneLoop", !isOneLoop.value)
      store.dispatch("commitIsRandom", false)
      store.dispatch("commitYtIdVideo", info.value.data.video_id)
    }
    const mute = () => {
      //判斷靜音
      if (player.value.isMuted()) {
        player.value.unMute()
        volume.value = player.value.getVolume()
      } else {
        player.value.mute()
        volume.value = 0
      }
    }
    const changeVolume = (val) => {
      //改變音量
      player.value.unMute()
      volume.value = val
      player.value.setVolume(volume.value)
    }

    const volumeRange = computed(() => {
      //判斷音量範圍呈現不同的icon
      if (volume.value > 0 && volume.value < 50) return 2
      if (volume.value > 50 && volume.value < 70) return 3
      if (volume.value > 70) return 4
      if (volume.value == 0) {
        return 1
      } else {
        return 2
      }
    })
    const buttonPlayPause = computed(() => {
      //判斷播放or暫停呈現不同的icon
      if (playerState.value == 1) {
        return true
      } else {
        return false
      }
    })
    const marqueeAnimate = computed(() => {
      //影片標題跑馬燈css動畫
      if (playerState.value !== 1) {
        return {
          "animation-name": `marquee-animate`,
          "animation-delay": `-1s`,
          "animation-duration": `15s`,
          "animation-iteration-count": `infinite`,
          "animation-timing-function": `linear`,
          "animation-direction": `alternate`,
        }
      }
    })
    const loadVideoCover = computed(() => {
      //呈現影片縮圖
      return `http://img.youtube.com/vi/${ytId.value.video}/maxresdefault.jpg`
    })
    const backgroundStyle = computed(() => {
      //設定影片縮圖相關CSS格式
      return {
        "background-image": `url(http://img.youtube.com/vi/${ytId.value.video}/maxresdefault.jpg)`,
        "background-position": `center`,
        "background-size": `cover`,
        "background-repeat": "no-repeat",
        filter: `blur(16px)`,
      }
    })

    //  ↓------以js改變input range的樣式------↓
    const hoverId = ref("") //hover用ID(存放hover時的dom ID存放hover時的dom ID)
    const activeId = ref("") //active用ID(存放active時的dom ID存放hover時的dom ID)
    const mouseDown = (e) => {
      //當mousedown事件時
      activeId.value = e.target.id //符合傳入的id才會觸發css
    }
    const mouseUp = () => {
      //當mouseup事件時
      activeId.value = ""
    }
    const mouseOver = (e) => {
      //當mouseover事件時
      hoverId.value = e.target.id
    }
    const mouseLeave = () => {
      //當mouseleave事件時
      hoverId.value = ""
    }
    //  ↑------以js改變input range的樣式------↑

    //  ↓------全螢幕相關------↓
    const playerScreen = ref() //包裝播放器screen的dom
    const videoIsOpen = ref(false) //影片開啟的狀態
    const isFullScreen = ref(false) //全螢幕的狀態

    const handleVideoOpen = () => {
      //判斷開啟video
      videoIsOpen.value = !videoIsOpen.value
    }
    const handleFullScreen = () => {
      //判斷開啟全螢幕
      isFullScreen.value = !isFullScreen.value
    }
    const launchIntoFullscreen = () => {
      //檢查全螢幕
      if (document.fullscreenElement) {
        //document.fullscreenElement有值時
        document.exitFullscreen()
      } else {
        playerScreen.value.requestFullscreen()
      }
    }
    //  ↑------全螢幕相關------↑

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
      hoverId,
      mouseDown,
      mouseUp,
      activeId,
      videoIsOpen,
      handleVideoOpen,
      isFullScreen,
      handleFullScreen,
      launchIntoFullscreen,
      playerScreen,
    }
  },
}
</script>

<template lang="pug">
//- .player(v-show='videoIsOpen' :class='[{"full-window": isFullScreen}]' )
.player(v-show='videoIsOpen' ref='playerScreen' )
  .layer(:class='[{"full-window": isFullScreen}]')
    .close-video(@click='handleVideoOpen')
      i.fas.fa-backspace
    .open-full-window(@click='handleFullScreen(),launchIntoFullscreen()')
      i(:class='["fas",{"fa-expand-alt": !isFullScreen},{"fa-compress-alt": isFullScreen}]')
  #player

.screen(v-show='!videoIsOpen' )
  img(:src="loadVideoCover", alt="alt" @click='handleVideoOpen')
  .blur-background(:style='backgroundStyle')

.progress-bar
  label {{formatTime(currentTime)}}
  .progress-content
    input.bar(type="range" id="duration" name="duration" min="0" :max="duration" step=1 @change='setCurrentTime' v-model.number='currentTime' @mouseover='mouseOver($event)' @mouseleave='mouseLeave' @mousedown='mouseDown($event)' @mouseup='mouseUp') 
    .content
      .slider
        .track
        .range(:style='{"left": `${currentTime/duration*100}%`}')
        .thumb(:style='{"left": `${currentTime/duration*100}%`}' :class='[{"hover": hoverId=="duration"},{"active": activeId=="duration"}]')
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
  button(@click='handleFullScreen(),launchIntoFullscreen()')
    i(:class='["fas",{"fa-expand-alt": !isFullScreen},{"fa-compress-alt": isFullScreen}]')

.volume-range
  .volume
    button(@click='mute' )
      i(:class='["fas",{"fa-volume-mute": volumeRange==1},{"fa-volume-off": volumeRange==2},{"fa-volume-down": volumeRange==3},{"fa-volume-up": volumeRange==4}]')
  .range-content
    input(type="range" id="vol" name="vol" min="0" max="100" step=1 v-model.number='volume' @mouseover='mouseOver($event)' @mouseleave='mouseLeave' @input='changeVolume(volume)' @mousedown='mouseDown($event)' @mouseup='mouseUp')  
    .content
      .slider
        .track
        .range(:style='{"left": `${volume}%`}')
        .thumb(:style='{"left": `${volume}%`}' :class='[{"hover": hoverId=="vol"},{"active": activeId=="vol"}]')

.info
  a.marquee(:href="info.videoUrl" target='_blank' :style='marqueeAnimate')
    h3 {{info.data.title}} 

</template>

<style lang="stylus">
@import '../css/style.styl'
.player
  size(100%,70vh)
  position relative

  .layer
    posCenter()
    size(100%,30vh)
    cursor pointer
    transition opacity .3s ease-in-out
    flexCenter()
    opacity 0
    &.full-window
      size(100%,70vh)
    &:hover
      opacity 1
    .close-video,.open-full-window
      size(50%,100%)
      flexCenter()
      font-size 2*xl
      i
        transition color .3s ease-in-out
        color color-secondary-light
      &:hover i
        color color-secondary-dark

  #player
    size(100%,100%)

.screen
  position relative
  background-color color-primary
  size(,70vh)
  flexCenter()

  img
    border-radius 4%
    size(96%,auto)
    z-index 100
    box-shadow 2px 2px 2px 2px color-primary-dark
    cursor pointer
    transition opacity .3s ease-in-out
    &:hover
      opacity 0.3

  .blur-background
    position absolute
    size(100%,50vh)


.progress-bar
  size(100%,8vh)
  color color-secondary-dark
  background-color color-primary-dark
  flexCenter()
  padding 4px
  .progress-content
    flexCenter(,,column)
    position relative
    size(70%,auto)
    .bar
      size(100%,auto)
      margin 0 8px
    inputRange($width=100%)
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
          background-color color-secondary-dark
        & > .range
          position absolute
          z-index 2
          left 0%
          right 0%
          top 0
          bottom 0
          background-color color-secondary-light
        & > .thumb
          position absolute
          z-index 3
          width 8px
          height 20px
          background-color color-secondary
          transition box-shadow .3s ease-in-out
          left 0%
          &.hover
            box-shadow 0 0 0 2px color-secondary-dark
          &.active
            box-shadow 0 0 0 4px rgba(98,0,238,.2)


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
    cursor pointer
    &:active
      background-color color-secondary
      color  color-primary-dark
    i
      font-size 1.5rem

.volume-range
  size(100%,auto)
  background-color color-primary-dark
  flexCenter(flex-start,center,)
  .volume
    size((100/6)%,100%)

    button
      cursor pointer
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
            box-shadow 0 0 0 10px rgba(187,0,47,.5)
          &.active
            box-shadow 0 0 0 16px rgba(98,0,238,.2)


.info
  flexCenter()
  size(100%,10vh)
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
  .screen img
    size(auto,100%)
</style>
