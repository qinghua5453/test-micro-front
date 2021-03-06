// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './public-path';
import Vue from 'vue';
import routes from './router';
import VueRouter from 'vue-router';
import store from './store';
import AMap from 'vue-amap';

// 字体图标
import './assets/iconfont/iconfont.js';
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

// http
import Http from './plugins/Http';
import User from './utils/User';
import App from './App';
import filter from '@/utils/filter';
import lodash from 'lodash';
Vue.config.productionTip = false;
Vue.prototype._ = lodash;
Vue.prototype.STATIC_IMAGE = process.env.VUE_APP_STATICURL;
Vue.use(filter);
Vue.use(ElementUI);
Vue.use(Http);
Vue.use(VueRouter)


// todo 分离出js文件
AMap.initAMapApiLoader({
  key: '613b0f15bea16ba4bb84c1c9cde9ae88',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation', 'AMap.Geocoder']
});
Vue.use(AMap);

// 页面跳转统一做未登录拦截
// todo 分离js文件
function routerLanjie () {
  router.beforeEach((to, from, next) => {
  // 登录页面不需要拦截
  if (to.path === '/login' || to.path === '/password') {
    next();
    return;
  }

  // 未登录，跳转到登录页
  if (!User.getToken()) {
    next('/login?return=' + to.fullPath);
    return;
  }

  // 初始化用户信息
  User.init().then(_ => {
    // 拿到用户二级菜单
    let secondMenu = [];
    let ishome = false;
    store.state.user.menu.map(item => {
      if (item.name === '首页') ishome = true;
      if (item.nodes && item.nodes.length > 0) secondMenu = [...secondMenu, ...item.nodes];
    });
    // 该用户没有权限
    let flag = false;
    secondMenu.find(item => {
      let path = to.path.replace('/', '');
      // 判断to.path 是否在权限数组中
      if (item.url === path || to.matched.length === 3 || ishome || to.path === '/changepwd') {
        flag = true;
      }
    });
    //如果没有该权限，就跳转至首页
    if (!flag) {
      let path = secondMenu.length > 0 ? `/${secondMenu[0].url}` : '';
      next(path);
    } else {
      next();
    }
  });
});
}

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: {
//     App
//   },
//   template: '<App/>'
// });

let instance = null;
let router = null

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
    mode: 'history',
    routes,
  });
  routerLanjie();

  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) => {
        console.log(`[vue-----子应用-------onGlobalStateChange - ${props.name}]:`, value, prev)
        Vue.prototype.GLOBAL = value
      },
      true,
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
      test: 'vue'
    });
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
  console.log('[vue] props from main framework', props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  console.log('-----unmount----vue-----', router)
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}