<template>
  <section v-if="getPerm('dal:money:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['财务管理', '提现记录']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="用户账号：">
            <el-input size="small" clearable v-model="searchData.userName"></el-input>
          </el-form-item>
          <el-form-item label="提现状态：">
            <el-select size="small" v-model="searchData.status" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="未结算" value="0"></el-option>
              <el-option label="已结算" value="1"></el-option>
              <el-option label="结算失败" value="2"></el-option>
              <el-option label="结算异常" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提现费率：">
            <el-select size="small" v-model="searchData.rate" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="(item, index) in rates" :key="index" :label="item | ratesTrans" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提现时间：">
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
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:money:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('dal:money:changeNew')" class="btn-add" icon="el-icon-sold-out" type="primary" :disabled="this.sels.length === 0" @click="payNow()">立即打款</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="694" class="my-table" @selection-change="selsChange">
            <el-table-column type="selection" :selectable="checkboxInit"></el-table-column>
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
            <el-table-column fixed prop="operatorName" label="用户账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="alipayAccount" label="支付宝账号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realName" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column label="提现金额" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="withdrawalPrice" label="服务费" show-overflow-tooltip></el-table-column>
            <el-table-column prop="rate" label="提现费率" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.rate | ratesTrans }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="提现时间" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderNo" label="订单号" width="220" show-overflow-tooltip></el-table-column>
            <el-table-column prop="aliPayId" label="阿里订单号" width="240" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="提现状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-popover ref="popover" trigger="hover" placement="bottom" v-if="scope.row.status === 3">
                  <el-button type="success" @click="handleTransfer(scope.row, 1)">设置提现状态为已结算</el-button><br />
                  <el-button type="danger" @click="handleTransfer(scope.row, 2)">设置提现状态为结算失败</el-button>
                  <div slot="reference" class="name-wrapper">
                    <span size="medium">
                      <span>{{ scope.row.status | formatterStatus }}</span>
                      <i class="el-icon-arrow-down"></i>
                    </span>
                  </div>
                </el-popover>
                <span v-else>{{ scope.row.status | formatterStatus }}</span>
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

    <!--////////////////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->

    <!--  拒绝结算 -->
    <el-dialog title="提现结算" size="tiny" :visible.sync="isShowRefuseDialog" @close="isShowRefuseDialog = false">
      <el-form label-width="96px">
        <el-form-item label="拒绝原因：">
          <el-input class="draw-textarea" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleRefuse()">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';

export default {
  name: 'page-with-draw',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      searchData: {
        //头部搜索
        userName: null,
        status: null,
        startTime: moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        time: [],
        rate: ''
      },
      dateTime: [],

      WithdrawData: {
        acctnum: '',
        status: '',
        date: ''
      },
      isShowWithdrawDialog: false,
      isShowRefuseDialog: false,
      id: null, // 提现id,
      //批量操作
      sels: [], //选中的值显示
      moneyIds: [],
      rates: []
    };
  },
  filters: {
    //店铺状态
    formatterStatus(val) {
      let statusType = {
        0: '未结算',
        1: '已结算',
        2: '结算失败',
        3: '结算异常'
      };
      return statusType[val];
    },
    ratesTrans: value => {
      return value / 1000 + '%';
    }
  },
  created() {
    // 判断用户是否有查看的权限
    if (this.getPerm('dal:money:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
      this.getMoneyList();
      this.getRatesList();
    }
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    //获取提现列表
    getMoneyList() {
      this.apiUrl = Api.MONEY_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    getRatesList() {
      this.$axios.post(Api.WITHDRAWAL_RATE_LIST).then(resp => {
        this.rates = resp.rates;
      });
    },
    // 根据条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    checkboxInit(row, index) {
      if (row.status == 0) return 1;
      //可勾选
      else return 0; //不可勾选
    },
    // 立即打款
    payNow() {
      this.$confirm('您确定要批量打款?', '确认').then(_ => {
        var moneyIds = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios
          .post(Api.MONEY_CHANGENEW, {
            ids: moneyIds
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '批量打款成功！',
              type: 'success'
            });
            this.getMoneyList();
          });
      });
    },
    handleTransfer(row, type) {
      this.$confirm('您确定要处理?', '确认').then(_ => {
        this.$axios
          .post(Api.PAYLIST_HANDLE_TRANSFER, {
            id: row.id,
            operatorId: row.operatorId,
            type: type
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '操作成功！',
              type: 'success'
            });
            this.getMoneyList();
          });
      });
    },
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.MONEY_EXPORT, '提现总览.xlsx', query);
        }
      });
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.draw-textarea {
  .el-textarea__inner {
    line-height: 3.5 !important;
  }
}
</style>
