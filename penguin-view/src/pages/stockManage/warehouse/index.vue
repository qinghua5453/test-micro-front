<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '入库单']" />
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
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入库单号" prop="inventoryOrderNo">
        <el-input clearable v-model.trim="searchData.inventoryOrderNo" size="small"></el-input>
      </el-form-item>
      <el-form-item label="入库类别" prop="inventoryOrderTypeId">
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
      <el-form-item label="供应商" prop="companyId">
        <el-select
            size="small"
            v-model="searchData.companyId"
            @change="changeCompany"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键字搜索"
            :remote-method="remoteMethod"
            style="width:100%;"
            >
            <el-option
              v-for="item in filterOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        <!-- <el-input clearable v-model.trim="searchData.goodsName" size="small"></el-input> -->
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
        <a class="el-button" type="primary" @click="exportTable()" v-if="getPerm('mer:stock:in:excel')">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="el-icon-circle-plus btn-add" @click="goAddWare" v-if="getPerm('mer:stock:in:add')">
        新增入库
      </el-button>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="单据日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryOrderNo" label="入库单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryOrderTypeName" label="入库类别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessTypeName" label="业务类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.reverse == 0">
              {{scope.row.businessTypeName}}
            </span>
            <span style="color:red;" v-else>
              {{scope.row.businessTypeName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsAttribute" label="属性" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.goodsAttribute == 20 ? "消耗品" : "资产"}}
          </template>
        </el-table-column>
        <el-table-column prop="companyCode" label="供应商编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="companyName" label="供应商名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip content="查看详情" placement="top" effect="dark">
              <router-link :to="{ name: 'warehouseDetail', query: { id: scope.row.id } }" style="color:#409EFF">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-mydetail"></use>
                </svg>
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="tips">
        注: 红色代表冲正.
      </div> -->
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
  codeListApi,
} from "../../detergentManage/detergent";
import {
  storeListFun,
  companyListFun,
  typeListFun,
  wareListFun,
  wareTypeListFun,
  inventoryInExportApi
} from "../stock";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "beginCreateTime": "",
        "reverse": "",
        "companyId": "",
        "endCreateTime": "",
        "inventoryOrderNo": "",
        "inventoryOrderTypeId": "",
        "warehouseId": "",
        time: []
      },
      storeList: [],
      companyList: [],
      typeList: [],
      wareType: [],
      wareSelType: [],

      companyNames: [],
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
    // if (this.getPerm("dal:ship:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getStoreList();
      this.getAllCompanyList();
      this.getTypeList();
      this.getWareType();
    // }
  },
  methods: {
    async getWareType() {
      let par = {
        keywords: "",
        status: null,
        type: 10,
      }
      let res = await wareTypeListFun(par);
      this.wareType = res;
      this.wareSelType = [];
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
    async getTypeList() {
      let par = {
        keywords: "",
        status: null,
        type: 10,
      }
      let res = await typeListFun(par);
      this.typeList = res;
    },
    async getAllCompanyList() {
      let par = {
        keywords: "",
        status: null,
        type: 10,
      }
      let res = await companyListFun(par);
      this.companyNames = res;
      this.filterOptions = res;
      this.companyList = res;
    },
    async getCompanyList(query) {
      let par = {
        keywords: query,
        status: null,
        type: 10,
      }
      let res = await companyListFun(par);

      this.filterOptions = res;
    },
    async getAssetList() {
      let par = Object.assign({}, this.page, this.searchData);

      par.beginCreateTime = par.time ? par.time[0] : null;
      par.endCreateTime = par.time ? par.time[1] : null;
      par.time = null;
      if (this.getPerm("mer:stock:in:list")) {
        let res = await wareListFun(par);
        this.total = res.total;
        this.list = res.items;
      }
    },
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },
    changeCompany() {
      if (!this.searchData.companyId) {
         this.filterOptions = JSON.parse(JSON.stringify(this.companyNames));
      }
    },
    remoteMethod(query) {
      if (query) {
        this.getCompanyList(query);
      } else {
        this.filterOptions = JSON.parse(JSON.stringify(this.companyNames));
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

    changeIoType(item) {
      this.searchData.reverse = "";
      if(!this.searchData.inventoryOrderTypeId){
        this.searchData.reverse = "";
        this.wareSelType = [];
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
    goAddWare() {
      this.$router.push("/warehouse/add");
    },
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;
      par.beginCreateTime = par.time ? par.time[0] : null;
      par.endCreateTime = par.time ? par.time[1] : null;
      par.time = null;
      exportExcel(inventoryInExportApi, "入库单列表.xlsx", par);
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
.tips {
  color: red;
  font-size: 12px;
  line-height: 36px;
  text-indent: 24px;
}
</style>
