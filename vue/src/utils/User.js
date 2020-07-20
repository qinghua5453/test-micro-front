import Cache from "./Cache";
import store from "@/store";

const User = {
  setToken(v) {
    return Cache.set("token", v, 60 * 60 * 23);
  },
  getToken() {
    return Cache.get("token");
  },
  setData(user) {
    return Cache.set("user", JSON.stringify(user), 60 * 60 * 23);
  },
  getData(key = null) {
    let user = Cache.get("user");
    if (!user) {
      return null;
    }
    user = JSON.parse(user);
    return key ? user[key] : user;
  },
  // 初始化用户数据，在每次路由跳转后执行
  init() {
    // 未登录，不处理
    if (!this.getToken() || !this.getData()) {
      store.commit("user/logout");
      return Promise.resolve();
    }

    // 已初始化数据，不处理
    if (store.state.user.menu) {
      return Promise.resolve();
    }

    // 未初始化数据
    return store.dispatch("user/init", this.getToken());
    // return Promise.resolve()
  },
  logout() {
    Cache.clear("token");
    Cache.clear("user");
    store.commit("user/logout");
  }
};

export default User;
