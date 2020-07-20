<template>
  <!--iot日志-->
  <el-dialog class="dialog-shop" title="IOT日志" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1000px">
    <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="500">
      <el-table-column label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
      <el-table-column prop="messageId" label="信息标识" show-overflow-tooltip></el-table-column>
      <el-table-column prop="productKey" label="productKey" show-overflow-tooltip></el-table-column>
      <el-table-column prop="imei" label="imei" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='offline'" :class="{red:scope.row.status==='offline'}">离线</span>
          <span v-if="scope.row.status==='online'" :class="{green:scope.row.status==='online'}">在线</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastTime" label="最后上线时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="block">
        <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page.sync="searchData.page" :page-sizes="pageSizeOpts" :page-size.sync="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-col>
  </el-dialog>
</template>

<script>
import Api from '@/utils/Api';
import modlePageMixin from '@/mixins/modlePageMixin';
import { IOTStatus } from '@/utils/Mapping';
export default {
  name: 'page-relationbd-list',
  mixins: [modlePageMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imei: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  created() {
    this._getList();
  },
  methods: {
    pageSizeChange() {
      this.searchData.page = 1;
      this._getList();
    },
    currentChange() {
      this._getList();
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    _getList() {
      let payload = { 
        imei: this.imei,
        page: this.searchData.page,
        pageSize: this.searchData.pageSize,
        pageNum: this.searchData.page
      };
      this.$axios.post(Api.MACHINE_IMEILOG, payload).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
      });
    }
  }
};
</script>

<style lang="less" scoped>
.red {
  color: #f54949;
}
.green {
  color: #3ea93e;
}
.dialog-shop {
  /deep/ .el-dialog__body{
    overflow: hidden;
  }
}
</style>
