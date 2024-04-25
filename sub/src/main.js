// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './public-path';
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import routes from './router';
import 'mint-ui/lib/style.css';
import { Picker } from 'mint-ui';


Vue.use(VueRouter)
Vue.component('Picker', Picker)

let instance = null;
let router = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/sub' : '/',
    mode: 'history',
    routes,
  });

  instance = new Vue({
    router,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
  // __qiankun_microapp_wrapper_for_react_15_1594626862743__
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

function storeTest(props) {
  console.log('-------props-sub---------', props)
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) => {
        console.log(`[sub-----子应用-------onGlobalStateChange - ${props.name}]:`, value, prev)
        Vue.prototype.GLOBAL = value
      },
      true,
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      }
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
  console.log('-----unmount----vue-----')
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  // router = null;
}