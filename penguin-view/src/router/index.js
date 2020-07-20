import Vue from 'vue';
import Router from 'vue-router';

import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Home from  '@/pages/Home'
import Shop from '@/pages/shop/ShopList'
import Device from '@/pages/device/DeviceList'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
     { path: '/login', name: 'login', component: Login },
     // 页面
     {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        // 主页面
        { path: 'home', component: Home },
        { path: 'shop', component: Shop },
        { path: 'device', component: Device },
      ]
     }
  ]
 })