import axios from 'axios';

/**
 * 导出excel
 *
 */

export const exportExcel = (url, fileName, opt) => {
  axios
    .post(url, opt, {
      responseType: 'blob',
      // responseType: 'arraybuffer',
      timeout: 60000
    })
    .then(res => {
      let disposition = res.headers['content-disposition']
        ? String(res.headers['content-disposition'])
        : '';
      let name = null;
      if (disposition) {
        let header = disposition.indexOf('=');
        name =
          header !== -1
            ? decodeURIComponent(disposition.substring(header).replace('=', ''))
            : fileName;
      } else {
        name = fileName;
      }
      let blob = (blob = new Blob([res.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, name);
      } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    });
};

/**
 
 * 
 * * @param  {[type]} fmt [description]
 * @return {[type]}     [description]
 */
export const DateFormat = (str, fmt) => {
  let o = {
    'M+': str.getMonth() + 1,
    'd+': str.getDate(),
    'h+': str.getHours(),
    'm+': str.getMinutes(),
    's+': str.getSeconds(),
    'q+': Math.floor((str.getMonth() + 3) / 3),
    S: str.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (str.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};

export const calMax = arr => {
  var max = arr[0];
  for (var i = 1; i < arr.length; i++) {
    // 求出一组数组中的最大值
    if (max < arr[i]) {
      max = arr[i];
    }
  }
  var maxint = Math.ceil(max / 10); // 向上取整
  var maxval = maxint * 10; // 最终设置的最大值
  return maxval; // 输出最大值
};

export const calMin = arr => {
  var min = arr[0];
  for (var i = 1; i < arr.length; i++) {
    // 求出一组数组中的最大值
    if (min > arr[i]) {
      min = arr[i];
    }
  }
  var minint = Math.floor(min / 10); // 向下取整
  var minval = minint * 10; // 最终设置的最小值
  return minval; // 输出最小值
};

export const ortId = (a, b) => {
  //数据倒序排序
  let k = a.date.replace(/\-/g, '');
  let h = b.date.replace(/\-/g, '');
  return k - h;
};

export const dateId = (a, b) => {
  //数据倒序排序
  let k = a.statsDate.replace(/\-/g, '');
  let h = b.statsDate.replace(/\-/g, '');
  return k - h;
};

export const mixinObj = (a, b) => {
  //数据倒序排序
  if (!b) {
    return a;
  } else {
    for (const key in a) {
      if (a.hasOwnProperty(key)) {
        const element = b[key];
        if (element) {
          a[key] = element;
        }
      }
    }
    return a;
  }
};

/**
 * 截流函数
 */
export const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
