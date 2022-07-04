import Vuex from 'vuex'
import Vue from 'vue'

import { state } from "./state"
import { mutations } from "./mutations"
import { actions } from "./actions"
import { getters } from "./getters"

Vue.use(Vuex);

export default new Vuex.Store({
   state,
   getters,
   actions,
   mutations
})