const getters = {
  projectTitle (state) {
    return state.projectConfig.project.info.title
  },
  projectVessel (state) {
    return state.projectConfig.project.info.vessel
  },
  projectRevision (state) {
    return state.projectConfig.project.info.revision
  },
  projectLastUpdate (state) {
    return state.projectConfig.project.info.last_update
  }
}

const mutations = {
  UPDATE_PROJECT_TITLE (state, payload) {
    state.projectConfig.project.info.title = payload
  },
  UPDATE_PROJECT_VESSEL (state, payload) {
    state.projectConfig.project.info.vessel = payload
  },
  INC_PROJECT_REVISION (state) {
    state.projectConfig.project.info.revision += 1
  }
}

const actions = {
  change_PROJECT_TITLE (context, payload) {
    const key = 'PROJECT::INFO::TITLE'

    context.commit('UPDATE_PROJECT_TITLE', payload)
    if (payload === '') {
      context.commit('ADD_ERROR', { key, value: 'Project title must not be empty!' })
    } else {
      context.commit('REMOVE_ERROR', key)
    }
  },
  change_PROJECT_VESSEL (context, payload) {
    const key = 'PROJECT::INFO::VESSEL'

    context.commit('UPDATE_PROJECT_VESSEL', payload)
    if (payload === '') {
      context.commit('ADD_ERROR', { key, value: 'Project vessel must not be empty!' })
    } else {
      context.commit('REMOVE_ERROR', key)
    }
  },
  incRevision (context) {
    context.commit(`INC_PROJECT_REVISION`)
  }
}

export default {
  getters,
  mutations,
  actions
}
