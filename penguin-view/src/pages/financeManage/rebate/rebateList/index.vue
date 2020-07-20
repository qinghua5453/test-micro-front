<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['财务管理', '返利列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="激活时间" prop="month">
        <el-date-picker v-model="searchData.month" :clearable="false" type="month" placeholder="选择月" value-format="yyyy-MM">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商" prop="operatorName">
        <el-input size="small" clearable v-model.trim="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" v-if="getPerm('dal:rebate:excel')" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorName" label="运营商账号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="moduleNumber" label="返利设备" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name:'rebateDetail',query:{operatorId:scope.row.operatorId,month:searchData.month}}" style="color:#409EFF">{{scope.row.moduleNumber}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="rebateMoney" label="返利金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="结算状态" min-width="100">
          <template slot-scope="scope">
            <el-button class="table-action" v-if="scope.row.status===0" size="mini" @click="handleStatusUpdate(scope.row,1)">未结算</el-button>
            <el-button class="table-action" v-if="scope.row.status===1" size="mini" @click="handleStatusUpdate(scope.row,0)">已结算</el-button>
          </template>
        </el-table-column>
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
import { getRebateList, statusUpdate } from '../rebate';
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
        month: moment()
          .subtract(2, 'months')
          .format('YYYY-MM'),
        operatorName: ''
      }
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    query() {
      return Object.assign(this.searchData, this.$route.query);
    }
  },
  created() {
    if (this.getPerm('dal:rebate:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getRebateListData();
    }
  },
  methods: {
    async getRebateListData() {
      this.apiUrl = Api.REBATE_LIST;
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
    handleStatusUpdate(row, status) {
      let payload = { id: row.id, operatorName: row.operatorName, status: status };
      this.$confirm('确认更改结算状态?', '提示', {
        showClose: false
      }).then(() => {
        statusUpdate(payload).then(() => {
          this.$message.success('操作成功');
          this.getRebateListData();
        });
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      exportExcel(Api.REBATE_LIST_EXPORT, '运营商返利总览.xlsx', query);
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
