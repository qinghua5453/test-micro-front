<template>
  <div>
    <el-pagination
      @size-change="handleCurrentChange"
      :page-sizes="pageSizeOpts"
      @current-change="handleCurrentChange"
      :current-page.sync="currentNo"
      :page-size.sync="currentSize"
      :total="total"
      v-if="total > 0"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>
<script>
// 自定义分页，基于el-pagination做了一些封装，方便开发使用
export default {
  name: "two-pager",
  data(){
    return {
      currentNo:this.currentPage,
      currentSize:this.pageSize,
    }
  },
  props: {
    // 总条数
    total: {
      type: Number,
      default: 0
    },
     // 总条数
    pageSize: {
      default: 30
    },

    currentPage: {
      default: 1
    },

    pageSizeOpts: {
      type: Array,
      default: () => {
        return [30, 50, 100];
      }
    },
  },
  methods: {
    handleCurrentChange(){
      var par = {
        pageNum: this.currentNo,
        pageSize: this.currentSize,
      }
      this.$emit("currentChange",par);
    }
  },
  computed: {
  }
};
</script>
