<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['返利', '返利详情']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="IMEI" prop="operatorName">
        <el-input size="small" clearable v-model.trim="searchData.imei"></el-input>
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
        <el-table-column prop="operatorName" label="运营商账号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imei" label="IMEI号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="激活时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="结算时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="validOrderNumber" label="订单数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rebateMoney" label="返利金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button class="table-action" size="mini" @click="lookRebateBase(scope.row)">返利标准</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
    <el-dialog :title="detailInfo.length<=0?'提示':'返利标准'" :visible.sync="rebateCalcVisible" width="520px" top="10vh">
      <div v-if="detailInfo.length<=0" class="base-none">
        尚未设置返利标准
      </div>
      <div v-else>
        <el-row v-for="(item,index) in detailInfo" :key="index" class="rebate_detail">
          <el-col :span="12">
            ({{item.startRange}} {{item.endRange?item.endRange+']':'∞)'}}笔
          </el-col>
          <el-col :span="12" class="price-set">
            返利标准：{{item.money}} 元/台
          </el-col>
        </el-row>
      </div>
      <el-form>
        <el-form-item style="text-align: center;margin-top:30px;">
          <el-button type="primary" @click="rebateCalcVisible=false">确定</el-button>
          <el-button v-if="detailInfo.length>0" @click="rebateCalcVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import { getRebateDetailsList, getRebateDetail } from '../rebate';
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
      //头部搜索
      searchData: {
        imei: ''
      },
      rebateCalcVisible: false,
      detailInfo: []
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  created() {
    this.searchData = Object.assign(this.searchData, this.$route.query);
    this.getRebateDetailListData();
  },
  methods: {
    async getRebateDetailListData() {
      this.apiUrl = Api.REBATE_DETAILS;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      let res = await getRebateDetailsList(this.apiUrl, this.apiParams);
      this.list = res.items || [];
      this.total = res.total;
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
    async lookRebateBase(row = {}) {
      let payload = { shipId: row.shipId };
      let res = await getRebateDetail(payload);
      this.detailInfo = res || [];
      this.rebateCalcVisible = true;
    },
    exportTable() {
      let query = Object.assign(this.searchData, this.$route.query);
      exportExcel(Api.REBATE_DETAILS_EXPORT, '返利详情总览.xlsx', query);
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
.rebate_detail {
  line-height: 60px;
}
.base-none {
  text-align: center;
  margin-top: 50px;
}
</style>
