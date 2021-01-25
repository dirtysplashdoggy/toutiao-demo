import Vue from 'vue'
import VueRouter from 'vue-router'
import request from '../utils/request'
import Home from '../views/Home.vue'
import Login from '../views/login'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home', component: Home, redirect:'/welcome',
    children: [
      { path:'/welcome',component:Welcome},
      { path:'/users',component:Users},
      
    ]
  },


  { path: '/login', component: Login },
  
  { path: '/', redirect: '/login' },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
