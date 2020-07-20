<template>
  <el-dialog class="dialog-shop" title="账单详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1000px">
      <div class="invoice">
      <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
        <el-form-item label="订单编号：" prop="orderNo">
          <el-input clearable v-model="searchData.orderNo" size="small"></el-input>
        </el-form-item>
        <el-form-item label="运营商帐号：" prop="operatorUsername">
          <el-input clearable v-model="searchData.operatorUsername" size="small"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺：" prop="shopId">
          <el-select
            size="small"
            v-model="searchData.shopId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键字搜索"
            @change="changeShop"
            :remote-method="remoteMethod"
            style="width:100%;"
            >
            <el-option
              v-for="(item,index) in filterOptions"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：" prop="machineName">
          <el-input clearable v-model="searchData.machineName" size="small"></el-input>
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
        <el-table border :data="list" ref="list" :summary-method="getSummaries" show-summary style="width: 100%" :fit="true" height="503" class="my-table">
          <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderNo" label="订单编号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operatorUsername" label="运营商帐号" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopName" label="所属店铺" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="machineName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dispenserName" label="投放器名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderAmount" label="洗衣液订单金额(元)" width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
          <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import { exportExcel } from "@/utils/tool";

import {
  shopsListFun,
  incomeDetailListFun,
  incomeDetailexportApi
} from "../bills";
import getSettle from "./getSettle";

export default {
  mixins: [PagerTmixin],
  props: ['billsId', 'visible'],
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "operatorUsername": "",
        "shopId": "",
        "machineName": "",
        "orderNo": "",
      },
      totalData: {},
      allShops: [],
      filterOptions: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getList();
      this.getAllShop();
    // }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getAllShop() {
      let par = {
        name: "",
      }
      let res = await shopsListFun(par);
      this.allShops = res;
      this.filterOptions = res;
    },
    async getShop(word) {
      var par = {
        name: word
      }
      let res = await shopsListFun(par);
      this.filterOptions = res;
    },
    remoteMethod(query) {
      console.log(this.allShops);
      if (query) {
        this.getShop(query);
      } else {
        this.filterOptions = JSON.parse(JSON.stringify(this.allShops));
      }
    },
    changeShop() {
      if (!this.searchData.shopId) {
        this.filterOptions = JSON.parse(JSON.stringify(this.allShops));
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 6) {
          sums[index] = this.totalData.orderAmount;
          return;
        }
        sums[index] = '';
      });
      this.$nextTick(() => {
        this.$refs.list.doLayout();
      });
      return sums;
    },
    async getList() {
      let par = Object.assign({}, this.page, this.searchData);

      par.billNo = this.billsId;

      let res = await incomeDetailListFun(par);
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
    
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;
      par.billNo = this.billsId;
      exportExcel(incomeDetailexportApi, "洗衣液分账账单详情.xlsx", par);
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
