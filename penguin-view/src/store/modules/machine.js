import Vue from "vue";
import Api from "@/utils/Api";
import Data from "@/utils/Data";

/**
 * 设备相关
 */
const state = {
  // 大类
  firstType: [],

  // 设备型号
  subType: [],

  // 设备型号详细信息（二级类）
  subTypeDetail: null,

  // 大类绑定的基本功能
  firstTypeFunction: []
};

const getters = {
  // 通过firstTypeFunctionId获取name
  getFirstTypeFunctionNameById: state => id => {
    let data = state.firstTypeFunction.find(item => item.id === id);
    return data ? data.functionName : null;
  }
};

const actions = {
  // 通过pid获取设备类型列表，0表示一级类型，>0表示二级类型
  getTypeList({ commit }, pid) {
    return Vue.axios
      .post(Api.MACHINE_GETTYPELIST, { parentId: pid })
      .then(data => {
        commit(pid > 0 ? "setSubTypeList" : "setFirstTypeList", data);
        return data;
      });
  },

  // 通过id获取设备型号详细数据（二级类型）
  getSubTypeDetail({ commit }, id) {
    if (id === null) {
      commit("setSubTypeDetail", null);
      return;
    }
    return Vue.axios
      .post(Api.MACHINETYPE_SECONDSDETAILS, { id: id })
      .then(data => {
        commit("setSubTypeDetail", data);
        return data;
      });
  },

  // 获取大类绑定的基本功能
  getFirstTypeFunctionList({ commit }, firstTypeId) {
    if (firstTypeId === null) {
      commit("setFirstTypeFunction", []);
      return;
    }
    return Vue.axios
      .post(Api.FUNCTION_LIST, { machineTypeId: firstTypeId, pageSize: 99 })
      .then(data => {
        commit("setFirstTypeFunction", data.items);
        return data;
      });
  }
};
const mutations = {
  setFirstTypeList(state, data) {
    state.firstType = data;
  },
  setSubTypeList(state, data) {
    state.subType = data;
  },
  setSubTypeDetail(state, data) {
    state.subTypeDetail = data;
  },
  setFirstTypeFunction(state, data) {
    state.firstTypeFunction = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
