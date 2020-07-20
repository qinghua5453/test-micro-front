<template>
  <el-dialog title="日志--资产编号" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1000px">
    <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="500">
      <el-table-column label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
      <el-table-column prop="afterAssetStatus" label="资产状态" show-overflow-tooltip :formatter="formatType"></el-table-column>
      <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastEditor" label="操作人" show-overflow-tooltip></el-table-column>
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
import Api from '@/utils/Api';
import modlePageMixin from '@/mixins/modlePageMixin';
import { assetCurStatusType } from "@/utils/Mapping";
import {
  assetLogFun,
} from "../asset";

export default {
  mixins: [modlePageMixin],
  data() {
    return {};
  },
  props: ['visible', 'assetId'],
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    formatType(row, column) {
      let map = assetCurStatusType;
      return map[row.afterAssetStatus];
    },
    _getList() {
      let par = this.searchData;
      par.assetId = this.assetId;
      assetLogFun(par).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
      });
    }
  }
};
</script>

<style lang="less"></style>
