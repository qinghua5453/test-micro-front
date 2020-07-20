<template>
  <div class="page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['发货管理', '发货明细']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="钉钉审批编号" prop="dingtalkProcessId">
        <el-input clearable v-model.trim="searchData.dingtalkProcessId" size="small"></el-input>
      </el-form-item>
      <el-form-item label="IMEI" prop="imei">
        <el-input clearable v-model.trim="searchData.imei" size="small"></el-input>
      </el-form-item>
      <el-form-item label="BD" prop="bdName">
        <el-input clearable v-model.trim="searchData.bdName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="是否绑定" prop="bindStatus">
        <el-select size="small" v-model="searchData.bindStatus">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in modelBindStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓储状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in warehouseStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间：">
        <el-date-picker
          size="small"
          v-model="searchData.time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="退货时间：">
        <el-date-picker
          size="small"
          v-model="searchData.returnTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
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
        <button class="el-button el-button--primary" type="primary" @click="addInvoiceVisible = true" v-if="getPerm('dal:ship:return')">导入退货</button>
      </div>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dingtalkProcessId" label="钉钉审批编号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="erpShipNo" label="ERP发货单号" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imei" label="IMEI号" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessAttribute" label="商业属性" :formatter="formatterBusinessType" show-overflow-tooltip></el-table-column>
        <el-table-column prop="thirdStatus" label="阿里状态" :formatter="formatterMachineAliStatus" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bindStatus" label="是否绑定" :formatter="formatterModelBindStatus" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signals" label="信号值" show-overflow-tooltip></el-table-column>
        <el-table-column prop="network" label="网络" :formatter="formatterNetWorkStatus" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supportBle" label="蓝牙" :formatter="formatterModelSupportStatus" show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="公司" :formatter="formatterMachineCompany" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceTime" label="入驻时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bdName" label="BD" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorName" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shipTime" label="发货时间" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="returnTime" label="退货时间" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="仓储状态" :formatter="formatterWrehouseStatusType" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
    <!--新增发货单-->
    <return-invoice :visible.sync="addInvoiceVisible" v-if="addInvoiceVisible" @getInvoiceDetailsList="getInvoiceDetailsList"></return-invoice>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import { businessType, warehouseStatusType, MachineCompany, MachineAliStatus, modelSupportStatus, modelBindStatus, netWorkStatus } from '@/utils/Mapping';
import { exportExcel } from '@/utils/tool';
import { getShipDetails, getBDList } from '../invoiceList';
import returnInvoice from './returnInvoice';
export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
    returnInvoice
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        dingtalkProcessId: '',
        imei: '',
        bdName: '',
        status: '',
        time: [],
        returnTime: [],
      },
      addInvoiceVisible: false
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    businessType() {
      return businessType;
    },
    modelBindStatus() {
      return modelBindStatus;
    },
    warehouseStatusType() {
      return warehouseStatusType;
    }
  },
  filters: {
    businessType(val) {
      return businessType[val];
    },
    warehouseStatusType(val) {
      return warehouseStatusType[val];
    }
  },
  created() {
    if (this.getPerm('dal:ship:list')) {
      this.getInvoiceDetailsList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      if (this.searchData.startTime && this.searchData.endTime||this.searchData.startReturnTime && this.searchData.endReturnTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
        this.searchData.returnTime = [this.searchData.startReturnTime, this.searchData.endReturnTime];
      }
    }
  },
  methods: {
    formatterMachineAliStatus(row) {
      return MachineAliStatus[row.thirdStatus];
    },
    formatterModelBindStatus(row) {
      return modelBindStatus[row.bindStatus];
    },
    formatterNetWorkStatus(row) {
      return netWorkStatus[row.network];
    },
    formatterModelSupportStatus(row) {
      return modelSupportStatus[row.supportBle];
    },
    formatterMachineCompany(row) {
      return MachineCompany[row.company];
    },
    formatterBusinessType(row) {
      return businessType[row.businessAttribute];
    },
    formatterWrehouseStatusType(row) {
      return warehouseStatusType[row.status];
    },
    async getInvoiceDetailsList() {
      this.apiUrl = Api.SHIP_DETAILS;
      let query = this.$route.query;
      this.setApiParams(query);
      let res = await getShipDetails(this.apiUrl, this.apiParams);
      this.total = res.total;
      this.list = res.items;
    },
    //根据搜索条件查询设备列表
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.startReturnTime = query.returnTime ? query.returnTime[0] : null;
          query.endReturnTime = query.returnTime ? query.returnTime[1] : null;
          query.time = null;
          query.returnTime = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.startTime = query.time ? query.time[0] : null;
      query.endTime = query.time ? query.time[1] : null;
      query.startReturnTime = query.returnTime ? query.returnTime[0] : null;
      query.endReturnTime = query.returnTime ? query.returnTime[1] : null;
      query.time = null;
      query.returnTime = null;
      query.excel = true;
      exportExcel(Api.SHIP_DETAILS, '发货明细总览.xlsx', query);
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
</style>
