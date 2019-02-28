const tankConfigs = {
  levelStrategy: [
    'First Available',
    'Average'
  ],
  pressureStrategy: [
    'First Available',
    'Average'
  ]
}

const emptyTankTemplate = {
  level: {
    strategy: tankConfigs.levelStrategy[0],
    channel: 0,
    sensors: [
    ],
    alarms: [
    ]
  },
  pressure: {
    strategy: tankConfigs.pressureStrategy[0],
    channel: 0,
    sensors: [
    ],
    alarms: [
    ]
  },
  temperature: {
    channel: 0,
    sensors: [
    ],
    alarms: [
    ]
  }
}

function tankConfigErrorObj (tank, errConfig) {
  return {
    key: `TANK::${tank.name}::${errConfig.key}`,
    value: `${errConfig.value} for ${tank.name}`
  }
}

const tankPreAllocChnls = ['level', 'pressure', 'temperature']
const tankPreAllocAlarms = ['high', 'low']

const tankConfigErrors = {
  level: {
    key: 'LEVEL_SENSOR',
    value: 'Level Sensor is not allocated',
    check: (context, tank) => {
      if (tank.level.sensors.length === 0) {
        context.commit('ADD_ERROR', tankConfigErrorObj(tank, tankConfigErrors['level']))
      } else {
        context.commit('REMOVE_ERROR', tankConfigErrorObj(tank, tankConfigErrors['level']).key)
      }
    }
  },
  pressure: {
    key: 'PRESSURE_SENSOR',
    value: 'Pressure Sensor is not allocated',
    check: (context, tank) => {
      if (tank.pressure.sensors.length === 0) {
        context.commit('ADD_ERROR', tankConfigErrorObj(tank, tankConfigErrors['pressure']))
      } else {
        context.commit('REMOVE_ERROR', tankConfigErrorObj(tank, tankConfigErrors['pressure']).key)
      }
    }
  },
  temperature: {
    key: 'TEMPERATURE_SENSOR',
    value: 'Temperature Sensor is not allocated',
    check: (context, tank) => {
      if (tank.temperature.sensors.length === 0) {
        context.commit('ADD_ERROR', tankConfigErrorObj(tank, tankConfigErrors['temperature']))
      } else {
        context.commit('REMOVE_ERROR', tankConfigErrorObj(tank, tankConfigErrors['temperature']).key)
      }
    }
  }
}

function checkTankConfigErrors (context, tank) {
  for (let k in tankConfigErrors) {
    tankConfigErrors[k].check(context, tank)
  }
}

const defualtSetPoints = {
  'level': (tank, hilow) => {
    return hilow === 'high' ? tank.height - 1 : 1
  },
  'pressure': (tank, hilow) => {
    return hilow === 'high' ? 1.5 : 0.2
  },
  'temperature': (tank, hilow) => {
    return hilow === 'high' ? 100 : 0
  }
}

const getters = {
  numTanks (state) {
    return state.projectConfig.project.tanks.length
  },
  tanks (state) {
    return state.projectConfig.project.tanks
  },
  getTankByNdx: (state) => (ndx) => {
    return state.projectConfig.project.tanks[ndx]
  },
  getTankByName: (state) => (name) => {
    for (let ndx = 0; ndx < state.projectConfig.project.tanks.length; ndx += 1) {
      const tank = state.projectConfig.project.tanks[ndx]

      if (tank.name === name) {
        return name
      }
    }
    return undefined
  },
  tankNdx: (state) => (tank) => {
    return state.projectConfig.project.tanks.indexOf(tank)
    // return state.projectConfig.project.tanks.map(n => n.name).indexOf(tank.name)
  }
}

