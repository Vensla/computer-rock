import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let timeout

function debounce (callback, wait = 1200) {
  clearTimeout(timeout)
  timeout = setTimeout(() => { callback() }, wait)
}

export default new Vuex.Store({
  state: {
    isLocked: false,
    screenOn: false,
    screenText: 'Ready',
    input: '',
    password: '',
    blockInput: false,
    serviceMode: false,
    sn: 4815162342
  },
  mutations: {
    inputChange (state, payload) {
      state.input += payload
    },
    inputClear (state) {
      state.input = ''
    },
    setScreen (state, payload) {
      state.screenOn = payload
    },
    setScreenText (state, payload) {
      state.screenText = payload
    },
    setLock (state, payload) {
      state.isLocked = payload
    },
    setPassword (state, payload) {
      state.password = payload
    },
    setBlockInput (state, payload) {
      state.blockInput = payload
    },
    setServiceMode (state, payload) {
      state.serviceMode = payload
    }
  },
  actions: {
    buttonPress ({ dispatch, commit, state }, payload) {
      if (!state.blockInput) {
        dispatch('activateScreen')
        if (payload === 'L' && !state.serviceMode) {
          dispatch('processInput')
        } else if (payload === '*' && !state.serviceMode) {
          // do nothing
        } else {
          commit('inputChange', payload)
        }
        // dispatch('processInput')
        debounce(() => dispatch('processInput'), 1200)
      }
    },
    processInput ({ commit, dispatch, state }) {
      dispatch('activateScreen')
      if (state.input === '000000' && state.isLocked) {
        commit('setServiceMode', true)
        commit('setScreenText', 'Service')
        commit('inputClear')
      } else if (state.serviceMode) {
        dispatch('checkServicePassword')
      } else {
        dispatch('lockUnlockSafe')
      }
    },
    activateScreen ({ commit, state }) {
      if (!state.screenOn) {
        commit('setScreen', true)
      }
      debounce(() => {
        commit('setScreen', false)
        commit('setScreenText', '')
      }, 5000)
    },
    lockUnlockSafe ({ commit, dispatch, state }) {
      // Locked
      if (state.isLocked) {
        if (state.input === state.password) {
          dispatch('unlocking')
        } else {
          commit('inputClear')
          commit('setScreenText', 'Error')
        }
      } else {
        // Unlocked
        if (state.input.length >= 6 && state.input !== '000000') {
          commit('setPassword', state.input)
          dispatch('locking')
        } else {
          commit('inputClear')
          commit('setScreenText', 'Error')
        }
      }
    },
    locking ({ commit }) {
      commit('inputClear')
      commit('setScreenText', 'Locking...')
      commit('setBlockInput', true)
      setTimeout(() => {
        commit('setLock', true)
        commit('setScreenText', 'Ready')
        commit('setBlockInput', false)
      }, 3000)
    },
    unlocking ({ commit }) {
      commit('inputClear')
      commit('setScreenText', 'Unlocking...')
      commit('setBlockInput', true)
      setTimeout(() => {
        commit('setLock', false)
        commit('setScreenText', 'Ready')
        commit('setBlockInput', false)
      }, 3000)
    },
    checkServicePassword ({ commit, dispatch, state }) {
      commit('setScreenText', 'Validating...')
      axios.get(`https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=${state.input}`)
        .then(res => {
          console.log(res)
          if (res.data.sn === state.sn) {
            dispatch('unlocking')
          } else {
            commit('inputClear')
            commit('setServiceMode', false)
            commit('setScreenText', 'Error')
          }
        })
    }
  },
  modules: {}
})
