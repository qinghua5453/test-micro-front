<template>
  <div class="page">
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="设备名称：" prop="machineName">
        <el-input clearable v-model.trim="searchData.machineName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="类别：" prop="categoryCode">
        <el-select size="small" v-model="searchData.categoryCode" placeholder="全部" @change="choseFirstType($event)">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in firstTypes" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号" prop="modelCode">
        <el-select size="small" v-model="searchData.modelCode" placeholder="全部" @change="changeSearchModelCode">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in subTypes" :key="item.modelCode" :label="item.modelName" :value="item.modelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通信类型：">
        <el-select v-model="searchData.type" size="small" placeholder="全部" @change="changeSearchtype">
          <el-option label="不限" value=""></el-option>
          <el-option label="串口" :value="1"></el-option>
          <el-option label="脉冲" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopName">
        <el-input size="small" clearable v-model.trim="searchData.shopName"></el-input>
      </el-form-item>
      <el-form-item label="运营商账号：" prop="operatorName">
        <el-input size="small" clearable v-model.trim="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="设备状态：" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="空闲" value="1"></el-option>
          <el-option label="预约" value="7"></el-option>
          <el-option label="使用中" value="2"></el-option>
          <el-option label="故障" value="4"></el-option>
          <el-option label="离线" value="8"></el-option>
          <el-option label="删除" value="9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微信支付：">
        <el-select v-model="searchData.wechat" size="small" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="未开通" value="0"></el-option>
          <el-option label="已开通" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IMEI：" prop="imei">
        <el-input clearable size="small" v-model.trim="searchData.imei"></el-input>
      </el-form-item>
      <el-form-item label="NQT：" prop="nqt">
        <el-input clearable size="small" v-model.trim="searchData.nqt"></el-input>
      </el-form-item>
      <el-form-item label="洗衣液" prop="isDetergent">
        <el-select size="small" v-model="searchData.isOpenDetergent" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="未开通" value="0"></el-option>
          <el-option label="开通" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附加功能" prop="extraFunction">
        <el-select size="small" v-model="searchData.extraFunction" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option label="无" :value="-1"></el-option>
          <el-option label="投放器" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间：">
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
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
      <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="machineName" label="设备名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="categoryName" label="类别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="modelName" label="型号" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="shopName" label="所属店铺" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operatorUserName" label="运营商" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="设备状态" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.deleteTime">删除</span>
          <span v-else>{{ scope.row.status | MachineStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="通信类型" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? '脉冲' : '串口' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="signals" label="信号值" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{ signalred: scope.row.signals < 18 }">{{ scope.row.signals }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wechat" label="微信支付" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.wechat == 0 ? '未开通' : '已开通' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bdName" label="BD" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isOpenDetergent" label="洗衣液" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.isOpenDetergent == 0 ? '未开通' : scope.row.isOpenDetergent == 1 ? '开通' : '' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="orderNum" label="订单数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="nqt" label="NQT" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="imei" label="IMEI" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="extraFunction" label="附加功能" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.extraFunctions || []" :key="index">{{ item === 0 ? '洗衣液投放器' : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="provinceName" label="省" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cityName" label="市" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="districtName" label="区" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope" v-if="scope.row.status != 9">
          <el-tooltip content="模块信息" placement="top" effect="dark">
            <i class="el-icon-document" @click="getModuleInfo(scope.row.imei)" style="color: #409EFF;font-size: 16px;"></i>
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
    <el-dialog title="模块信息" :visible.sync="moduleVisible" width="30%">
      <el-row>
        <el-col :span="12">
          <p>CCID：{{ ModuleInfo.ccid }}</p>
          <p>IMEI：{{ ModuleInfo.imei }}</p>
          <p>模块状态：{{ ModuleInfo.status | modelImeiStatus }}</p>
          <p>是否绑定：{{ ModuleInfo.bindStatus | modelBindStatus }}</p>
          <p>信号值：{{ ModuleInfo.signals }}</p>
          <p>公司：{{ ModuleInfo.company | MachineCompany }}</p>
        </el-col>
        <el-col :span="12">
          <p>IMEI版本号：{{ ModuleInfo.firmwareVersion }}</p>
          <p>阿里状态：{{ ModuleInfo.thirdStatus | MachineAliStatus }}</p>
          <p>计算状态：{{ ModuleInfo.computeStatus | modelComputeStatus }}</p>
          <p>网络：{{ ModuleInfo.network | netWorkStatus }}</p>
          <p>蓝牙：{{ ModuleInfo.supportBle | modelSupportStatus }}</p>
          <p>注册时间：{{ ModuleInfo.createTime }}</p>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moduleVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import QArea from '@/components/Area';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import { MachineStatus, PayType, MachineCompany, MachineAliStatus, modelSupportStatus, modelBindStatus, modelComputeStatus, modelImeiStatus, netWorkStatus } from '@/utils/Mapping';
export default {
  mixins: [PagerMixin],
  components: {
    QArea
  },
  data() {
    return {
      list: [], // 数据
      total: 0,

      //头部搜索
      searchData: {
        machineName: '',
        categoryCode: '',
        modelCode: '',
        shopName: '',
        operatorName: '',
        isOpenDetergent: '',
        nqt: '',
        imei: '',
        status: '',
        wechat: '',
        startTime: '',
        endTime: '',
        type: '',
        time: []
      },
      firstTypes: [],
      subTypes: [],
      moduleVisible: false,
      ModuleInfo: {}
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
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
    },
    MachineStatus(val) {
      return MachineStatus[val];
    }
  },
  created() {
    this.geFirstType();
    this.getMachineList();
    this.searchData = Object.assign(this.searchData, this.$route.query);
    // 时间转换
    if (this.searchData.startTime && this.searchData.endTime) {
      this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
    }
  },
  methods: {
    //获取一级类型配置列表
    geFirstType() {
      this.$axios.post(Api.CLOUD_CATEGORY).then(res => {
        this.firstTypes = res;
      });
    },
    //获取二级类型配置列表
    getMachineStairs(categoryCode) {
      let query = { categoryCode: categoryCode };
      this.$axios.post(Api.CLOUD_SUB_CATEGORY, query).then(res => {
        this.subTypes = res;
      });
    },
    //当选择一级类型之后触发 获取二级类型
    choseFirstType(val) {
      if (val) {
        this.getMachineStairs(val);
      }
    },
    changeSearchModelCode(val) {
      this.searchData.type = val !== '' ? 1 : this.searchData.type;
    },
    changeSearchtype(val) {
      this.searchData.modelCode = val === 1 ? this.searchData.modelCode : val === 0 ? '' : this.searchData.modelCode;
    },
    getMachineList() {
      this.apiUrl = Api.CLOUD_MACHINE_LIST;
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
    getModuleInfo(imei) {
      this.$axios.post(Api.CLOUD_MODULE_LIST, { imei: imei }).then(res => {
        this.moduleVisible = true;
        this.ModuleInfo = res.items[0] || {};
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.signalred {
  color: #f54949;
}
/deep/ .el-row p {
  line-height: 32px;
}
</style>
