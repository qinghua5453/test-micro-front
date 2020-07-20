/**
 *  描述：Global filters js
 */
import { getMenu } from '@/utils/tool';
import store from '@/store';
// 待安装
const install = (Vue, options) => {
  // vue千分位 过滤器
  Vue.filter('numFormat', value => {
    return String(value).indexOf('.') !== -1 ? value.toLocaleString() : String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });
  Vue.prototype.numFormat = function(value) {
    return String(value).indexOf('.') !== -1 ? value.toLocaleString() : String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  };
};

export default install;
