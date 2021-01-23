import Vue from 'vue'
import VueRouter from 'vue-router'
import request from '../utils/request'
import Home from '../views/Home.vue'
import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  { path:'/'      , redirect:'/login' },
  { path: '/home' , component: Home},
  { path: '/login', component: Login},

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  const tokenStr =window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
