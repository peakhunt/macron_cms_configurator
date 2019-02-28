import Vue from 'vue'

const modbusSlaveDefaultOptions = {
  address: 1
}

const modbusMasterDefaultOptions = {
  pollInterval: 200,
  pollTimeout: 2000
}

const modbusSerialPollInterval = {
  min: 10,
  max: 3000
}

const modbusSerialPollTimeout = {
  min: 100,
  max: 3000
}

const modbusSlaveAddressRange = {
  min: 1,
  max: 247
}

const ioConfigSerialErrors = {
  serialSlaveModbus: {
    key: 'SERIAL_SLAVE_MODBUS',
    value: 'Invalid MODBUS RTU Slave Address'
  },
  serialMasterPollTimeout: {
    key: 'SERIAL_MASTER_POLL_TIMEOUT',
    value: 'Invalid MODBUS RTU Master Poll Timeout'
  },
  serialMasterPollInterval: {
    key: 'SERIAL_MASTER_POLL_INTERVAL',
    value: 'Invalid MODBUS RTU Master Poll Interval'
  },
  serialMasterNoSlave: {
    key: 'SERIAL_MASTER_NO_SLAVE',
    value: 'No slave configured for MODBUS RTU Master'
  }
}

function serialConfigErrorObj (serialCfg, errConfig) {
  return {
    key: `SERIAL::${serialCfg.port}::${errConfig.key}`,
    value: `${errConfig.value} for ${serialCfg.port}`
  }
}

function clearSerialConfigErrors (context, serialCfg) {
  for (let prop in ioConfigSerialErrors) {
    context.commit('REMOVE_ERROR', serialConfigErrorObj(serialCfg,
      ioConfigSerialErrors[prop]).key)
  }
}

