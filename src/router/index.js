import Vue from 'vue'
import VueRouter from 'vue-router'
import Switchboard from '../views/Switchboard.vue'
import Status from '../views/Status.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Switchboard',
    component: Switchboard

  },
  {
    path: '/status',
    name: 'Status',
    component: Status
  }
]

const router = new VueRouter({
  routes
})

export default router
