const state = {
  error: {
    numError: 0,
    errors: [
    ],
    errorsHash: {
    }
  }
}

const getters = {
  configError (state) {
    return state.error.numError !== 0
  },
  configErrorCount (state) {
    return state.error.numError
  },
  configErrorData (state) {
    return state.error.errors
  }
}

const mutations = {
  CLEAR_ERRORS (state) {
    state.error.numError = 0
    state.error.errors = []
    state.error.errorsHash = {}
  },
  ADD_ERROR (state, payload) {
    if (state.error.errorsHash[payload.key] === undefined) {
      state.error.errors.push({ key: payload.key, value: payload.value })
      state.error.numError += 1
      state.error.errorsHash[payload.key] = payload
    }
  },
  REMOVE_ERROR (state, payload) {
    if (state.error.errorsHash[payload] !== undefined) {
      for (let ndx = 0; ndx < state.error.errors.length; ndx += 1) {
        if (state.error.errors[ndx].key === payload) {
          state.error.errors.splice(ndx, 1)
          state.error.numError -= 1
          break
        }
      }
      delete state.error.errorsHash[payload]
    }
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
