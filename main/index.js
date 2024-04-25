/*
 * @Author: your name
 * @Date: 2020-06-21 16:19:51
 * @LastEditTime: 2020-07-17 16:41:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /penguin-view/main/index.js
 */ 
阿斯顿发生
阿斯顿发
阿斯顿发送到


import { registerMicroApps, start, setDefaultMountApp, runAfterFirstMounted, initGlobalState } from 'qiankun';
import render from './render/VueRender'


function genActiveRule(routerPrefix) {
  console.log('routerPrefix3', routerPrefix)
  return location => location.pathname.startsWith(routerPrefix);
}


/**
 * Step1 初始化应用（可选）
 */
render({ appContent: '', loading: true });

/**
 * Step2 注册子应用
 */
registerMicroApps(
  [
    // {
    //   name: 'react16',
    //   entry: '//localhost:7100',
    //   render,
    //   activeRule: genActiveRule('/react16'),
    // },
    {
      name: 'react15',
      entry: '//localhost:7102',
      render,
      activeRule: genActiveRule('/react15'),
    },
    {
      name: 'sub',
      entry: '//localhost:7104',
      render,
      activeRule: genActiveRule('/sub'),  
    },
     {
      name: 'vue',
      entry: '//localhost:7101',
      render,
      activeRule: genActiveRule('/vue'),  
      props: {
        token: 'asfdaad-token'
      }
    },
    // {
    //   name: 'angular9',
    //   entry: '//localhost:7103',
    //   render,
    //   activeRule: genActiveRule('/angular9'),
    // },
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
  },
);

/**
 * Step3 设置默认进入的子应用
 */
setDefaultMountApp('/sub');


const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: 'qiankun',
});

onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

setGlobalState({
  ignore: 'master',
  user: {
    name: 'master',
  }
});

/* 阿斯顿发生
@param await
奥术大师 */

/**
 * Step4 启动应用
 */


start({
  prefetch: true,
  jsSandbox: true,
  singular: false,
  fetch: window.fetch,
});

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});


start();