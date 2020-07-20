<template>
  <section v-if="getPerm('dal:money:payList')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['财务管理', '打款记录']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="支付宝账号：">
            <el-input size="small" clearable v-model="searchData.alipay"></el-input>
          </el-form-item>
          <el-form-item label="运营商账号：">
            <el-select style="width:100%;" size="small" v-model="searchData.operatorName" filterable remote clearable :remote-method="getopterList" @change="getopterId" placeholder="请选择">
              <el-option v-for="item in selectItem" :key="item.id" :label="item.userName" :value="item.userName"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打款信息" prop="type">
            <el-select size="small" v-model="searchData.type" placeholder="不限">
              <el-option label="不限" value></el-option>
              <el-option label="运营商提现" :value="1"></el-option>
              <el-option label="服务费" :value="2"></el-option>
              <el-option label="模块流量费" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打款时间：">
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
          <el-form-item v-if="getPerm('dal:money:payExcel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="740" class="my-table">
            <el-table-column fixed label="序号" width="52" type="index" :index="indexMethod" show-overflow-tooltip> </el-table-column>
            <el-table-column fixed prop="alipayAccount" min-width="150" label="支付宝账号" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="alipayRealName" label="支付宝名称" min-width="160" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="aliOrderId" label="支付宝转账订单号" min-width="140" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="operatorName" label="运营商账号" min-width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="remark" label="打款信息" min-width="140" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="amount" label="打款金额" min-width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createTime" label="打款时间" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="msg" label="打款状态" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.msg === 'Success' ? '成功' : '失败' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="错误信息" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.subMsg != '' ? scope.row.subMsg : '---' }}</span>
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

export default {
  name: 'page-with-draw',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      searchData: {
        //头部搜索
        alipay: null,
        operatorId: null,
        startTime: null,
        endTime: null,
        time: null,
        operatorName: null,
        type:null,
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
      selectItem: [] // 获取运营商列表信息
    };
  },
  created() {
    // 判断用户是否有查看的权限
    if (this.getPerm('dal:money:payList')) {
      this.getMoneyList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },

    // 获取运营商账号列表
    async getopterList(keywords) {
      if (keywords === '') {
        let resp = await this.$axios.post(Api.OPERATOR_NAME);
      } else {
        let resp = await this.$axios.post(Api.OPERATOR_NAME, {
          name: keywords
        });
        this.selectItem = resp || [];
      }
    },

    //获取提现列表
    getMoneyList() {
      this.apiUrl = Api.MONEY_PAYLIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    getopterId(index) {
      //解决输入运营商账号查询后，再刷新页面，搜索框中的运营商账号变成ID了
      let pic = this.selectItem.find(item => item.userName === index);
      this.searchData.operatorId = pic ? pic.id : index;
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

    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.PAYLIST_EXPORT, '打款总览.xlsx', query);
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
