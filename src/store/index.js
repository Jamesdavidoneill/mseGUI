import Vue from 'vue'
import Vuex from 'vuex'
import data from './modules/data'

//load vuex
Vue.use(Vuex)

//create store
export default new Vuex.Store({
	modules: {
		data
	}
})