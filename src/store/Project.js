import crypto from 'crypto'
import jsonfile from 'jsonfile'
import Program from './Program'

const dialog = require('electron').remote.dialog

const log = require('electron-log')

const defaultProjectConfig = {
  checksum: '',
  project: {
    info: {
      title: 'a new project',
      vessel: 'star ship',
      revision: 1,
      last_update: 'Feb/19/2019 11:23:31'
    },
    configurator: {
      version: Program.version
    },
    io: {
      serial: {
        port1: {
          port: 'port1',
          protocol: 'none',
          option: {
          },
          device: {
            name: '/dev/ttyS0',
            options: {
              baud: 9600,
              parity: 'even',
              stopb: '1'
            }
          },
          targets: [
          ]
        },
        port2: {
          port: 'port2',
          protocol: 'none',
          option: {
          },
          device: {
            name: '/dev/ttyS1',
            options: {
              baud: 9600,
              parity: 'even',
              stopb: '1'
            }
          },
          targets: [
          ]
        },
        port3: {
          port: 'port3',
          protocol: 'none',
          option: {
          },
          device: {
            name: '/dev/ttyS2',
            options: {
              baud: 9600,
              parity: 'even',
              stopb: '1'
            }
          },
          targets: [
          ]
        },
        port4: {
          port: 'port4',
          protocol: 'none',
          option: {
          },
          device: {
            name: '/dev/ttyS3',
            options: {
              baud: 9600,
              parity: 'even',
              stopb: '1'
            }
          },
          targets: [
          ]
        }
      },
      net: [
        {
          protocol: 'MODBUSTCPMaster',
          option: {
            port: 1050
          },
          targets: [
          ]
        },
        {
          protocol: 'MODBUSTCPSlave',
          option: {
            port: 2050
          },
          targets: [
          ]
        }
      ]
    },
    tanks: [
    ],
    channels: {
    },
    alarms: {
    }
  }
}

function calcProjectCSUM (project) {
  const json = JSON.stringify(project)
  const csum = crypto.createHash('sha256').update(json, 'utf8').digest('hex')
  return csum
}

function getCurrentDateTime () {
  var date = new Date()
  var current = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))

  return current.toISOString()
}

const getters = {
  configuratorVersion (state) {
    return Program.version
  },
  changed (state) {
    return state.changed
  }
}

const mutations = {
  SET_CHANGED (state) {
    state.changed = true
    state.projectConfig.project.info.last_update = getCurrentDateTime()
  },
  CLEAR_CHANGED (state) {
    state.changed = false
  },
  RESET_PROJECT (state) {
    state.projectConfig = JSON.parse(JSON.stringify(defaultProjectConfig))
    state.projectConfig.project.info.last_update = getCurrentDateTime()
    state.changed = false
  },
  SET_FILE_NAME (state, payload) {
    state.fileName = payload
  },
  CLEAR_FILE_NAME (state) {
    state.fileName = null
  },
  LOAD_NEW_PROJECT (state, payload) {
    state.projectConfig = Object.assign({}, payload)
  },
  SAVE_PROJECT (state, payload) {
    state.projectConfig.project.configurator.version = Program.version
    state.projectConfig.checksum = calcProjectCSUM(state.projectConfig.project)
  }
}

const actions = {
  newProject (context, payload) {
    context.commit('RESET_PROJECT')
    context.commit('CLEAR_ERRORS')
    context.commit('CLEAR_TANKS')
    context.commit('CLEAR_CHANGED')
  },
  saveProject (context, listener) {
    dialog.showSaveDialog({
      title: 'Save Current Project',
      defaultPath: context.state.fileName !== null ? context.state.fileName : undefined,
      filters: [
        { name: 'Macron CMS Project', extensions: ['json'] }
      ]
    }, (filename) => {
      if (filename === undefined) {
        return
      }

      listener.$emit(`saveStart`, `saving file`)
      log.info(`saving to ${filename}`)

      context.commit('SAVE_PROJECT')

      log.info(`checksum ${context.state.projectConfig.checksum}`)

      jsonfile.writeFile(filename, context.state.projectConfig, { spaces: 2 }, (err) => {
        if (err) {
          dialog.showErrorBox(`failed to save file`, `couldn't save ${filename}`)
          listener.$emit(`saveEnd`)
          return
        }

        context.commit('SET_FILE_NAME', filename)
        context.commit('CLEAR_CHANGED')
        setTimeout(() => listener.$emit(`saveEnd`), 500)
      })
    })
  },
  openProject (context, listener) {
    dialog.showOpenDialog({
      title: 'Open CMS Project',
      filters: [
        { name: 'Macron CMS Project', extensions: ['json'] }
      ]
    }, (filePaths) => {
      if (filePaths === undefined) {
        return
      }

      listener.$emit(`loadStart`, `loading project file`)

      jsonfile.readFile(filePaths[0], (err, json) => {
        if (err) {
          log.error(err)
          listener.$emit(`loadEnd`)
          dialog.showErrorBox(`failed to open file`, `couldn't open ${filePaths[0]}`)
          return
        }

        if (json.checksum === undefined || json.project === undefined) {
          listener.$emit(`loadEnd`)
          dialog.showErrorBox(`invalid project file`, `${filePaths[0]} is not a valid Macron CSM Project file`)
          return
        }
        //
        // verify config
        //
        const csum = calcProjectCSUM(json.project)

        if (csum !== json.checksum) {
          log.info(`csum1 : ${csum}`)
          log.info(`csum2: ${json.checksum}`)
          listener.$emit(`loadEnd`)
          dialog.showErrorBox(`invalid checksum`, `${filePaths[0]} is not a valid Macron CSM Project file`)
          return
        }

        log.info(`successfully opened file ${filePaths[0]}`)
        context.commit('LOAD_NEW_PROJECT', json)
        context.commit('CLEAR_ERRORS', json)
        context.commit('SET_FILE_NAME', filePaths[0])
        context.commit('CLEAR_CHANGED')

        setTimeout(() => listener.$emit(`loadEnd`), 500)
      })
    })
  }
}

export default {
  getters,
  actions,
  mutations
}
