<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '出库单', '出库详情', '出库明细']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="SN" prop="sn">
        <el-input clearable v-model.trim="searchData.sn" size="small"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="sn">
        <el-input clearable v-model.trim="searchData.sn" size="small"></el-input>
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
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sn" label="出库单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.name" label="物料名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandType" label="SN" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="厂家编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="商品属性" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.name" label="钉钉审批编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="BD" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="出库时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="操作时间" show-overflow-tooltip></el-table-column>
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
import { exportExcel } from "@/utils/tool";
import { assetStatusType } from "@/utils/Mapping";
import {
  codeListApi,
  codeListFun,
} from "../../detergentManage/detergent";

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        sn: "",
        brandName: "",
        brandTypeId: "",
        brandNameId: "",
        qty: "",
        status: "",
        time: []
      },
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetStatusType() {
      return assetStatusType;
    },
  },
  created() {
    if (this.getPerm("dal:ship:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
    }
  },
  methods: {
    async getAssetList() {
      this.apiUrl = codeListApi;
      let query = this.$route.query;
      this.setApiParams(query);
      let res = await codeListFun(this.apiUrl, this.apiParams);
      this.total = res.total;
      this.list = res.items;
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
      query.excel = true;
      exportExcel(codeListApi, "库存列表总览.xlsx", query);
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
