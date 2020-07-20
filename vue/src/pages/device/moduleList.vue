<template>
  <div class="page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['设备管理', '模块列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="IMEI：" prop="imei">
        <el-input clearable v-model.trim="searchData.imei" size="small"></el-input>
      </el-form-item>
      <el-form-item label="阿里状态" prop="thirdStatus">
        <el-select size="small" v-model="searchData.thirdStatus" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in MachineAliStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in modelImeiStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计算状态" prop="computeStatus">
        <el-select size="small" v-model="searchData.computeStatus" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in modelComputeStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否绑定" prop="bindStatus">
        <el-select size="small" v-model="searchData.bindStatus" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in modelBindStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-select size="small" v-model="searchData.company" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in MachineCompany" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CCID" prop="ccid">
        <el-input size="small" clearable v-model.trim="searchData.ccid"></el-input>
      </el-form-item>
      <el-form-item label="网络" prop="network">
        <el-select size="small" v-model="searchData.network" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in netWorkStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="蓝牙" prop="isBle">
        <el-select size="small" v-model="searchData.isBle" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="不支持" value="0"></el-option>
          <el-option label="支持" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="洗衣液" prop="isDetergent">
        <el-select size="small" v-model="searchData.isDetergent" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="不支持" value="0"></el-option>
          <el-option label="支持" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间：">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column fixed prop="ccid" label="CCID" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="firmwareVersion" label="IMEI版本号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imei" label="IMEI" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="thirdStatus" label="阿里状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.thirdStatus | MachineAliStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="模块状态" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.status | modelImeiStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="computeStatus" label="计算状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.computeStatus | modelComputeStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bindStatus" label="是否绑定" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.bindStatus | modelBindStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signals" label="信号值" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{signalred:scope.row.signals < 18}">{{scope.row.signals}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="network" label="网络" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.network | netWorkStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supportBle" label="蓝牙" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.supportBle | modelSupportStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" label="公司" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.company | MachineCompany}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supportDetergent" label="洗衣液" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.supportDetergent | modelSupportStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="regTime" label="注册时间" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-tooltip content="IOT日志" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="openIOTModle(scope.row.imei)">
                <use xlink:href="#icon-shenhe"></use>
              </svg>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
    <!--IOT日志-->
    <IOT :visible.sync="isShowSetShopDialog" v-if="isShowSetShopDialog" :imei="iotLogId"></IOT>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import QArea from '@/components/Area';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import { MachineCompany, MachineAliStatus, modelSupportStatus, modelBindStatus, modelComputeStatus, modelImeiStatus, netWorkStatus } from '@/utils/Mapping';
import IOT from './IOT.vue';
export default {
  mixins: [PagerMixin],
  components: {
    QArea,
    QBreadcrumb,
    IOT
  },
  data() {
    return {
      list: [], // 数据
      total: 0,

      //头部搜索
      searchData: {
        imei: '',
        thirdStatus: '',
        status: '',
        computeStatus: '',
        bindStatus: '',
        company: '',
        ccid: '',
        network: '',
        isBle: '',
        isDetergent: '',
        regStartTime: '',
        regEndTime: '',
        time: []
      },
      firstTypes: [],
      subTypes: [],
      moduleVisible: false,
      ModuleInfo: {},
      iotLogId: '',
      isShowSetShopDialog: false
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    MachineAliStatus() {
      return MachineAliStatus;
    },
    modelImeiStatus() {
      return modelImeiStatus;
    },
    modelComputeStatus() {
      return modelComputeStatus;
    },
    modelBindStatus() {
      return modelBindStatus;
    },
    MachineCompany() {
      return MachineCompany;
    },
    modelSupportStatus() {
      return modelSupportStatus;
    },
    netWorkStatus() {
      return netWorkStatus;
    }
  },
  filters: {
    modelSupportStatus(val) {
      return modelSupportStatus[val];
    },
    modelBindStatus(val) {
      return modelBindStatus[val];
    },
    modelComputeStatus(val) {
      return modelComputeStatus[val];
    },
    MachineAliStatus(val) {
      return MachineAliStatus[val];
    },
    MachineCompany(val) {
      return MachineCompany[val];
    },
    modelImeiStatus(val) {
      return modelImeiStatus[val];
    },
    netWorkStatus(val) {
      return netWorkStatus[val];
    }
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:module:list')) {
      this.getModuleList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.regStartTime && this.searchData.regEndTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    getModuleList() {
      this.apiUrl = Api.CLOUD_MODULE_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      return this.$axios.post(this.apiUrl, this.apiParams).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    //根据搜索条件查询设备列表
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.regStartTime = query.time ? query.time[0] : null;
          query.regEndTime = query.time ? query.time[1] : null;
          query.time = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    //iot日志
    openIOTModle(id) {
      this.iotLogId = id;
      this.isShowSetShopDialog = true;
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.signalred {
  color: #f54949;
}
</style>
