<template>
  <section v-if="getPerm('dal:operator:list')">
    <el-row>
      <el-col :span="24">
        <q-breadcrumb :data="['财务管理', '提现费率']" />
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="运营商账号：" prop="userName">
            <el-input size="small" clearable v-model="searchData.username" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input size="small" clearable v-model="searchData.realname" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="提现费率：">
            <el-select size="small" v-model="searchData.rate" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="(item, index) in rates" :key="index" :label="item | ratesTrans" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块流量费：">
            <el-select size="small" v-model="searchData.trafficAmount" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="(item, index) in moduleTraffics" :key="index" :label="item | moduleTrafficTrans" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" v-if="getPerm('dal:rote:excel')" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-table border :data="list" style="width: 100%" height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
            <el-table-column prop="username" label="运营商账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realname" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rate" label="提现费率" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.rate | ratesTrans }}
              </template>
            </el-table-column>
            <el-table-column prop="trafficAmount" label="模块流量费" show-overflow-tooltip>
               <template slot-scope="scope">
                {{ scope.row.trafficAmount | moduleTrafficTrans }}
                
              </template>
            </el-table-column>
            <el-table-column prop="editorName" label="最后更新人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="最后更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-tooltip content="费率设置" placement="top" effect="dark">
                  <i class="el-icon-setting" style="padding-right:15px" @click="handleSetRate(scope.row)" v-if="getPerm('dal:rote:update')"></i>
                </el-tooltip>
                <el-tooltip content="模块流量费设置" placement="top" effect="dark">
                  <svg class="icon" style="font-size:19px" aria-hidden="true" @click="handleSetModuleTraffic(scope.row)" v-if="getPerm('dal:traffic:amount:update')">
                    <use xlink:href="#icon-mycoin"></use>
                  </svg>
                  <!-- <i class="el-icon-coin" @click="handleSetModuleTraffic(scope.row)" v-if="getPerm('dal:traffic:amount:update')"></i> -->
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!-- 提现费率 -->
    <rate-setting v-if="rateVisible" :visible.sync="rateVisible" :rates="rates" :rateForm="rateForm" @getOperatorList="getOperatorList"></rate-setting>
    <!-- 模块流量费 -->
    <module-traffic-setting v-if="moduleTrafficVisible" :visible.sync="moduleTrafficVisible" :moduleTraffics="moduleTraffics" :moduleTrafficForm="moduleTrafficForm" @getOperatorList="getOperatorList"></module-traffic-setting>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import rateSetting from './rateSetting'
import moduleTrafficSetting from './moduleTrafficSetting'
export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        username: null,
        realname: null,
        rate: '',
        trafficAmount:''
      },
      rates: [],
      rateVisible: false,
      rateForm: {
        operatorId: '',
        rate: ''
      },
      moduleTraffics:[],
      moduleTrafficVisible: false,
      moduleTrafficForm: {
        operatorId: '',
        amount: ''
      },
    };
  },
  filters: {
    ratesTrans: value => {
      return value / 1000 + '%';
    },
    moduleTrafficTrans: value => {
      return value / 100;
    }
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:rote:list')) {
      this.getOperatorList();
      this.getRatesList();
      this.getModuleTrafficList();
    }
  },
  methods: {
    //序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    getOperatorList() {
      this.apiUrl = Api.WITHDRAWAL_RATE;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    getRatesList() {
      this.$axios.post(Api.WITHDRAWAL_RATE_LIST).then(res => {
        this.rates = res.rates;
      });
    },
    getModuleTrafficList() {
      this.$axios.post(Api.TRAFFIC_SET_LIST).then(res => {
        this.moduleTraffics = res.trafficAmounts;
      });
    },
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    handleSetRate(row = {}) {
      this.rateForm.operatorId = row.operatorId;
      this.rateForm.rate = row.rate;
      this.rateVisible = true;
    },
    handleSetModuleTraffic(row = {}) {
      this.moduleTrafficForm.operatorId = row.operatorId;
      this.moduleTrafficForm.amount = row.trafficAmount;
      this.moduleTrafficVisible = true;
    },
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          let query = DataUtils.clone(this.searchData);
          exportExcel(Api.WITHDRAWAL_EXPORT, '费率.xlsx', query);
        }
      });
    },
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    rateSetting,
    moduleTrafficSetting,
  }
};
</script>
<style lang="less" scoped>
.el-icon-setting,.el-icon-coin {
  font-size: 18px;
  color: #409eff;
}
</style>
