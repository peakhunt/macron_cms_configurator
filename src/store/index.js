import Vue from 'vue'
import Vuex from 'vuex'

import Project from './Project'
import Errors from './Errors'
import Info from './Info'
import Tanks from './Tanks'
import Channels from './Channels'
import Alarms from './Alarms'
import IOStore from './IO'

Vue.use(Vuex)

const state = {
  ...Errors.state,
  ...Channels.state,
  ...Alarms.state,
  ...IOStore.state,
  projectConfig: null,
  changed: false,
  fileName: null,
  printing: false
}

const getters = {
  ...Project.getters,
  ...Errors.getters,
  ...Info.getters,
  ...Tanks.getters,
  ...Channels.getters,
  ...Alarms.getters,
  ...IOStore.getters,
  isPrinting (state) {
    return state.printing
  }
}

const mutations = {
  ...Project.mutations,
  ...Errors.mutations,
  ...Info.mutations,
  ...Tanks.mutations,
  ...Channels.mutations,
  ...Alarms.mutations,
  ...IOStore.mutations,
  setPrinting (state, payload) {
    state.printing = payload
  }
}

const actions = {
  ...Project.actions,
  ...Errors.actions,
  ...Info.actions,
  ...Tanks.actions,
  ...Channels.actions,
  ...Alarms.actions,
  ...IOStore.actions
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  strict: true
})

store.subscribe((mutation, state) => {
  const exceptions = [
    'SET_CHANGED',
    'CLEAR_CHANGED',
    'LOAD_NEW_PROJECT',
    'SAVE_PROJECT',
    'SET_FILE_NAME',
    'CLEAR_ERRORS',
    'ADD_ERROR',
    'REMOVE_ERROR',
    'setPrinting'
  ]

  if (exceptions.includes(mutation.type)) {
    return
  }

  store.commit('SET_CHANGED')
})

export default store