const confgErrorChecks = {
  'none': () => {
  },
  'MODBUS RTU Master': (context, serialCfg) => {
    if (serialCfg.option.pollInterval === '' ||
        serialCfg.option.pollInterval < modbusSerialPollInterval.min ||
        serialCfg.option.pollInterval > modbusSerialPollInterval.max) {
      context.commit('ADD_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterPollInterval))
    } else {
      context.commit('REMOVE_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterPollInterval).key)
    }

    if (serialCfg.option.pollTimeout === '' ||
        serialCfg.option.pollTimeout < modbusSerialPollTimeout.min ||
        serialCfg.option.pollTimeout > modbusSerialPollTimeout.max) {
      context.commit('ADD_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterPollTimeout))
    } else {
      context.commit('REMOVE_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterPollTimeout).key)
    }

    if (serialCfg.targets.length === 0) {
      context.commit('ADD_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterNoSlave))
    } else {
      context.commit('REMOVE_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialMasterNoSlave).key)
    }
  },
  'MODBUS RTU Slave': (context, serialCfg) => {
    if (serialCfg.option.address === '' ||
        serialCfg.option.address < modbusSlaveAddressRange.min ||
        serialCfg.option.address > modbusSlaveAddressRange.max) {
      context.commit('ADD_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialSlaveModbus))
    } else {
      context.commit('REMOVE_ERROR', serialConfigErrorObj(serialCfg,
        ioConfigSerialErrors.serialSlaveModbus).key)
    }
  }
}

const zbBoards = {
  'ZB-ANA': {
    slot: {
      commStatus: {
        desc: 'communication status',
        channel: -1,
        alarm: -1
      },
      port1: {
        desc: '4-20ma input',
        channel: -1
      },
      port2: {
        desc: '4-20ma input',
        channel: -1
      },
      port3: {
        desc: '4-20ma input',
        channel: -1
      },
      port4: {
        desc: '4-20ma input',
        channel: -1
      },
      port5: {
        desc: '4-20ma input',
        channel: -1
      },
      port6: {
        desc: '4-20ma input',
        channel: -1
      },
      port7: {
        desc: '4-20ma input',
        channel: -1
      },
      port8: {
        desc: '4-20ma input',
        channel: -1
      }
    }
  },
  'ZB-HART': {
    slot: {
      commStatus: {
        desc: 'communication status',
        channel: -1,
        alarm: -1
      },
      port1: {
        desc: 'hart comm channel',
        channel: -1
      },
      port2: {
        desc: 'hart comm channel',
        channel: -1
      },
      port3: {
        desc: 'hart comm channel',
        channel: -1
      },
      port4: {
        desc: 'hart comm channel',
        channel: -1
      },
      port5: {
        desc: 'hart comm channel',
        channel: -1
      },
      port6: {
        desc: 'hart comm channel',
        channel: -1
      },
      port7: {
        desc: 'hart comm channel',
        channel: -1
      },
      port8: {
        desc: 'hart comm channel',
        channel: -1
      }
    }
  }
}

const state = {
  serialProtocols: [
    'none',
    'MODBUS RTU Master',
    'MODBUS RTU Slave'
  ],
  serialBaudRates: [
    9600,
    14400,
    19200,
    38400,
    58600,
    115200
  ],
  serialParities: [
    'none',
    'even',
    'odd'
  ],
  serialStopBits: [
    '1',
    '1.5'
  ],
  serialBoards: [
    'ZB-ANA',
    'ZB-HART'
  ]
}

const getters = {
  serialBoards (state) {
    return state.serialBoards
  },
  serialProtocols (state) {
    return state.serialProtocols
  },
  serialBaudRates (state) {
    return state.serialBaudRates
  },
  serialParities (state) {
    return state.serialParities
  },
  serialPollIntervalRange (state) {
    return modbusSerialPollInterval
  },
  serialPollTimeoutRange (state) {
    return modbusSerialPollTimeout
  },
  modbusAddressRange (state) {
    return modbusSlaveAddressRange
  },
  serialStopBits (state) {
    return state.serialStopBits
  },
  serialIO (state) {
    return state.projectConfig.project.io.serial
  },
  netIO (state) {
    return state.projectConfig.project.io.net
  },
  io (state) {
    return state.projectConfig.project.io
  },
  ioRoots (state) {
    return Object.keys(state.projectConfig.project.io)
  },
  ioUtil (state) {
    return state.ioUtil
  },
  ioLOCStr: (state) => (ioLoc) => {
    if (ioLoc === undefined || ioLoc == null) {
      return ''
    }

    const root = state.projectConfig.project.io[ioLoc.root]
    const subRoot = root[ioLoc.subRoot]

    // slot
    for (let ndx = 0; subRoot.targets.length; ndx += 1) {
      let target = subRoot.targets[ndx]
      if (target.address === ioLoc.target) {
        return `${ioLoc.root}:${subRoot.port}:${target.type}:${target.address}:${ioLoc.slot}`
      }
    }
    return `Error`
  }
}

const mutations = {
  CHANGE_SERIAL_PROTOCOL (state, payload) {
    const serialCfg = payload.serialCfg
    let opt = {}

    serialCfg.protocol = payload.protocol

    switch (serialCfg.protocol) {
      case 'MODBUS RTU Master':
        opt = JSON.parse(JSON.stringify(modbusMasterDefaultOptions))
        break
      case 'MODBUS RTU Slave':
        opt = JSON.parse(JSON.stringify(modbusSlaveDefaultOptions))
        break
    }
    serialCfg.option = opt
    serialCfg.targets = []

    Vue.set(state.projectConfig.project.io.serial, serialCfg.port, serialCfg)
  },
  UPDATE_SERIAL_DEVICE_OPTION (state, payload) {
    payload.serialCfg.device.options[payload.key] = payload.value
  },
  UPDATE_SERIAL_PROTOCOL_OPTION (state, payload) {
    payload.serialCfg.option[payload.key] = payload.value
  },
  UPDATE_SERIAL_SLAVE (state, payload) {
    payload.slave[payload.key] = payload.value
  },
  ADD_SERIAL_SLAVE (state, payload) {
    const target = payload.slave
    const key = payload.serialCfg.port

    state.projectConfig.project.io.serial[key].targets.push(target)
  },
  DEL_SERIAL_SLAVE (state, payload) {
    const key = payload.serialCfg.port
    const sndx = state.projectConfig.project.io.serial[key].targets.indexOf(payload.slave)

    state.projectConfig.project.io.serial[key].targets.splice(sndx, 1)
  },
  ASSIGN_SLOT_TO_CHANNEL (state, payload) {
    const root = state.projectConfig.project.io[payload.ioLoc.root]
    const subRoot = root[payload.ioLoc.subRoot]

    for (let ndx = 0; subRoot.targets.length; ndx += 1) {
      let target = subRoot.targets[ndx]

      if (target.address === payload.ioLoc.target) {
        target.slot[payload.ioLoc.slot].channel = payload.channel
        break
      }
    }
  },
  UNASSIGN_SLOT_FROM_CHANNEL (state, ioLoc) {
    const root = state.projectConfig.project.io[ioLoc.root]
    const subRoot = root[ioLoc.subRoot]

    for (let ndx = 0; subRoot.targets.length; ndx += 1) {
      let target = subRoot.targets[ndx]

      if (target.address === ioLoc.target) {
        target.slot[ioLoc.slot].channel = -1
        break
      }
    }
  }
}

function delModbusSerialSlave (context, serialCfg, slave) {
  context.dispatch('unmapSlotsForSlave', slave)
  /*
  context.commit('DEL_ALARM', slave.slot.commStatus.alarm)
  context.commit('DEL_CHANNEL', slave.slot.commStatus.channel)
  */

  context.commit('DEL_SERIAL_SLAVE', {
    serialCfg,
    slave
  })
  confgErrorChecks[serialCfg.protocol](context, serialCfg)
}

const actions = {
  changeSerialProtocol (context, payload) {
    const serialCfg = payload.serialCfg

    // clear all slaves if exist
    const targets = serialCfg.targets.slice()
    targets.forEach((slave) => {
      delModbusSerialSlave(context, serialCfg, slave)
    })

    clearSerialConfigErrors(context, serialCfg)
    switch (payload.protocol) {
      case 'MODBUS RTU Master':
        context.commit('ADD_ERROR', serialConfigErrorObj(serialCfg,
          ioConfigSerialErrors.serialMasterNoSlave))
        break
    }
    context.commit('CHANGE_SERIAL_PROTOCOL', {
      serialCfg,
      protocol: payload.protocol
    })
  },
  addModbusSerialSlave (context, payload) {
    const target = payload.slave
    const serialCfg = payload.serialCfg
    let slave = {
      ...target,
      ...JSON.parse(JSON.stringify(zbBoards[target.type]))
    }

    // add communication status channel
    slave.slot.commStatus.channel = context.getters.nextFreeSensorChannel

    const chnl = context.getters.channelFactory.emptyChannel()
    chnl.name = `serial ${serialCfg.port} slave ${slave.type}:${slave.address} communication status`
    chnl.dir = 'in'
    chnl.type = 'digital'
    chnl.ioMap = {
      root: 'serial',
      subRoot: serialCfg.port,
      target: slave.address,
      slot: 'commStatus'
    }
    context.commit('ADD_CHANNEL', {
      number: slave.slot.commStatus.channel,
      chnl
    })

    slave.slot.commStatus.alarm = context.getters.nextFreeAlarmNum
    const alarm = context.getters.alarmFactory.emptyAlarm()
    alarm.name = `serial ${serialCfg.port} slave ${slave.type}:${slave.address} communication error`
    alarm.type = 'digital'
    alarm.severity = 'major'
    alarm.channel = slave.slot.commStatus.channel
    alarm.set = true
    alarm.delay = 0

    context.commit('ADD_ALARM', {
      number: slave.slot.commStatus.alarm,
      alarm
    })

    // add communication status alarm
    context.commit('ADD_SERIAL_SLAVE', {
      serialCfg,
      slave
    })
    confgErrorChecks[payload.serialCfg.protocol](context, payload.serialCfg)
  },
  delModbusSerialSlave (context, payload) {
    delModbusSerialSlave(context, payload.serialCfg, payload.slave)
  },
  unmapSlotsForSlave (context, target) {
    for (let key in target.slot) {
      const slot = target.slot[key]

      if (key === 'commStatus') {
        context.commit('DEL_ALARM', slot.alarm)
        context.commit('DEL_CHANNEL', slot.channel)
      } else if (slot.channel !== -1) {
        context.dispatch('delSensorWithChannel', slot.channel)
      }
    }
  },
  unmapAll (context, serialCfg) {
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
