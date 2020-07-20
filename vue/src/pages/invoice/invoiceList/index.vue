<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['发货管理', '发货单列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="钉钉审批编号" prop="dingtalkProcessId">
        <el-input clearable v-model.trim="searchData.dingtalkProcessId" size="small"></el-input>
      </el-form-item>
      <el-form-item label="商业属性" prop="businessAttribute">
        <el-select size="small" v-model="searchData.businessAttribute" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in businessType" v-if="id!=1" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="BD" prop="bdName">
        <el-input size="small" clearable v-model.trim="searchData.bdName"></el-input>
      </el-form-item>
      <el-form-item label="运营商" prop="operatorName">
        <el-input size="small" clearable v-model.trim="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="收货人" prop="receiver">
        <el-input size="small" clearable v-model.trim="searchData.receiver"></el-input>
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
      <div class="action-wraper">
        <button class="el-button el-button--primary" type="primary" @click="addInvoiceVisible=true" v-if="getPerm('dal:ship:add')">新增发货</button>
      </div>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dingtalkProcessId" label="钉钉审批编号" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name:'invoiceDetails',query:{id:scope.row.id}}" style="color:#409EFF">{{scope.row.dingtalkProcessId}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="erpShipNo" label="ERP发货单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shipTime" label="发货时间" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorName" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="receiver" label="收货人" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessAttribute" label="商业属性" :formatter="formatterBusinessType" show-overflow-tooltip></el-table-column>
        <el-table-column prop="moduleType" label="模块类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bdName" label="BD" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.bdName||'未认领'}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUserName" label="提交人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="提交时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <div class="table-action">
              <el-button v-if="getPerm('dal:rebate:edit')&&scope.row.businessAttribute===3" size="mini" @click="handleRebate(scope.row)">{{scope.row.status===0?'返利配置':'已配置'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
    <!--新增发货单-->
    <add-invoice v-if="addInvoiceVisible" :visible.sync="addInvoiceVisible" @getInvoiceListData="getInvoiceListData"></add-invoice>
    <!--新增发货单-->
    <rebate-set v-if="rebateSetVisible&&rebateInfo" :visible.sync="rebateSetVisible" :rebateInfo="rebateInfo" @getInvoiceListData="getInvoiceListData"></rebate-set>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import { businessType } from '@/utils/Mapping';
import { getInvocieList, getBDList, shipConfirm } from '../invoiceList';
import addInvoice from './addInvoice';
import rebateSet from './rebateSet';
import { exportExcel } from '@/utils/tool';
import User from '@/utils/User';

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
    addInvoice,
    rebateSet
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        dingtalkProcessId: '',
        bdName: '',
        operatorName: '',
        receiver: '',
        businessAttribute: ''
      },
      addInvoiceVisible: false,
      fullName: User.getData('fullName'),
      rebateSetVisible: false,
      rebateInfo: null
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    businessType() {
      return businessType;
    }
  },
  created() {
    if (this.getPerm('dal:ship:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getInvoiceListData();
    }
  },
  methods: {
    formatterBusinessType(row) {
      return businessType[row.businessAttribute];
    },
    async getInvoiceListData() {
      this.apiUrl = Api.SHIP_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      let res = await getInvocieList(this.apiUrl, this.apiParams);
      this.total = res.total;
      this.list = res.items;
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
    handleConfrim(row, cancel) {
      let payload = { shipOrderId: row.id, cancel: cancel };
      let confrimText = `<p class="invoice_confrim_info_title">你正在认领钉钉发货审批编号为${row.dingtalkProcessId || ''}的发货单</p><p>请核实无误后认领</p>`;
      let cancelText = `<p class="invoice_confrim_info_title">你即将撤销认领钉钉审批编号为${row.dingtalkProcessId || ''}批次的模块</p>`;
      this.$confirm(cancel === 0 ? confrimText : cancelText, '提示', {
        dangerouslyUseHTMLString: true,
        showClose: false
      }).then(() => {
        shipConfirm(payload).then(() => {
          this.$message.success('操作成功');
          this.getInvoiceListData();
        });
      });
    },
    handleRebate(row = {}) {
      this.rebateSetVisible = true;
      this.rebateInfo = row;
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.excel = true;
      exportExcel(Api.SHIP_LIST, '发货单总览.xlsx', query);
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
