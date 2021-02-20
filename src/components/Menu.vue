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

    const handleOpen = ()=> {
      isOpen.value = !isOpen.value
    }

    const handleUrlVideoId = (arr)=> {
      let filterVid = arr.filter((item)=> {
        return item.indexOf('v=') !== -1 || item.indexOf('youtu.be/') !== -1
      })
      store.dispatch('commitYtIdVideo',filterVid[0].split('v=')[1] || filterVid[0].split('youtu.be/')[1])
      store.dispatch('commitIsRandom',false)
    }

    const urlGetId = ()=> {
      let idHandleArray = ytUrl.value.split('&')
      handleUrlVideoId(idHandleArray)
      
      if(ytUrl.value.indexOf('list=') !== -1){
        console.log('url',ytUrl.value.indexOf('list='));
        let filterListId = idHandleArray.filter((item)=> item.indexOf('list=') !==-1)
        let filterIndex = idHandleArray.filter((item)=> item.indexOf('index=') !==-1)
        console.log('filterListId',filterListId,'filterIndex',filterIndex);
        store.dispatch('commitYtIdList',filterListId[0].split('list=')[1])
        if (filterIndex[0].indexOf('index=') !== -1) {
          store.dispatch('commitYtIdIndex',(filterIndex[0].split('index=')[1])-1)
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
    .submit
      button(@click='urlGetId' ) send  

</template>
<style lang='stylus'>
@import '../css/style.styl'
.menu
  size(100%,8vh)
  background-color color-primary-dark
  flexCenter(flex-start,center,)
  z-index 100
  i
    margin-right 1rem
    padding 0 1rem
    cursor pointer
    size(10%,auto)
    color color-secondary-dark
    font-size md
  .user-enter-url
    display none
    input
      width 80%
    .submit
      size(20%,auto)
      button
        color color-secondary
    &.open
      display block
      flexCenter()
      size(90%,3vh)
      input
        width 80%
      .submit
        size(20%,auto)
        button
          padding 0.5*sm
          border 0.5px solid color-secondary-light
          font-size sm
          color color-secondary
          
</style>