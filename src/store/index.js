import { createStore } from 'vuex'

export default createStore({
  state: {
    player: {},
    ytId: {
      list: '',
      video: '',
      index: 0
    },
    isRandom: false
  },
  mutations: {
    statePlayer(state,payload) {
      state.player = payload
    },

    stateIsRandoom(state,boolean) {
      state.isRandom = boolean
    }
  },
  actions: {
    commitPlayer({ commit },payload) {
      commit('statePlayer', payload)
    },

    commitIsRandom({ commit },boolean) {
      commit('stateIsRandoom',boolean)
    }
  },
  getters: {
    player(state) {
      return state.player
    },

    ytId(state) {
      return state.ytId
    }
  }
})
