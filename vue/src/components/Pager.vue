<template>
  <div>
    <el-pagination
      v-if="count > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage * 1"
      :page-sizes="pageSizeOpts"
      :page-size="currentNum * 1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count * 1"
    >
    </el-pagination>
  </div>
</template>
<script>
// 自定义分页，基于el-pagination做了一些封装，方面开发使用
export default {
  name: "component-pager",
  props: {
    // 默认pageSize
    num: Number,
    // 总条数
    total: Number,
    pageSizeOpts: {
      type: Array,
      default: () => {
        return [30, 50, 100];
      }
    },
    // 额外的参数
    query: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    handleSizeChange (num) {
      let query = Object.assign({},this.$route.query, this.query);
      query.page = this.currentPage;
      query.pageSize = num;
      this.$router.push({ path: this.$route.path, params: this.$route.params, query: query });
    },
    handleCurrentChange(page) {
      // 默认页面跳转
      let query = Object.assign({}, this.$route.query, this.query);
      query.page = page;
      query.pageSize = this.currentNum;
      this.$router.push({
        path: this.$route.path,
        params: this.$route.params,
        query: query
      });
    }
  },
  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
    currentNum () {
      return this.num || this.$route.query.pageSize || process.env.DEFAULT_PAGE_SIZE;
    },
    count() {
      return this.total || 0;
    }
  }
};
</script>
