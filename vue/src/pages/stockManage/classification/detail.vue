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
        <el-select size="small" v-model="searchData.inventoryOrderTypeId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option label="新品" :value="1"></el-option>
          <el-option label="旧品" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessTypeId">
        <el-select size="small" v-model="searchData.businessTypeId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option label="新品" :value="1"></el-option>
          <el-option label="旧品" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存货分类" prop="goodsCategoryId">
        <el-select size="small" v-model="searchData.goodsCategoryId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option label="新品" :value="1"></el-option>
          <el-option label="旧品" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存货名称" prop="goodsName">
        <el-input clearable v-model.trim="searchData.goodsName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="仓库" prop="warehouseId">
        <el-select size="small" v-model="searchData.warehouseId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option label="新品" :value="1"></el-option>
          <el-option label="旧品" :value="2"></el-option>
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
        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inNum" label="入库数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outNum" label="出库数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsAttribute" label="属性" show-overflow-tooltip></el-table-column>
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
        "beginCreateTime": "",
        "businessTypeId": "",
        "deviceCode": "",
        "endCreateTime": "",
        "goodsCategoryId": "",
        "goodsId": "",
        "goodsName": "",
        "inventoryOrderTypeId": "",
        "warehouseId": "",
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
      exportExcel(codeListApi, "库存明细总览.xlsx", query);
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
