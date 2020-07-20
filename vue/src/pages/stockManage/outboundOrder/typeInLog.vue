<template>
  <el-dialog title="录入明细" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1000px">
    <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="500">
      <el-table-column label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="设备编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="data" label="批次号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUserName" label="厂家编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="商品品质" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="top" effect="dark">
            <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
              <use xlink:href="#icon-trashcopy" />
            </svg>
          </el-tooltip>
        </template>
      </el-table-column>
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
import { operationListFun } from '../detergent';

export default {
  mixins: [modlePageMixin],
  data() {
    return {};
  },
  props: ['visible', 'brandId'],
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
    _getList() {
      operationListFun({ brandId: this.brandId }).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
      });
    }
  }
};
</script>

<style lang="less"></style>
