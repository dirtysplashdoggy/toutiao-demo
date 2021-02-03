import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue')
const Login = () => import('../views/login')
const Welcome = () => import('../components/welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const params = () => import('../components/goods/params.vue')
const list = () => import('../components/goods/list.vue')
const add = () => import('../components/goods/add.vue')
const report = () => import('../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: add },
      { path: '/reports', component: report },


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
