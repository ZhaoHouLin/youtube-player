<script>
import { computed, onMounted, reactive, ref } from 'vue'

export default {

  setup() {
    let Player = ref()

    let options = reactive({
      techOrder: ["youtube"], 
      sources: [
        { 
          "type": "video/youtube", 
          "src": "https://www.youtube.com/watch?v=pjCyDeEYSq8"
        }
      ]
    })

    const optionToJSON = computed(()=> {
      console.log(JSON.stringify(options));
      return JSON.stringify(options) 
    })

    onMounted(()=> {
      // console.log(Player);
    }) 

    return {
      Player,
      optionToJSON
    }
  }
}
</script>


<template lang='pug'>
video(ref='Player' id="vid1" class="video-js vjs-default-skin vjs-big-play-centered" controls autoplay width="1280" height="720" :data-setup='optionToJSON') 


</template>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
