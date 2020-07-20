<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '洗衣液分账账单']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="账单编号：" prop="billNo">
        <el-input clearable v-model="searchData.billNo" size="small"></el-input>
      </el-form-item>
      <el-form-item label="运营商帐号：" prop="operatorUsername">
        <el-input clearable v-model="searchData.operatorUsername" size="small"></el-input>
      </el-form-item>
      <el-form-item label="出账日：">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结算日：">
        <el-date-picker size="small" v-model="searchData.time1" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态：" prop="billState">
        <el-select size="small" v-model="searchData.billState" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option label="未结算" value="0"></el-option>
          <el-option label="已结算" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" :summary-method="getSummaries" show-summary style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="billNo" label="账单编号" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="goDetail(scope.row)">
              {{scope.row.billNo}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="billPeriod" label="账单周期" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorUsername" label="运营商帐号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNum" label="洗衣液订单量" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="orderAmount" label="洗衣液订单金额(元)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="billAmount" label="账单金额(元)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="billDate" label="出账日" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="settlementDate"  width="100" label="结算日" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.settlementDate ? scope.row.settlementDate : "--"}}
          </template>
        </el-table-column>
        <el-table-column prop="billState" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.billState == 1 ? "已结算" : "未结算"}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip content="结算" placement="top" effect="dark" v-if="scope.row.billState != 1">
              <svg class="icon" aria-hidden="true" @click="dellBills(scope.row)">
                <use xlink:href="#icon-shenhe"></use>
              </svg>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
      <!--结算-->
      <getSettle v-if="visible" :visible.sync="visible" @submitSearch="goSearchList" :billsId="billsId" :billsData="billsData" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";

import {
  billsListFun,
  exportBillsApi
} from "../bills";
import getSettle from "./getSettle";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    getSettle,
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "operatorUsername": "",
        "billNo": "",
        "billState": "",
        "settlementEndDate": "",
        "settlementStartDate": "",
        "billEndDate": "",
        "billStartDate": "",
        "time": [],
        "time1": [],
      },
      billsId: "",
      visible: false,
      totalData: {}
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getList();
    // }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 4) {
          sums[index] = this.totalData.orderNum;
          return;
        }
        if (index === 5) {
          sums[index] = this.totalData.orderAmount;
          return;
        }
        if (index === 6) {
          sums[index] = this.totalData.billAmount;
          return;
        }
        sums[index] = '';
        // const values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return prev + curr;
        //     } else {
        //       return prev;
        //     }
        //   }, 0);
        //   sums[index] += ' 元';
        // } else {
        //   sums[index] = '';
        // }
      });
      this.$nextTick(() => {
        this.$refs.list.doLayout();
      });
      return sums;
    },
    // 网络状态
    formatterNetStatus(row, column) {
      return netWorkStatus[row.computeStatus];
    },
    // 设备状态
    formatterStatus(row, column) {
      if (row.deviceWorkStatus == 10) {
        return '空闲'
      } else if (row.deviceWorkStatus == 20) {
        return '工作中'
      }  else if (row.deviceWorkStatus == 30) {
        return '故障'
      }
    },
    
    dellBills(item) {
      this.billsId = item.billNo;
      this.billsData = item;
      this.visible = true;
    },
    
    async getList() {
      let par = Object.assign({}, this.page, this.searchData);

      par.billStartDate = par.time ? par.time[0] : null;
      par.billEndDate = par.time ? par.time[1] : null;
      par.time = null;

      par.settlementStartDate = par.time1 ? par.time1[0] : null;
      par.settlementEndDate = par.time1 ? par.time1[1] : null;
      par.time1 = null;

      let res = await billsListFun(par);
      this.totalData = res.extra;
      this.total = res.total;
      this.list = res.items;
    },
    
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },

    goSearchList(par) {
      if (par && par.pageNum) {
        this.page.pageNum = par.pageNum;
        this.page.page = par.pageNum;
      } else {
        this.page.pageNum = 1;
        this.page.page = 1
      }
      if (par && par.pageSize) {
        this.page.pageSize = par.pageSize;
      } else {
        this.page.pageSize = 30;
      }
      this.getList();
    },
    goDetail(item) {
      this.$router.push({
        name: 'billsDetail',
        query: { billNo: item.billNo }
      });
    },
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;

      par.billStartDate = par.time ? par.time[0] : null;
      par.billEndDate = par.time ? par.time[1] : null;
      par.time = null;

      par.settlementStartDate = par.time1 ? par.time1[0] : null;
      par.settlementEndDate = par.time1 ? par.time1[1] : null;
      par.time1 = null;
      exportExcel(exportBillsApi, "洗衣液分账账单列表.xlsx", par);
    },
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
.moreBtn {
  margin-bottom: 12px;
}
</style>
