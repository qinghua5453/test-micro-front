import Vue from "vue";
import Api from "@/utils/Api";

/**
 * 功能型号相关
 */
const state = {
  // 大类
  categoryList: [],

  // 设备型号
  modelList: []
};

const getters = {
  // 通过firstTypeFunctionId获取name
  getCategoryNameById: state => id => {
    let data = state.categoryList.find(item => item.id === id);
    return data ? data.categoryName : null;
  }
};

const actions = {
  // 获取分类列表
  getCategoryList({ commit }) {
    return Vue.axios
      .post(Api.CLOUD_CATEGORY)
      .then(data => {
        commit('setCategoryList', data);
        return data;
      });
  },

  // 获取型号列表
  getModelList({ commit }) {
    return Vue.axios
      .post(Api.CLOUD_SUB_CATEGORY)
      .then(data => {
        commit('setModelList', data);
        return data;
      });
  },
};
const mutations = {
  setCategoryList(state, data) {
    state.categoryList = data;
  },
  setModelList(state, data) {
    state.modelList = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
