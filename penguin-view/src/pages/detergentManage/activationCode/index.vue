<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['洗衣液管理', '激活码列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="激活码" prop="sn">
        <el-input clearable v-model.trim="searchData.sn" size="small"></el-input>
      </el-form-item>
      <el-form-item label="液体名称" prop="brandName">
        <el-input clearable v-model.trim="searchData.brandName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="液体类型" prop="brandTypeId">
        <el-select size="small" v-model="searchData.brandTypeId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="item in brandTypes" :key="item.id" :label="item.name" :value="String(item.id)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="液体品牌" prop="brandNameId">
        <el-select size="small" v-model="searchData.brandNameId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="item in brandNames" :key="item.id" :label="item.name" :value="String(item.id)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="液体规格" prop="qty">
        <el-select size="small" v-model="searchData.qty" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option v-for="(name, id) in detergentQtyType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option v-for="(name, id) in activationCodeStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sn" label="名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.name" label="液体名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandType" label="液体类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.brandName" label="液体品牌" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brand.qty" label="液体规格" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip :formatter="formatterStatus"></el-table-column>
        <el-table-column prop="createUserName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
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
import { activationCodeStatusType, detergentQtyType } from "@/utils/Mapping";
import {
  codeListApi,
  codeListFun,
  brandTypesFun,
  brandNamesFun
} from "../detergent";

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
        sn: "",
        brandName: "",
        brandTypeId: "",
        brandNameId: "",
        qty: "",
        status: "",
        time: []
      },
      brandNames: [],
      brandTypes: []
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    activationCodeStatusType() {
      return activationCodeStatusType;
    },
    detergentQtyType() {
      return detergentQtyType;
    }
  },
  created() {
    if (this.getPerm("mer:dispenser:brandSn:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [
          this.searchData.startTime,
          this.searchData.endTime
        ];
      }
      this.getBrandTypesFun();
      this.getBrandNamesFun();
      this.getActivationCodetList();
    }
  },
  methods: {
    async getBrandTypesFun() {
      let res = await brandTypesFun();
      this.brandTypes = res;
    },
    async getBrandNamesFun() {
      let res = await brandNamesFun();
      this.brandNames = res;
    },
    async getActivationCodetList() {
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
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          query = DataUtils.filter(query);
          this.$router.push({
            query: query
          });
        }
      });
    },
    formatterStatus(row, column) {
      return activationCodeStatusType[row.status];
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.startTime = query.time ? query.time[0] : null;
      query.endTime = query.time ? query.time[1] : null;
      query.time = null;
      query.excel = true;
      exportExcel(codeListApi, "激活码总览.xlsx", query);
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
