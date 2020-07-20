<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['资产管理', '资产列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="资产编号" prop="assetCode">
        <el-input clearable v-model.trim="searchData.assetCode" size="small"></el-input>
      </el-form-item>
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input clearable v-model.trim="searchData.deviceCode" size="small"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="companyId">
        <el-select size="small" v-model="searchData.companyId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in companyList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="batchNo">
        <el-input clearable v-model.trim="searchData.batchNo" size="small"></el-input>
      </el-form-item>
      <el-form-item label="资产类别" prop="assetType">
        <el-select size="small" v-model="searchData.assetType" placeholder="不限">
          <el-option label="不限" value></el-option>
          <!-- <el-option label="洗衣液投放器" value="10"></el-option> -->
          <el-option v-for="(name, id) in assetType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产状态" prop="assetStatus">
        <el-select size="small" v-model="searchData.assetStatus" placeholder="全部">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in assetCurStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button" type="primary" @click="exportTable()" v-if="getPerm('mer:assets:excel')">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetCode" label="资产编号" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="厂家编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="batchNo" label="批次号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetType" label="资产类别" show-overflow-tooltip  :formatter="formatterType">
        </el-table-column>
        <el-table-column prop="deliveryTime" label="出厂时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inTime" label="入库时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outTime" label="出库时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assetStatus" label="资产状态" show-overflow-tooltip :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="日志" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="operatingLog(scope.row)">
                <use xlink:href="#icon-mydetail"></use>
              </svg>
              <!-- <i class="el-icon-document-checked" style="font-size: 20px;color: #1296db;vertical-align: top;" @click="operatingLog(scope.row)"></i> -->
            </el-tooltip>
            <!-- <el-tooltip content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip> -->
            <el-tooltip content="报废" placement="top" effect="dark" v-if="getPerm('mer:assets:scrap')">
              <svg class="icon" aria-hidden="true" @click="handleScrapAsset(scope.row)" v-if="scope.row.assetStatus == 0 || scope.row.assetStatus == 2">
                <use xlink:href="#icon-shengchengerweima"></use>
              </svg>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
    </div>
    <!--日志-->
    <log v-if="logVisible" :visible.sync="logVisible" :assetId="assetId" />
    <!--报废-->
    <scrap v-if="scrapVisible" :visible.sync="scrapVisible" :assetId="assetId" @submitSearch="goSearchList" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { assetCurStatusType,assetType } from "@/utils/Mapping";
import {
  assetListApi,
  assetListFun,
  delAssetApi,
  delAssetFun,
  assetExportApi
} from "../asset";

import {
  companyListFun,
} from "../../stockManage/stock";


import log from "./log";
import scrap from "./scrap";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    log,
    scrap
  },
  data() {
    return {
      companyList: [],
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "assetCode": "",
        "assetStatus": "",
        "assetType": "",
        "batchNo": "",
        "companyId": "",
        "deviceCode": "",
      },
      logVisible:false,
      scrapVisible:false,
      batchUpdateNoVisible:false,
      multipleSelection:[],
      assetId:'',
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetCurStatusType() {
      return assetCurStatusType;
    },
    assetType() {
      return assetType;
    },
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getCompanyList();
    // }
  },
  methods: {
    async getCompanyList() {
      let par = {
        keywords: "",
        status: null,
        type: 10,
      }
      let res = await companyListFun(par);
      this.companyList = res;
    },
    async getAssetList() {
      this.apiUrl = assetListApi;
      let par = Object.assign({}, this.page, this.searchData);

      if (this.getPerm("mer:assets:list")) {
        let res = await assetListFun(this.apiUrl, par);
        this.total = res.total;
        this.list = res.items;
      }
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
      this.getAssetList();
    },
    operatingLog(row = {}) {
      this.logVisible = true;
      this.assetId = row.id;
    },
    handleScrapAsset(row = {}) {
      this.scrapVisible = true;
      this.assetId = row.id;
    },
    handleDelete(row = {}) {
      let url = delAssetApi + row.id

      this.$confirm('您确定删除该资产吗？', '提示', {
        type: 'warning'
      }).then(_ => {
        let par = {}
        delAssetFun(url,par).then(resp => {
          this.$message.success('删除成功');
          this.getAssetList();
        });
      });
    },
    formatterStatus(row, column) {
      return assetCurStatusType[row.assetStatus];
    },
    formatterType(row, column) {
      return assetType[row.assetType];
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.excel = true;
      exportExcel(assetExportApi, "资产列表.xlsx", query);
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
