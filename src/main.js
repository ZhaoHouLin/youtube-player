import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import videojsYoutube from 'videojs-youtube'
import 'video.js/dist/video-js.css'
createApp(App).use(store).use(router).use(videojsYoutube).mount('#app')
