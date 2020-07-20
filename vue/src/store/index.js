import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import machine from "./modules/machine";
import model from "./modules/model";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  actions: {},
  getters: {},
  modules: {
    user,
    machine,
    model
  },
  strict: debug
});
