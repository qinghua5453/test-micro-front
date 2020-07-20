<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['投放器管理', '投放器列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="洗衣液投放器名称" prop="name">
        <el-input clearable v-model.trim="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="deviceSn">
        <el-input clearable v-model.trim="searchData.deviceSn" size="small"></el-input>
      </el-form-item>
      <el-form-item label="所属设备" prop="machineName">
        <el-input clearable v-model.trim="searchData.machineName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺" prop="shopName">
        <el-input clearable v-model.trim="searchData.shopName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="运营商账号" prop="operatorName">
        <el-input size="small" clearable v-model.trim="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="soldState">
        <el-select size="small" v-model="searchData.soldState">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in tfqSoldStateType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道状态" prop="channelStatus">
        <el-select size="small" v-model="searchData.channelStatus">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in tfqChannelStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性" prop="deviceAttribute">
        <el-select size="small" v-model="searchData.deviceAttribute">
          <el-option label="不限" value></el-option>
          <el-option key="1" label="销售" value="1"></el-option>
          <el-option key="2" label="联营" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
        ></el-date-picker>
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
        <el-table-column prop="name" label="洗衣液投放器名称" show-overflow-tooltip min-width="100">
          <template slot-scope="scope">
            <span class="name-active" @click="lookDetail(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceSn" label="编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="machineName" label="所属设备" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orgName" label="所属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorUserName" label="运营商账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelStatus" label="通道状态">
          <template slot-scope="scope">
            <span v-if="scope.row.channelStatus && scope.row.channelStatus.length <= 0">-</span>
            <span v-else v-for="item in scope.row.channelStatus" :key="item">{{ item | channelStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="soldState" label="设备状态" show-overflow-tooltip>
          <template slot-scope="scope"> {{ scope.row.soldState | tfqSoldStateType }} <span v-if="scope.row.deviceWorkStatus">|</span> {{ scope.row.deviceWorkStatus | statusType }} </template>
        </el-table-column>
        <el-table-column prop="deviceAttribute" label="属性" show-overflow-tooltip>
          <template slot-scope="scope"> {{ scope.row.deviceAttribute == 1 ? "销售" : "联营"  }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" v-if="getPerm('mer:dispenser:device:update')" @click="handleEdit(scope.row)">
                <use xlink:href="#icon-document-edit" />
              </svg>
            </el-tooltip>
            <el-tooltip content="复位" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" v-if="getPerm('mer:dispenser:device:reset')" @click="handleDeviceReset(scope.row)">
                <use xlink:href="#icon-clockwise" />
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('mer:dispenser:device:valve')" content="启用" placement="top" effect="dark">
              <svg style="font-size: 30px;" v-if="scope.row.soldState === 1" class="icon weiixn-icon" aria-hidden="true" @click="updataeStatus(scope.row, 2)">
                <use xlink:href="#icon-kaiguanguan2-copy"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('mer:dispenser:device:valve')" content="停用" placement="top" effect="dark">
              <svg style="font-size: 30px;" v-if="scope.row.soldState === 2" class="icon weiixn-icon" aria-hidden="true" @click="updataeStatus(scope.row, 1)">
                <use xlink:href="#icon-kaiguanguan1"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" v-if="getPerm('mer:dispenser:device:delete')" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip>
            <el-tooltip content="桶自洁" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" v-if="getPerm('mer:dispenser:device:selfCleaning')" @click="handleDeviceTzj(scope.row)">
                <use xlink:href="#icon-tongzijie" />
              </svg>
            </el-tooltip>
            <el-tooltip content="恢复出厂值" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" v-if="getPerm('mer:dispenser:device:reduction')" @click="handleDeviceReduction(scope.row)">
                <use xlink:href="#icon-tuihui" />
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
    <!-- 编辑 -->
    <edit v-if="editDialogVisible" :visible.sync="editDialogVisible" :deviceId="deviceId" @getDispenserDeviceList="getDispenserDeviceList" />
    <!-- 详情 -->
    <detail v-if="detailDialogVisible" :visible.sync="detailDialogVisible" :deviceId="deviceId" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerMixin from "@/mixins/PagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { tfqStatusType, tfqChannelStatusType,tfqBindStatusType,tfqSoldStateType } from "@/utils/Mapping";
import { dispenserListApi, dispenserDeviceListFun, dispenserDelFun,dispenserResetFun,dispenserTzjFun,dispenserValveFun,dispenserReductionFun } from './dispenserDevice';

import { exportExcel } from "@/utils/tool";
import detail from './detail';
import edit from './edit';

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
    detail,
    edit
  },
  data() {
    return {
      list: [

      ], // 数据
      total: 0,
      //头部搜索
      searchData: {
        name: '',
        deviceSn: '',
        machineName: '',
        shopName: '',
        soldState:'',
        deviceWorkStatus:'',
        status:'',
        channelStatus:'',
        deviceAttribute: '',
        time: []
      },
      deviceId:'',
      editDialogVisible: false,
      detailDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    tfqStatusType() {
      return tfqStatusType;
    },
    tfqChannelStatusType() {
      return tfqChannelStatusType;
    },
    tfqBindStatusType() {
      return tfqBindStatusType;
    },
    tfqSoldStateType() {
      return tfqSoldStateType;
    },
  },
  filters: {
    channelStatus(value) {
      return tfqChannelStatusType[value];
    },
    statusType(value) {
      return tfqStatusType[value];
    },
    tfqBindStatusType(value) {
      return tfqBindStatusType[value];
    },
    tfqSoldStateType(value) {
      return tfqSoldStateType[value];
    },
  },
  created() {
    if (this.getPerm("mer:dispenser:device:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      if (this.searchData.startTime && this.searchData.endTime){
          this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
      this.getDispenserDeviceList();
    }
  },

  methods: {
    async getDispenserDeviceList() {
      this.apiUrl = dispenserListApi;
      let query = this.$route.query;
      this.setApiParams(query);
      let res = await dispenserDeviceListFun(this.apiUrl, this.apiParams);
      this.total = res.page.total;
      this.list = res.page.items;
    },
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query["t"] = +new Date();
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query = DataUtils.filter(query);
          this.$router.push({
            query: query
          });
        }
      });
    },
    handleEdit(row){
      this.deviceId = row.deviceId;
      this.editDialogVisible = true;
    },
    lookDetail(row){
      this.deviceId = row.deviceId;
      this.detailDialogVisible = true;
    },
    handleDeviceTzj(row) {
     this.$confirm(`确定筒自洁${row.name}?`,"提示", {
        showClose: false
      }).then(() => {
        dispenserTzjFun({ deviceId: row.deviceId }).then(() => {
          this.$message.success("筒自洁成功");
          this.getDispenserDeviceList();
        });
      });
    },
    handleDeviceReset(row) {
      this.$confirm(`确认复位${row.name}?`,"提示", {
        showClose: false
      }).then(() => {
        dispenserResetFun({ deviceId: row.deviceId }).then(() => {
          this.$message.success("复位成功");
          this.getDispenserDeviceList();
        });
      });
    },
    handleDeviceReduction(row) {
      this.$confirm(`确认恢复出厂值?`,"提示", {
        showClose: false
      }).then(() => {
        dispenserReductionFun({ deviceId: row.deviceId }).then(() => {
          this.$message.success("恢复出厂值成功");
          this.getDispenserDeviceList();
        });
      });
    },
    handleDelete(row) {
      this.$confirm('确定删除?', "提示", {
        dangerouslyUseHTMLString: true,
        showClose: false
      }).then(() => {
        dispenserDelFun({ deviceId: row.deviceId }).then(() => {
          this.$message.success("操作成功");
          this.getDispenserDeviceList();
        });
      });
    },
    updataeStatus(row,status) {
      let payload = Object.assign({}, { deviceId: row.deviceId, valve: status });
      dispenserValveFun(payload).then(() => {
        this.$message.success('操作成功');
        row.soldState = status;
        // setTimeout(() => {
        //   this.getDispenserDeviceList();
        // },1000)
      }).catch(() => {
        
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.startTime = query.time ? query.time[0] : null;
      query.endTime = query.time ? query.time[1] : null;
      query.excel = true;
      exportExcel(dispenserListApi, "投放器列表总览.xlsx", query);
    }
  },
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
