<template>
  <el-dialog
    title="操作记录"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="1000px"
  >
    <el-table
      :data="list"
      border
      tooltip-effect="dark"
      center="true"
      class="my-table"
      height="500"
    >
      <el-table-column
        label="序号"
        width="60"
        type="index"
        :index="indexMethod"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="type" label="操作类型" show-overflow-tooltip :formatter="formatType"></el-table-column>
      <el-table-column prop="data" label="生成数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUserName" label="操作人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
        v-show="pageShow"
        @size-change="pageSizeChange"
        @current-change="currentChange"
        :current-page="searchData.page"
        :page-sizes="pageSizeOpts"
        :page-size="searchData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import Api from "@/utils/Api";
import modlePageMixin from "@/mixins/modlePageMixin";
import { operationListFun } from '../detergent';

export default {
  mixins: [modlePageMixin],
  data() {
    return {};
  },
  props: ["visible", "brandId"],
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    formatType(row,column){
      let map = {
        1:'生成激活码',
        2:'编辑',
        3:'删除'
      }
      return map[row.type]
    },
    _getList() {
        operationListFun({brandId:this.brandId}).then(resp => {
          this.total = resp.total;
          this.list = resp.items || [];
        });
    }
  }
};
</script>

<style lang="less">
</style>