const mutations = {
  ADD_TANK (state, tank) {
    state.projectConfig.project.tanks.push(tank)
  },
  ADD_TANK_AFTER (state, payload) {
    state.projectConfig.project.tanks.splice(payload.ndx + 1, 0, payload.tank)
  },
  DEL_TANK (state, tank) {
    const ndx = state.projectConfig.project.tanks.indexOf(tank)
    state.projectConfig.project.tanks.splice(ndx, 1)
  },
  ADD_TANK_ALARM (state, payload) {
    const tank = payload.tank
    const type = payload.type
    const alarmNum = payload.alarmNum

    tank[type].alarms.push(alarmNum)
  },
  DEL_TANK_ALARM (state, payload) {
    const tank = payload.tank
    const type = payload.type
    const alarmNum = payload.alarmNum
    const ndx = tank[type].alarms.indexOf(alarmNum)

    tank[type].alarms.splice(ndx, 1)
  },
  CLEAR_TANKS (state, tank) {
    state.projectConfig.project.tanks = []
  },
  ADD_SENSOR (state, payload) {
    const ndx = state.projectConfig.project.tanks.indexOf(payload.tank)
    const tank = state.projectConfig.project.tanks[ndx]

    tank[payload.sensorType].sensors.push(payload.channel)
    tank[payload.sensorType].alarms.push(payload.alarm)
  },
  DEL_SENSOR_CHANNEL (state, payload) {
    const ndx = state.projectConfig.project.tanks.indexOf(payload.tank)
    const tank = state.projectConfig.project.tanks[ndx]
    let tndx = tank[payload.sensorType].sensors.indexOf(payload.channel)

    tank[payload.sensorType].sensors.splice(tndx, 1)
  },
  DEL_SENSOR_ALARM (state, payload) {
    const ndx = state.projectConfig.project.tanks.indexOf(payload.tank)
    const tank = state.projectConfig.project.tanks[ndx]
    let tndx

    tndx = tank[payload.sensorType].alarms.indexOf(payload.alarm)
    tank[payload.sensorType].alarms.splice(tndx, 1)
  },
  DEL_SENSOR (state, payload) {
    const ndx = state.projectConfig.project.tanks.indexOf(payload.tank)
    const tank = state.projectConfig.project.tanks[ndx]
    let tndx

    // delete channel first
    tndx = tank[payload.sensorType].sensors.indexOf(payload.channel)
    tank[payload.sensorType].sensors.splice(tndx, 1)

    // delete all alarms referencing the sensor channel
    const alarmList = tank[payload.sensorType].alarms.filter((alarmNum) => {
      const alarm = state.projectConfig.project.alarms[alarmNum]
      if (alarm.channel === payload.channel) {
        return true
      }
    })
    alarmList.forEach((alarmNum) => {
      tndx = tank[payload.sensorType].alarms.indexOf(alarmNum)
      tank[payload.sensorType].alarms.splice(tndx, 1)
    })
  }
}

