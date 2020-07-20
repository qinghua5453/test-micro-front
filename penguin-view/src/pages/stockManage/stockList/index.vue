<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '库存列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="存货分类" prop="paType">
        <el-cascader
        size="small"
        v-model="searchData.paType"
        :props="defaultProps"
        :options="parentsData"
        filterable
        clearable></el-cascader>
      </el-form-item>
      <el-form-item label="存货名称" prop="goodsName">
        <el-select
            size="small"
            v-model="searchData.goodsName"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键字搜索"
            @change="changeCompany"
            :remote-method="remoteMethod"
            style="width:100%;"
            >
            <el-option
              v-for="(item,index) in filterOptions"
              :key="index"
              :label="item.goodsName"
              :value="item.goodsName">
            </el-option>
          </el-select>
        <!-- <el-input clearable v-model.trim="searchData.goodsName" size="small"></el-input> -->
      </el-form-item>
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input clearable v-model.trim="searchData.deviceCode" size="small"></el-input>
      </el-form-item>
      <el-form-item label="所在仓库" prop="warehouseId">
        <el-select size="small" v-model="searchData.warehouseId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in storeList" :key="index" :label="item.showName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button" @click="exportTable()" v-if="getPerm('mer:stock:excel')">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="存货名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsCode" label="存货编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.deviceCode ? scope.row.deviceCode : "--"}}
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkUnit(scope.row.unit)}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="库存数量">
          <template slot-scope="scope">
            <span class="linkinNum" style="color:red;" @click="goDetail(scope.row)" v-if="scope.row.num == 0">
              {{scope.row.num}}
            </span>
            <span class="linkinNum" @click="goDetail(scope.row)" v-else>
              {{scope.row.num}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
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
import { assetCurStatusType } from "@/utils/Mapping";

import {
  storeListFun,
  stockListFun,
  treeDataFun,
  erpNameFun,
  typeStockListFun,
  inventoryExportApi
} from "../stock";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
  },
  data() {
    return {
      parentsData: [],
      defaultProps: {
          children: 'childNodes',
          label: 'showCodeName',
          value: 'id',
          checkStrictly: true 
      },
      storeList: [],
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "paType": [],
        "deviceCode": "",
        "goodsCategoryId": "",
        "goodsName": "",
        "warehouseId": "",
      },
      erpNames: [],
      filterOptions: []
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetCurStatusType() {
      return assetCurStatusType;
    },
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getStoreList();
      this.getTreeData();
      this.getAllErpData();
    // }
  },
  methods: {
    async getAllErpData() {
      let par = {
        keywords: "",
        status: null,
        type: "",
        page: 1,
        pageNum: 1,
        pageSize: 1000,
      }
      let res = await typeStockListFun(par);
      this.erpNames = res.items;
      this.filterOptions = res.items;
    },
    async getErpData(word) {
      var par = {
        keywords: word
      }
      let res = await erpNameFun(par);
      this.filterOptions = res;
    },
    async getTreeData() {
      this.curParent = [0];
      this.curAssetParent = [];
      this.editData = {};
      var par = {
        keywords: ""
      }
      let res = await treeDataFun(par);
      // this.parentsData = res;
      this.checkNoTypeArr(res);
      this.checkNameTypeArr(this.parentsData);
    },
    async getStoreList() {
      let par = {
        keywords: "",
        status: null,
        type: "",
      }
      
      let res = await storeListFun(par);
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          element.showName = element.code + " " + element.name;
        }
      }
      this.storeList = res;
    },
    async getAssetList() {
      let par = Object.assign({}, this.page, this.searchData);

      if (par.paType && par.paType.length > 0) {
        par.goodsCategoryId = par.paType[par.paType.length-1]
      }
      par.paType = null;
      if (this.getPerm("mer:stock:list")) {
        let res = await stockListFun(par);
        this.total = res.total;
        this.list = res.items;
      }
    },
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },
    changeCompany() {
      if (!this.searchData.goodsName) {
         this.filterOptions = JSON.parse(JSON.stringify(this.erpNames));
      }
    },
    remoteMethod(query) {
      if (query) {
        this.getErpData(query);
      } else {
        this.filterOptions = JSON.parse(JSON.stringify(this.erpNames));
      }
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
    goDetail(row) {
      this.$router.push({
        name: 'stockDetail',
        query: { goodsId: row.goodsId,warehouseId: row.warehouseId }
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.excel = true;
      if (query.paType && query.paType.length > 0) {
        query.goodsCategoryId = query.paType[query.paType.length-1]
      }
      query.paType = null;
      exportExcel(inventoryExportApi, "库存列表.xlsx", query);
    },
    checkUnit(unit) {
      if(unit == 1) {
        return "台";
      }else if(unit == 2) {
        return "桶";
      }else {
        return unit;
      }
    },
    checkNoTypeArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource,code){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            father.showCode = code + father.goodsCategoryCode;
            if (father.childNodes && father.childNodes.length == 0) {  
              father.childNodes = null;
            }     
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes,father.showCode);
            }
        });
        // return;
      }
      checkedFromTree(dataArr,"");
      this.parentsData = dataArr;
    },
    checkNameTypeArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            father.showCodeName = father.showCode +" "+ father.goodsCategoryName;
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes);
            }
        });
        // return;
      }
      checkedFromTree(dataArr);
      this.parentsData = dataArr;
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
.linkinNum {
  // text-decoration: underline;
  color: #409EFF;
  cursor: pointer;
}
</style>
