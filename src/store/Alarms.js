import Vue from 'vue'

const startAlarmNum = 10000

const alarmFactory = {
  emptyAlarm: () => {
    return {
      name: '',
      type: '',
      severity: '',
      channel: -1,
      set: 0,
      delay: 0
    }
  }
}

const state = {
  alarmFactory,
  alarmSeverities: [
    'minor',
    'major',
    'critical'
  ],
  alarmAnalogTypes: [
    'high',
    'low'
  ],
  alarmDigitalTypes: [
    'digita'
  ]
}

const getters = {
  nextFreeAlarmNum (state) {
    //
    // XXX performance optimize ???
    //
    for (let ndx = startAlarmNum; ; ndx++) {
      if (state.projectConfig.project.alarms[ndx] === undefined) {
        return ndx
      }
    }
  },
  getAlarmByNumber: (state) => (num) => {
    return state.projectConfig.project.alarms[num]
  },
  alarmsObj (state) {
    return state.projectConfig.project.alarms
  },
  alarmSeverities (state) {
    return state.alarmSeverities
  },
  alarmAnalogTypes (state) {
    return state.alarmAnalogTypes
  },
  alarmFactory (state) {
    return state.alarmFactory
  }
}

const mutations = {
  ADD_ALARM (state, payload) {
    Vue.set(state.projectConfig.project.alarms, payload.number, payload.alarm)
  },
  DEL_ALARM (state, alarmNum) {
    Vue.delete(state.projectConfig.project.alarms, alarmNum)
  },
  UPDATE_ALARM (state, payload) {
    Vue.set(state.projectConfig.project.alarms, payload.number, payload.alarm)
  },
  UPDATE_ALARM_CFG (state, payload) {
    payload.alarm[payload.key] = payload.value
  }
}

const actions = {
  updateAlarm (context, payload) {
    context.commit('UPDATE_ALARM', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
