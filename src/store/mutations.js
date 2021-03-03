export default {
  statePlayer(state, payload) {               //將youtube iframe API player存起來
    state.player = payload
    console.log('player', state.player);
  },
  statePlayerState(state, value) {            //存放播放器播放狀態
    state.playerState = value
  },
  statePlaylist(state, data) {                //存放播放清單
    state.playlist = data
  },
  stateYtIdVideo(state, vId) {                //存放影片ID
    state.ytId.video = vId
  },
  stateYtIdList(state, list) {                //存放清單ID
    state.ytId.list = list
  },
  stateYtIdIndex(state, index) {              //存放清單目前播放的index
    state.ytId.index = index
  },
  stateInfo(state, payload) {                 //存放影片資訊
    state.info = payload
  },
  stateIsOneLoop(state, boolean) {            //存放是否單曲循環狀態
    state.isOneLoop = boolean
  },
  stateIsRandoom(state, boolean) {            //存放是否隨機播放
    state.isRandom = boolean
  },
  stateCurrentTime(state, value) {            //存放當前播放秒數
    state.currentTime = value
  },
  stateDuration(state, value) {               //存放影片時間長度
    state.duration = value
  }
}