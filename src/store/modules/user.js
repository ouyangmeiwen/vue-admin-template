import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    tenant: ''
  }
}

const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    console.log('Resetting state')
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    console.log('Setting token:', token)
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TENANT: (state, tenant) => {
    state.tenant = tenant
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, tenantname } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, tenantname: tenantname }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        console.log('Token after login:', state.token) // 检查 token 是否被正确设置
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, tenant } = data
        commit('SET_NAME', name)
        console.log('name:' + name)
        commit('SET_AVATAR', avatar)
        console.log('avatar:' + avatar)
        commit('SET_TENANT', tenant)
        console.log('tenant:' + tenant)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('Token before logout:', state.token) // 检查 token 是否存在
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

