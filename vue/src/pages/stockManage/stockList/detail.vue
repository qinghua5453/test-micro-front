<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '出入库流水']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="单据日期" prop="status">
        <el-date-picker
          size="small"
          v-model="searchData.time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="出入库类别" prop="inventoryOrderTypeId">
        <el-select size="small" v-model="searchData.inventoryOrderTypeId" placeholder="不限" @change="changeIoType">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in wareType" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="reverse">
        <el-select size="small" v-model="searchData.reverse" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in wareSelType" :key="index" :label="item.value" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="仓库" prop="warehouseId">
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
        <el-table-column prop="createTime" label="单据日期" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryOrderNo" label="出入库单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryOrderTypeName" label="出入库类别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="存货名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsCode" label="存货编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkUnit(scope.row.unit)}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="入库数量" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryOrderType == 10 && scope.row.reverse == 0">
              {{scope.row.num}}
            </span>
            <span style="color:red;" v-if="scope.row.inventoryOrderType == 10 && scope.row.reverse == 1">
              -{{scope.row.num}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="出库数量" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.inventoryOrderType == 20 && scope.row.reverse == 0">
              {{scope.row.num}}
            </span>
            <span style="color:red;" v-if="scope.row.inventoryOrderType == 20 && scope.row.reverse == 1">
              -{{scope.row.num}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsAttribute" label="属性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.goodsAttribute == 20 ? "消耗品" : "资产"}}
          </template>
        </el-table-column>
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
import { assetStatusType } from "@/utils/Mapping";

import {
  storeListFun,
  stockAllFun,
  treeDataFun,
  wareTypeListFun,
  erpNameFun,
  typeStockListFun,
  inventoryDetailExportApi
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
        "beginCreateTime": "",
        "reverse": "",
        "deviceCode": "",
        "endCreateTime": "",
        "goodsCategoryId": "",
        "goodsId": "",
        "goodsName": "",
        "inventoryOrderTypeId": "",
        "warehouseId": "",
        time: []
      },
      wareType: [],
      wareSelType: [],
      erpNames: [],
      filterOptions: []
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetStatusType() {
      return assetStatusType;
    },
  },
  created() {
    let warehouseId = this.$route.query.warehouseId;
    this.searchData.warehouseId = warehouseId ? warehouseId : "";
    
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getStoreList();
      this.getTreeData();
      this.getWareType();
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
    async getWareType() {
      let par = {
        keywords: "",
        status: null,
        type: null,
      }
      let res = await wareTypeListFun(par);
      this.wareType = res;
      this.wareSelType = [];
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

      let goodsId = this.$route.query.goodsId;
      
      par.beginCreateTime = par.time ? par.time[0] : null;
      par.endCreateTime = par.time ? par.time[1] : null;
      par.time = null;
      par.goodsId = goodsId;
      
      if (par.paType && par.paType.length > 0) {
        par.goodsCategoryId = par.paType[par.paType.length-1]
      }
      par.paType = null;
      if (this.getPerm("mer:stock:detail:list")) {
        let res = await stockAllFun(par);
        this.total = res.total;
        this.list = res.items;
      }
    },
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
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
      // this.$refs.searchData.validate(valid => {
      //   if (valid) {
      //     this.getAssetList();
      //   }
      // });
    },
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;
      let goodsId = this.$route.query.goodsId;
      
      par.beginCreateTime = par.time ? par.time[0] : null;
      par.endCreateTime = par.time ? par.time[1] : null;
      par.time = null;
      par.goodsId = goodsId;
      exportExcel(inventoryDetailExportApi, "出入库单明细列表.xlsx", par);
    },
    changeIoType(item) {
      this.searchData.reverse = "";
      if(!this.searchData.inventoryOrderTypeId){
        this.searchData.reverse = "";
        this.wareSelType = [];
        return false;
      }
      for (let i = 0; i < this.wareType.length; i++) {
        const element = this.wareType[i];
        if (element.id == this.searchData.inventoryOrderTypeId) {
          this.searchData.reverse = "";
          this.wareSelType = [
            {key: 0,value: element.normalName},
            {key: 1,value: element.reverseName},
          ];
          break;
        }
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
</style>
