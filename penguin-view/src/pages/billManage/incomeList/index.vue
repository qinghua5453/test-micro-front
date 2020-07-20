<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '洗衣液收入账单']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="日期：">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态：" prop="billState">
        <el-select size="small" v-model="searchData.billState" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in billStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button" @click="exportTable()" v-if="getPerm('dal:incomeList:excel')">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" :summary-method="getSummaries" show-summary style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="billDate" label="日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNum" label="洗衣液订单量" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="goDetail(scope.row)">
              {{scope.row.orderNum}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="洗衣液订单金额(元)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="billState" label="状态" show-overflow-tooltip :formatter="formatterStatus">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip content="立即结算" placement="top" effect="dark" v-if="getPerm('dal:incomeList:settlement') && (scope.row.billState == 0 || scope.row.billState == 3)">
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
      <getSettle v-if="visible" :visible.sync="visible" @submitSearch="submitSearch" :billsId="billsId" :billsData="billsData" />
      <!--结算-->
      <incomeDetail v-if="detailVisible" :visible.sync="detailVisible" :billsId="billsId" />
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
import { billStatus } from "@/utils/Mapping";
import moment from "moment";

import {
  incomeListFun,
  exportIncomeApi
} from "../bills";
import getSettle from "./getSettle";

import incomeDetail from "./incomeDetail";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    getSettle,
    incomeDetail
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "billState": "",
        "endTime": "",
        "startTime": "",
        "time": [],
      },
      billsId: "",
      visible: false,
      detailVisible: false,
      totalData: {}
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    billStatus() {
      return billStatus;
    },
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.searchData.startTime = moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
      this.searchData.endTime = moment().format('YYYY-MM-DD 23:59:59');
      this.searchData.time = [this.searchData.startTime,this.searchData.endTime];
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
        if (index === 2) {
          sums[index] = this.totalData.orderNum;
          return;
        }
        if (index === 3) {
          sums[index] = this.totalData.orderAmount;
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
    // 结算状态
    formatterStatus(row, column) {
      return billStatus[row.billState];
    },
    goDetail(item) {
      this.billsId = item.billNo;
      // this.billsData = item;
      this.detailVisible = true;
    },
    dellBills(item) {
      this.billsId = item.billNo;
      this.billsData = item;
      this.visible = true;
    },
    
    async getList() {
      let par = Object.assign({}, this.page, this.searchData);

      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;

      if (this.getPerm("dal:incomeList:list")) {
        let res = await incomeListFun(par);
        this.totalData = res.extra;
        this.total = res.total;
        this.list = res.items;
      }
    },
    
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },

    submitSearch(par) {
      setTimeout(() => {
        this.goSearchList();
      }, 600);
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
    
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;

      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;

      exportExcel(exportIncomeApi, "洗衣液分账账单列表.xlsx", par);
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
