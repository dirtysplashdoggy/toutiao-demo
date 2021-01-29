import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import params from '../components/goods/params.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home', component: Home, redirect:'/welcome',
    children: [
      { path:'/welcome',component:Welcome},
      { path:'/users',component:Users},
      { path:'/rights',component:Rights},
      { path:'/roles',component:Roles},
      { path:'/categories',component:Cate},
      { path:'/params',component:params},
      
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
