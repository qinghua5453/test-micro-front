/*
 * @Author: your name
 * @Date: 2020-07-20 10:44:32
 * @LastEditTime: 2020-07-20 10:54:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /test-micro-front/vue/src/store/modules/user.js
 */ 
import Vue from "vue";
import Api from "@/utils/Api";
import Data from "@/utils/Data";

const state = {
  menu: null,
  userPerm: [] // 存贮用户所有权限
};
const getters = {
  // 通过getPerm 过滤用户权限
  getPerm: state => str => {
    // console.log('state++++++++++++++++', state)
    let isPerm = false;
    let permArray = state.userPerm; // 后台返回[1,2,3,4,5]
    permArray.find(item => {
      if (item === str) {
        isPerm = true;
        return false;
      }
    });
    return isPerm;
  }
};
const actions = {
  // 初始化用户菜单和权限
  init({ commit }, token) {
    if (!token) return Promise.reject("token不存在");

    return Vue.axios.get(Api.GET_AUTH_MENU).then(data => {
      if (data) {
        var arr = []; // 拿到用户的所有权限
        for (let node of data) {
          let shuz = node.perms.split(",");
          arr = arr.concat(shuz);
        }
        commit("setUserPerm", arr);
        commit("setMenu", Data.tree(data, "menuId"));
      }
    });
  }
};
const mutations = {
  setMenu(state, data) {
    state.menu = data;
  },
  setUserPerm(state, data) {
    state.userPerm = data;
  },
  logout() {
    state.menu = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
