import QPager from "@/components/Pager";
import DataUtils from "@/utils/Data";

/** 分页混合器，分页助手
 * 使用注意要点
 *  1. 需要保留全局apiUrl，apiParams未被使用
 *  2. 需要保留全局list，total未被使用
 *  3. 只负责分页的实现，其他url参数请自行实现
 *
 * 混合器功能
 * 1. 初始化分页参数page和num
 * 2. watch $route.query，重新调用接口请求方法获取数据
 * 3. 载入分页组件YPager
 */

const PagerMixin = {
  data () {
    return {
      // 分页调用的api接口
      apiUrl: null,
      // 分页调用的api参数
      apiParams: null,
      // 分页获取的数据
      list: [],
      // 分页获取的数据总条数（分页组件需要）
      total: 0
    };
  },
  methods: {
    // 设置分页查询条件，主要用于url的params和查询条件的字段不同时，需要重写这个方法
    setApiParams (query) {
      query = query || this.$route.query;
      this.apiParams = DataUtils.clone(query);
      this.apiParams.page = query.page || 1;
      this.apiParams.pageNum = query.page || 1;
      this.apiParams.pageSize = query.pageSize || process.env.VUE_APP_PAGE_SIZE;
    },
    pagerIndex (index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    }
  },
  watch: {
    "$route.query": function (query, oldQuery) {
      if (!this.apiParams || !this.apiUrl) {
        console.log("[Error]分页数据未被初始化...");
        return;
      }
      this.list = [];
      this.total = 0;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(data => {
        this.list = data.items || data.page.items;
        this.total = data.total || data.page.total;
      });
    }
  },
  components: {
    QPager
  }
};

export default PagerMixin;
