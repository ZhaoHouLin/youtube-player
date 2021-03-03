export default {
  commitPlayer({ commit }, payload) {
    commit('statePlayer', payload)
  },
  commitPlayerState({ commit }, value) {
    commit('statePlayerState', value)
  },
  commitPlaylist({ commit }, data) {
    commit('statePlaylist', data)
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
  commitInfo({ commit }, payload) {
    commit('stateInfo', payload)
  },
  commitIsOneLoop({ commit }, boolean) {
    commit('stateIsOneLoop', boolean)
  },
  commitIsRandom({ commit }, boolean) {
    commit('stateIsRandoom', boolean)
  },
  commitCurrentTime({ commit }, value) {
    commit('stateCurrentTime', value)
  },
  commitDuration({ commit }, value) {
    commit('stateDuration', value)
  }
}