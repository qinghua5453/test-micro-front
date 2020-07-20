<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '流量费']" />
    <el-form
      :inline="true"
      :model="searchData"
      ref="searchData"
      class="demo-form-inline device-wrapper"
    >
      <el-form-item label="结算月份：">
        <el-date-picker
          v-model="searchData.month"
          :clearable="false"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="运营商" prop="operator">
        <el-input size="small" clearable v-model.trim="searchData.operator"></el-input>
      </el-form-item>
      <el-form-item label="支付状态" prop="orderStatus">
        <el-select size="small" v-model="searchData.orderStatus" placeholder="全部">
          <el-option label="不限" value></el-option>
          <el-option
            v-for="(name, id) in trafficOrderStatusType"
            :key="id"
            :label="name"
            :value="id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流量费标准" prop="trafficAmount">
        <el-select size="small" v-model="searchData.trafficAmount" placeholder="全部">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in moduleTraffics" :key="index" :label="item | moduleTrafficTrans" :value="item | moduleTrafficTrans"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item v-if="getPerm('dal:module:traffic:excel')">
        <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table
        border
        :data="list"
        ref="list"
        style="width: 100%"
        :fit="true"
        height="603"
        class="my-table"
      >
        <el-table-column
          fixed
          label="序号"
          width="60"
          type="index"
          :index="pagerIndex"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator" label="运营商账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="结算月份" show-overflow-tooltip :formatter="formatterMonths"></el-table-column>
        <el-table-column prop="num" label="模块数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trafficAmount" label="收费标准" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="流量费" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="orderStatus"
          label="支付状态"
          show-overflow-tooltip
          :formatter="formatterTrafficOrderStatusType"
        ></el-table-column>
        <el-table-column
          prop="payTypeName"
          label="支付方式"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="payTime" label="支付时间" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" v-if="getPerm('dal:module:traffic:reset')&&scope.row.orderStatus===0" @click="handleReset(scope.row)">重新生成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerMixin from "@/mixins/PagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { trafficOrderStatusType } from "@/utils/Mapping";
import { exportExcel } from "@/utils/tool";
import User from "@/utils/User";
import moment from "moment";

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        month: moment().format("YYYY-MM"),
        operator: "",
        orderStatus: "",
        trafficAmount: ""
      },
      moduleTraffics: []
    };
  },
  filters: {
    moduleTrafficTrans: value => {
      return value / 100;
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    trafficOrderStatusType() {
      return trafficOrderStatusType;
    }
  },
  created() {
    if (this.getPerm("dal:module:traffic:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getModuleTrafficSetList();
      this.getModuleTrafficList();
    }
  },
  methods: {
    formatterTrafficOrderStatusType(row,column) {
      return trafficOrderStatusType[row.orderStatus];
    },
    formatterMonths(row,column) {
      return moment(row.createTime).format("YYYY-MM");
    },
    getModuleTrafficSetList() {
      this.$axios.post(Api.TRAFFIC_SET_LIST).then(resp => {
        this.moduleTraffics = resp.trafficAmounts;
      });
    },
    async getModuleTrafficList() {
      this.apiUrl = Api.MODULE_TRAFFIC_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query["t"] = +new Date();
          query = DataUtils.filter(query);
          this.$router.push({
            query: query
          });
        }
      });
    },
    handleReset(row = {}) {
      this.$confirm('确定重新生成此记录', '提示').then(_ => {
        this.$axios.post(Api.MODULE_TRAFFIC_RESET, { orderNo: row.orderNo }).then(resp => {
            this.$message({
              showClose: true,
              message: '重新生成成功！',
              type: 'success'
            });
            this.getModuleTrafficList();
          });
      });
      
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      exportExcel(Api.MODULE_TRAFFIC_EXPORT, "模块流量费总览.xlsx", query);
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.action-wraper {
  margin-bottom: 10px;
}
.signalred {
  color: #f54949;
}
.table-action /deep/ .el-button {
  padding: 7px 10px !important;
}
</style>
