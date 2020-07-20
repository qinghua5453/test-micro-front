<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '流量费明细']" />
    <el-form
      :inline="true"
      :model="searchData"
      ref="searchData"
      class="demo-form-inline device-wrapper"
    >
      <el-form-item label="流量结算月份：">
        <el-date-picker
          v-model="searchData.month"
          :clearable="false"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="IMEI" prop="imei">
        <el-input size="small" clearable v-model.trim="searchData.imei"></el-input>
      </el-form-item>
      <el-form-item label="运营商账号：" prop="operator">
        <el-input size="small" clearable v-model="searchData.operator" style="width: 140px;"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item v-if="getPerm('dal:module:traffic:details:excel')">
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
        <el-table-column prop="imei" label="IMEI" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bindTime" label="绑定时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="流量费结算月份" min-width="140" show-overflow-tooltip :formatter="formatterMonths"></el-table-column>
        <el-table-column prop="shopName" label="归属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column prop="machineName" label="设备名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trafficAmount" label="收费标准" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderStatus" label="支付状态" show-overflow-tooltip :formatter="formatterTrafficOrderStatusType"></el-table-column>
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
        imei: "",
        operator: "",
      }
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
  },
  created() {
    if (this.getPerm("dal:module:traffic:details:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getModuleTrafficDetailList();
    }
  },
  methods: {
    formatterTrafficOrderStatusType(row) {
      return trafficOrderStatusType[row.orderStatus];
    },
    formatterMonths(row,column) {
      return moment(row.createTime).format("YYYY-MM");
    },
    async getModuleTrafficDetailList() {
      this.apiUrl = Api.MODULE_TRAFFIC_DETAILS_LIST;
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
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      exportExcel(Api.MODULE_TRAFFIC_DETAILS_EXPORT, "流量费明细总览.xlsx", query);
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
