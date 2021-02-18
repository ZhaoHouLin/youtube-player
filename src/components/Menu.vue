<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { apiGetCommonFn } from '../api'
export default {
  setup() {
    const store = useStore()
    const { loadVideo, loadPlaylist } = apiGetCommonFn()

    const ytUrl = ref('')
    const isOpen = ref(false)

    const ytId = computed(()=> {
      return store.getters.ytId
    })
    // const player = computed(()=> {
    //   return store.getters.player
    // })

    const handleOpen = ()=> {
      isOpen.value = !isOpen.value
    }

    const handleUrlVideoId = (arr)=> {
      console.log('arr',arr);
      let filterVid = arr.filter((item)=> {
        return item.indexOf('v=') !== -1 || item.indexOf('youtu.be/') !== -1
      })
      // ytId.video = filterVid[0].split('v=')[1] || filterVid[0].split('youtu.be/')[1]

      store.dispatch('commitYtIdVideo',filterVid[0].split('v=')[1] || filterVid[0].split('youtu.be/')[1])
      store.dispatch('commitIsRandom',false)
      // isRandom.value = false
    }

    const urlGetId = ()=> {
      let idHandleArray = ytUrl.value.split('&')
      handleUrlVideoId(idHandleArray)
      if(ytUrl.value.indexOf('list=') !== -1){
        let filterListId = idHandleArray.filter((item)=> item.indexOf('list=') !==-1)
        let filterIndex = idHandleArray.filter((item)=> item.indexOf('index=') !==-1)
        // ytId.list = filterListId[0].split('list=')[1]
        store.dispatch('commitYtIdList',filterListId[0].split('list=')[1])

        if (filterIndex.indexOf('index=')!==-1) {
          // ytId.index = filterIndex[0].split('index=')[1]-1
          store.dispatch('commitYtIdIndex',filterIndex[0].split('index=')[1]-1)
        } else {
          loadVideo(ytId.value.video)     //消除輸入另一個播放清單切換不過去的問題
        }
        loadPlaylist(ytId.value.list,ytId.value.index)
      } else {
        loadVideo(ytId.value.video)
      }
    }

    return {
      ytUrl,
      isOpen,
      handleOpen,
      urlGetId
    }
  }
}
</script>
<template lang='pug'>
.menu
  i(@click='handleOpen' :class='["fas",{"fa-bars": !isOpen},{"fa-times":isOpen}]')
  .user-enter-url(:class='[{"open": isOpen}]')
    input(type='text' v-model='ytUrl' placeholder='enter YouTube video url')
    button(@click='urlGetId' ) send  

</template>
<style lang='stylus'>
@import '../css/style.styl'
.menu
  size(100%,8vh)
  background-color color-primary-dark
  flexCenter(flex-start,center,)
  // padding 0 1rem
  i
    // border solid 1px #eee
    margin-right 1rem
    padding 0 1rem
    cursor pointer
    size(10%,auto)
    color color-secondary-dark
    font-size md
  .user-enter-url
    // border solid 1px #eee
    flexCenter()
    size(0,0)
    display none
    input
      width 80%
    button
      color #eee
      width 20%
    &.open
      display block
      size(90%,3vh)
      input
        width 80%
      button
        color #eee
        width 20%
</style>