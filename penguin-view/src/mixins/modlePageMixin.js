/**
 *  描述：混合类
 */
export default {
  data() {
    return {
      list: [], // 列表展示
      searchData: {
        // 搜索条件
        page: 1,
        pageSize: 30 // 分页大小
      },
      pageSizeOpts: [30, 50, 100],
      multipleSelection: [], // 多选
      total: 0, // 总数量
      isSearchClick: false, // 是否点击搜索按钮(避免点击分页部分也改变了搜索条件)
      cacheSearchData: {} // 缓存的上一步搜索条件
    };
  },
  computed: {
    // 分页是否展示
    pageShow() {
      return !!this.list.length;
    }
  },
  created() {},
  mounted() {},
  methods: {
    currentChange(val) {
      this.searchData.page = val;
      this._getList();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageSize = pageSize;
      this._getList();
    },
    search() {
      this.isSearchClick = true;
      this.searchData.page = 1;
      this._getList();
    }
  },
  watch: {}
};
