import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import project from './modules/project'
import order from './modules/order'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    project,
    order
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
