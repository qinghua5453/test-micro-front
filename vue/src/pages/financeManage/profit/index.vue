<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '提成列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="计薪月份" prop="month">
        <el-date-picker v-model="searchData.month" :clearable="false" type="month" placeholder="选择月" value-format="yyyy-MM">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="BD" prop="bdName">
        <el-input size="small" clearable v-model.trim="searchData.bdName"></el-input>
      </el-form-item>
      <el-form-item label="IMEI" prop="imei">
        <el-input size="small" clearable v-model.trim="searchData.imei"></el-input>
      </el-form-item>
      <el-form-item label="一级类型" prop="categoryCode">
        <el-select v-model="searchData.categoryCode" size="small">
          <el-option label="不限" :value="null"></el-option>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.categoryCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" v-if="getPerm('dal:profit:excel')" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bdName" label="BD" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imei" label="IMEI" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessName" label="商业属性" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="一级类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modelName" label="二级类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopName" label="所属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provinceName" label="省份" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorName" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shipTime" label="发货时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="activedTime" label="激活时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="basicFrequency" label="底薪频次" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payFrequency" label="提成频次" show-overflow-tooltip></el-table-column>
        <el-table-column prop="affordFrequency" label="补偿频次" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" :query="query" />
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import { businessType } from '@/utils/Mapping';
import { exportExcel } from '@/utils/tool';
import User from '@/utils/User';
import moment from 'moment';
export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      //头部搜索
      searchData: {
        month: moment().format('YYYY-MM'),
        bdName: '',
        imei: '',
        categoryCode: ''
      },
      categoryList: []
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    query() {
      return Object.assign(this.searchData, this.$route.query);
    }
  },
  created() {
    if (this.getPerm('dal:profit:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.geFirstType();
      this.getDBProfitistData();
    }
  },
  methods: {
    //获取一级类型配置列表
    geFirstType() {
      this.$axios.post(Api.CLOUD_CATEGORY).then(resp => {
        this.categoryList = resp;
      });
    },
    async getDBProfitistData() {
      this.apiUrl = Api.BD_PROFIT_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query['t'] = +new Date();
          query = DataUtils.filter(query);
          this.$router.push({
            query: query
          });
        }
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      exportExcel(Api.BD_PROFIT_LIST_EXPORT, 'Bd设备数据统计.xlsx', query);
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
/deep/ .table-action {
  padding: 7px 10px !important;
}
</style>
