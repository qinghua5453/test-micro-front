// 使用localStorage完成对缓存管理
// 通过Cache.get(key)获取key对应的缓存数据
// 通过Cache.set(key, value, time)设置缓存的key, value, 和有效时间（-1表示永久有效）
// 通过Cache.clear(key) 清空key对应的缓存
const Cache = {
  EXPIRE_KEY: "QEKJ_CACHE_EXPIRE",
  expire: null,

  get(key, defaultValue = null) {
    this.initExpire();
    // 没有设置有效期，则视同过期
    if (this.expire[key] === undefined) {
      this.clear(key);
      return defaultValue;
    }

    // 已过期
    if (this.expire[key] !== -1 && this.expire[key] < new Date().getTime()) {
      this.clear(key);
      return defaultValue;
    }

    return localStorage.getItem(key) || defaultValue;
  },

  set(key, value, expire = 60) {
    this.initExpire();
    this.expire[key] =
      expire === -1 ? expire : new Date().getTime() + expire * 1000;
    localStorage.setItem(key, value);
    this.setExpire();
  },

  clear(key) {
    this.initExpire();
    localStorage.removeItem(key);
    if (this.expire[key] !== undefined) {
      delete this.expire[key];
      this.setExpire();
    }
  },

  initExpire() {
    if (this.expire === null) {
      let expire = localStorage.getItem(this.EXPIRE_KEY);
      this.expire = expire ? JSON.parse(expire) : {};
    }
  },

  setExpire() {
    if (this.expire) {
      localStorage.setItem(this.EXPIRE_KEY, JSON.stringify(this.expire));
    }
  }
};

export default Cache;
