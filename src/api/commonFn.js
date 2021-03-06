import { computed } from 'vue'
import { useStore } from 'vuex'

const commonFn = ()=> {

  const store = useStore()

  const ytId = computed(() => {
    return store.getters.ytId
  })

  const playlist = computed(() => {
    return store.getters.playlist
  })

  let timer = null

  const player = computed(() => {
    return store.getters.player
  })

  const isRandom = computed(() => {
    return store.getters.isRandom
  })

  const loadVideo = (id) => {
    player.value.loadVideoById({
      videoId: id,
    })
  }

  const loadPlaylist = (id, idx) => {
    player.value.loadPlaylist({
      listType: 'playlist',
      list: id,
      index: idx
    })
  }

  const currentTimer = () => {
    timer = setInterval(() => {
      store.dispatch('commitCurrentTime', Math.floor(player.value.getCurrentTime()))
    }, 1000);
  }

  const clearTimer = () => {
    clearInterval(timer)
  }

  const nextVideo = () => {                               //下一首影片播放
    store.dispatch('commitIsOneLoop', false)
    if (isRandom.value) {
      let random = Math.floor(Math.random() * player.value.getPlaylist().length)
      console.log('random', random);
      store.dispatch('commitYtIdIndex', random)
      store.dispatch('commitYtIdVideo', playlist.value[ytId.value.index])
      player.value.nextVideo()
    } else {
      store.dispatch('commitYtIdIndex', ytId.value.index + 1)
      store.dispatch('commitYtIdVideo', playlist.value[ytId.value.index])
      if (ytId.value.index > playlist.value.length - 1) {
        store.dispatch('commitYtIdIndex', 0)
        store.dispatch('commitYtIdVideo', player.value.getPlaylist()[0])
      }
    }

    loadVideo()
    loadPlaylist(ytId.value.list, ytId.value.index)      //單曲循環後確保清單播放
  }

  return {
    loadVideo,
    loadPlaylist,
    currentTimer,
    clearTimer,
    nextVideo
  }
}

export const getCommonFn = commonFn

