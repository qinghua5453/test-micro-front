import _ from 'lodash';
/**
 * 数据处理工具
 * @author gaoqing 18/6/4
 */

// 通过parent转成tree，二级分类很有用
const tree = (data, idName = 'id', parentName = 'parentId') => {
  const getTree = (data, parentId) => {
    var arr = [];
    for (let node of data) {
      if (node[parentName] == parentId) {
        let newNode = clone(node);
        let nodes = getTree(data, node[idName]);
        if (nodes.length > 0) {
          newNode.nodes = nodes;
        }
        arr.push(newNode);
      }
    }
    return arr;
  };
  return getTree(data, 0);
};

// 深copy
const clone = data => _.cloneDeep(data);

// 过滤空的key，再http请求之前把不需要的空key过滤掉
const filter = data => {
  if (!data) return data;
  let o = {};
  for (let i in data) {
    if (data[i] === null || data[i] === undefined || data[i] === '') continue;
    o[i] = data[i];
  }
  return o;
};

// 把数组对象转成单个,号分割，如[{id: 1, name: 'a'}, {id: 2, name: 'b'}] => a,b
const arrToString = (data, key, spilt = ',') => {
  let arr = [];
  if (data.length > 0) {
    arr = data.map(item => item[key]);
  }
  return arr.join(spilt);
};

// 获取每个节点的直属子节点，*记住是直属，不是所有子节点
export const getTrees = (list, parentId) => {
  let items = {};
  // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
    let key = list[i].parentId;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, parentId);
};

/**
 * 利用递归格式化每个节点
 */
export const formatTree = (items, parentId) => {
  let result = [];
  if (!items[parentId]) {
    return result;
  }
  for (let t of items[parentId]) {
    t.children = formatTree(items, t.menuId);
    result.push(t);
  }
  return result;
};

/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
export const formatSecond = result => {
  const h = Math.floor((result / 3600) % 24);
  const m = Math.floor((result / 60) % 60);
  const s = Math.floor(result % 60);
  if (h < 1) {
    return (result = m + '分钟');
  } else {
    return (result = h + '小时' + m + '分钟');
  }
};

/**
 * 对象转换
 */
export const convertObject = (sourceObj, newObj) => {
  for (let i in sourceObj) {
    if (newObj[i] !== undefined) {
      sourceObj[i] = newObj[i];
    }
  }
  return sourceObj;
}

export default {
  tree,
  clone,
  filter,
  arrToString,
  getTrees,
  formatTree,
  formatSecond,
  convertObject
};
