import { computed } from 'vue'
import { useStore } from 'vuex'

const commonFn = ()=> {

  const store = useStore()

  const player = computed(() => {
    return store.getters.player
  })

  const loadVideo = (id) => {
    console.log('id',id);
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

  return {
    loadVideo,
    loadPlaylist
  }
}


export const getCommonFn = commonFn

