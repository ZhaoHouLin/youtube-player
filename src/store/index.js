import { createStore } from 'vuex'

export default createStore({
  state: {
    player: {},
    playerState: 0,
    ytId: {
      list: '',
      video: '',
      index: 0
    },
    playlist: [],
    info: {
      data: {
        title: ''
      }
    },
    isOneLoop: false,
    isRandom: false,
    currentTime: 0,
    duration: '00'
  },
  mutations: {
    statePlayer(state,payload) {
      state.player = payload
    },
    statePlayerState(state,value) {
      state.playerState = value
    },
    statePlaylist(state, data) {
      state.playlist = data
    },
    stateYtIdVideo(state, vId) {
      state.ytId.video = vId
    },
    stateYtIdList(state, list) {
      state.ytId.list = list
    },
    stateYtIdIndex(state, index) {
      state.ytId.index = index
    },
    stateInfo(state,payload) {
      state.info = payload
    },
    stateIsPlaying(state, boolean) {
      state.isPlaying = boolean
    },
    stateIsOneLoop(state,boolean) {
      state.isOneLoop = boolean
    },
    stateIsRandoom(state,boolean) {
      state.isRandom = boolean
    },
    stateCurrentTime(state,value) {
      state.currentTime = value
    },
    stateDuration(state,value) {
      state.duration = value
    }
  },
  actions: {
    commitPlayer({ commit },payload) {
      commit('statePlayer', payload)
    },
    commitPlayerState({ commit },value) {
      commit('statePlayerState',value)
    },
    commitPlaylist({ commit },data) {
      commit('statePlaylist',data)
    },
    commitYtIdVideo({ commit }, vId) {
      commit('stateYtIdVideo', vId)
    },
    commitYtIdList({ commit }, list) {
      commit('stateYtIdList', list)
    },
    commitYtIdIndex({ commit }, index) {
      commit('stateYtIdIndex', index)
    },
    commitInfo({ commit },payload) {
      commit('stateInfo',payload)
    },
    commitIsOneLoop({ commit },boolean) {
      commit('stateIsOneLoop',boolean)
    },
    commitIsRandom({ commit },boolean) {
      commit('stateIsRandoom',boolean)
    },
    commitCurrentTime({ commit },value) {
      commit('stateCurrentTime',value)
    },
    commitDuration({ commit },value) {
      commit('stateDuration',value)
    }
  },
  getters: {
    player(state) {
      return state.player
    },
    playerState(state) {
      return state.playerState
    },
    ytId(state) {
      return state.ytId
    },
    playlist(state) {
      return state.playlist
    },
    info(state) {
      return state.info
    },
    isOneLoop(state) {
      return state.isOneLoop
    },
    isRandom(state) {
      return state.isRandom
    },
    currentTime(state) {
      return state.currentTime
    },
    duration(state) {
      return state.duration
    }
  }
})
