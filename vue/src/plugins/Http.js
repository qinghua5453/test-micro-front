/**
 * Created by gaoqing on 17/12/25.
 * http配置
 */

import axios from 'axios';
import Qs from 'qs';
import { MessageBox, Loading } from 'element-ui';
import router from '@/router';
import User from '@/utils/User';
import DataUtils from '@/utils/Data';

// 遮罩
var loading = null;

// axios 配置
axios.defaults.timeout = 3000000;
axios.defaults.baseURL = process.env.VUE_APP_URL;
// axios.defaults.baseURL = 'http://192.168.5.10:8090/ims'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });

// http request 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = User.getToken();
  // if (User.getData()) {
  //     config.headers.uid = User.getData().userId;
  //   }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    // 过滤为null的参数
    config.data = config.paramsSerializer(DataUtils.filter(config.data));
  }

  // 请求之前加遮罩
  loading = Loading.service({ fullscreen: true });
  return config;
}, err => {
  return Promise.reject(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
  // 关闭遮罩
  loading && loading.close();
  if (response.headers['content-type'] && response.headers['content-type'].includes("stream") || response.request.responseURL.includes("qrCode/add")) {
    return response;
  }

  if (response.data.code === 0) {
    return response.data.data;
  }


  // todo 统一token失效处理

  // 统一报错提示
  MessageBox.alert(response.data.msg, '错误').then(_ => {
    // todo 统一token失效处理
    if (response.data.code === 2) {
      User.logout();
      router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } });
    }
  });
  return Promise.reject(response.data);
}, error => {
  // 关闭遮罩
  loading && loading.close();
  if (error.message.includes('timeout')) {
    MessageBox.alert('请求超时，请重新操作', '提示', { type: 'warning' });
  } else {
    MessageBox.alert("服务器开小差咯", '错误', { type: 'error' });
  }
  // todo 部分错误代码统一处理
  return Promise.reject(error.response);
});

axios.postFile = (path, params, file, headers = []) => {
  let formData = new FormData();
  formData.append('file', file);
  for (let i in params) {
    formData.append(i, params[i]);
  }
  return axios.post(path, formData);
};

const Http = {
  install (Vue) {
    Vue.axios = axios;
    Vue.prototype.$axios = axios;
  }
};
export {
  axios
};
export default Http;
