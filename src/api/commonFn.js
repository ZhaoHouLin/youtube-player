import { computed } from 'vue'
import { useStore } from 'vuex'

const commonFn = ()=> {

  const store = useStore()

  let timer = null

  const player = computed(() => {
    return store.getters.player
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
    console.log('clear');
  }

  return {
    loadVideo,
    loadPlaylist,
    currentTimer,
    clearTimer
  }
}

export const getCommonFn = commonFn