const actions = {
  addTank (context, payload) {
    const tank = {
      ...payload,
      ...JSON.parse(JSON.stringify(emptyTankTemplate))
    }

    let chnlNum, alarmNum, chnl, alarm

    tankPreAllocChnls.forEach((propName, index, array) => {
      chnlNum = context.getters.nextFreeSensorChannel
      chnl = context.getters.channelFactory.emptyChannel()

      chnl.name = `${payload.name} ${propName}`
      chnl.dir = 'virtual'
      chnl.type = 'analog'

      context.commit('ADD_CHANNEL', {
        number: chnlNum,
        chnl
      })
      tank[propName].channel = chnlNum

      tankPreAllocAlarms.forEach((alarmName, alarmIndex, alarmArray) => {
        alarmNum = context.getters.nextFreeAlarmNum
        alarm = context.getters.alarmFactory.emptyAlarm()

        alarm.name = `${payload.name} ${propName} ${alarmName}`
        alarm.type = alarmName
        alarm.severity = 'major'
        alarm.channel = chnlNum
        alarm.set = defualtSetPoints[propName](tank, alarmName)
        alarm.delay = 0

        context.commit('ADD_ALARM', {
          number: alarmNum,
          alarm
        })
        tank[propName].alarms.push(alarmNum)
      })
    })
    context.commit('ADD_TANK', tank)

    checkTankConfigErrors(context, tank)
  },
  delAllSensors (context, tank) {
    tankPreAllocChnls.forEach((sensorType) => {
      const sensors = tank[sensorType].sensors.slice()

      sensors.forEach((channel) => {
        context.dispatch('delSensor', {
          sensorType,
          channel,
          tank
        })
      })
    })
    checkTankConfigErrors(context, tank)
  },
  delTank (context, tank) {
    context.dispatch('delAllSensors', tank)
    tankPreAllocChnls.forEach((value, index, array) => {
      tank[value].alarms.forEach((alarmNum, index, alarmArray) => {
        context.commit('DEL_ALARM', alarmNum)
      })
      context.commit('DEL_CHANNEL', tank[value].channel)
    })

    for (let key in tankConfigErrors) {
      context.commit('REMOVE_ERROR', tankConfigErrorObj(tank, tankConfigErrors[key]).key)
    }
    context.commit('DEL_TANK', tank)
  },
  moveTank (context, payload) {
    context.commit('DEL_TANK', payload.tank)

    const ndx = context.getters.tankNdx(payload.tankAfter)

    context.commit('ADD_TANK_AFTER', {
      tank: payload.tank,
      ndx
    })
  },
  delTankAlarm (context, payload) {
    context.commit('DEL_TANK_ALARM', payload)
    context.commit('DEL_ALARM', payload.alarmNum)
  },
  addTankAlarm (context, payload) {
    context.commit('ADD_ALARM', {
      number: payload.alarmNum,
      alarm: payload.alarm
    })
    context.commit('ADD_TANK_ALARM', payload)
  },
  addSensor (context, payload) {
    let chnl, chnlNum, alarm, alarmNum

    chnlNum = context.getters.nextFreeSensorChannel
    chnl = context.getters.channelFactory.emptyChannel()
    chnl.name = `${payload.tank.name} ${payload.sensorType} sensor #${chnlNum}`
    chnl.dir = `in`
    chnl.type = `analog`
    chnl.ioMap = payload.ioLoc
    chnl.sensor = payload.sensor

    context.commit('ADD_CHANNEL', {
      number: chnlNum,
      chnl
    })

    // create sensor fault alarm
    alarmNum = context.getters.nextFreeAlarmNum
    alarm = context.getters.alarmFactory.emptyAlarm()

    alarm.name = `${payload.tank.name} ${payload.sensorType} sensor fault #${chnlNum}`
    alarm.type = 'sensorFault'
    alarm.severity = 'major'
    alarm.channel = chnlNum
    alarm.set = true
    alarm.delay = 0

    context.commit('ADD_ALARM', {
      number: alarmNum,
      alarm
    })

    // commit
    context.commit('ADD_SENSOR', {
      sensorType: payload.sensorType,
      tank: payload.tank,
      channel: chnlNum,
      alarm: alarmNum
    })
    context.commit('ASSIGN_SLOT_TO_CHANNEL', {
      channel: chnlNum,
      ioLoc: payload.ioLoc
    })

    checkTankConfigErrors(context, payload.tank)
  },
  delSensor (context, payload) {
    const ndx = context.state.projectConfig.project.tanks.indexOf(payload.tank)
    const tank = context.state.projectConfig.project.tanks[ndx]
    const channel = payload.channel

    const alarmList = tank[payload.sensorType].alarms.filter((alarmNum) => {
      const alarm = context.state.projectConfig.project.alarms[alarmNum]
      if (alarm.channel === payload.channel) {
        return true
      }
    })

    //
    // delete from I/O mapping
    //
    context.commit('UNASSIGN_SLOT_FROM_CHANNEL',
      context.state.projectConfig.project.channels[channel].ioMap)

    context.commit('DEL_SENSOR_CHANNEL', {
      channel,
      ...payload
    })

    alarmList.forEach((alarm) => {
      context.commit('DEL_SENSOR_ALARM', {
        alarm,
        ...payload
      })
    })

    alarmList.forEach((alarm) => {
      context.commit('DEL_ALARM', alarm)
    })
    context.commit('DEL_CHANNEL', channel)

    checkTankConfigErrors(context, tank)
  },
  delSensorWithChannel (context, channel) {
    const tanks = context.state.projectConfig.project.tanks

    for (let tank of tanks) {
      for (let sensor of tank.level.sensors) {
        if (sensor === channel) {
          context.dispatch('delSensor', {
            tank,
            channel,
            sensorType: 'level'
          })
          checkTankConfigErrors(context, tank)
          return
        }
      }

      for (let sensor of tank.pressure.sensors) {
        if (sensor === channel) {
          context.dispatch('delSensor', {
            tank,
            channel,
            sensorType: 'pressure'
          })
          checkTankConfigErrors(context, tank)
          return
        }
      }

      for (let sensor of tank.temperature.sensors) {
        if (sensor === channel) {
          context.dispatch('delSensor', {
            tank,
            channel,
            sensorType: 'temperature'
          })
          checkTankConfigErrors(context, tank)
          return
        }
      }
    }
  }
}

export default {
  getters,
  mutations,
  actions
}
