import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Right from '../components/Right.vue'
import Role from '../components/Role.vue'
import Goods from '../components/Goods.vue'
import Params from '../components/Params.vue'
import Categories from '../components/Categories.vue'
import AddGoods from '../components/addGoods.vue'
import Order from '../components/Order.vue'
import Reports from '../components/Reports.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Role },
      { path: '/rights', component: Right },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/addgoods', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
