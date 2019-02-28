import Vue from 'vue'

const startSensorChannel = 10000

const channelFactory = {
  emptyChannel: () => {
    return {
      name: '',
      dir: '',
      type: '',
      sensor: ''
    }
  }
}

const state = {
  channelFactory
}

const getters = {
  nextFreeSensorChannel (state) {
    //
    // XXX performance optimize ???
    //
    for (let ndx = startSensorChannel; ; ndx++) {
      if (state.projectConfig.project.channels[ndx] === undefined) {
        return ndx
      }
    }
  },
  getChnlByNumber: (state) => (num) => {
    return state.projectConfig.project.channels[num]
  },
  channelsObj (state) {
    return state.projectConfig.project.channels
  },
  channelFactory (state) {
    return state.channelFactory
  }
}

const mutations = {
  ADD_CHANNEL (state, payload) {
    Vue.set(state.projectConfig.project.channels, payload.number, payload.chnl)
  },
  DEL_CHANNEL (state, chnlNum) {
    Vue.delete(state.projectConfig.project.channels, chnlNum)
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
