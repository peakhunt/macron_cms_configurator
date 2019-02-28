import Vue from 'vue'
import Router from 'vue-router'
import ProjectView from '@/views/ProjectView.vue'
import Tanks from '@/views/Tanks.vue'
import Errors from '@/views/Errors.vue'
import IO2 from '@/views/IO2.vue'
import ChannelList from '@/views/ChannelList.vue'
import AlarmList from '@/views/AlarmList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/project-info',
      name: 'Project Info',
      component: ProjectView
    },
    {
      path: '/tanks',
      name: 'Tanks Configuration',
      component: Tanks
    },
    {
      path: '/io',
      name: 'IO Configuration',
      component: IO2
    },
    {
      path: '/errors',
      name: 'Errors',
      component: Errors
    },
    {
      path: '/channel-list',
      name: 'Channel List',
      component: ChannelList
    },
    {
      path: '/alarm-list',
      name: 'Alarm List',
      component: AlarmList
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '*',
      redirect: '/project-info'
    }
  ]
})
