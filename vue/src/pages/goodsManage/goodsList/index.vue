<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['商品管理', '商品列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="设备名称：" prop="name">
        <el-input clearable v-model="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="设备编号：" prop="deviceSn">
        <el-input clearable v-model="searchData.deviceSn" size="small"></el-input>
      </el-form-item>
      <el-form-item label="IMEI：" prop="imei">
        <el-input clearable size="small" v-model="searchData.imei"></el-input>
      </el-form-item>
      <el-form-item label="NQT：" prop="code">
        <el-input clearable size="small" v-model="searchData.code"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="orgName">
        <el-input size="small" clearable v-model="searchData.orgName"></el-input>
      </el-form-item>
      <el-form-item label="设备类型：" prop="baseCategoryId">
        <el-select size="small" v-model="searchData.baseCategoryId" placeholder="不限" @change="changeCategory">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号：" prop="categoryId">
        <el-select size="small" v-model="searchData.categoryId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in modelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属浴室：" prop="positionName">
        <el-input clearable size="small" v-model="searchData.positionName"></el-input>
      </el-form-item>
      <el-form-item label="通讯类型：" prop="communicationType">
        <el-select size="small" style="width:100%;" v-model="searchData.communicationType" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option label="串口" value="1"></el-option>
          <el-option label="脉冲" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态：" prop="deviceWorkStatus">
        <el-select size="small" v-model="searchData.deviceWorkStatus" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option label="空闲" value="10"></el-option>
          <el-option label="工作中" value="20"></el-option>
          <el-option label="故障" value="30"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网络状态：" prop="computeStatus">
        <el-select size="small" v-model="searchData.computeStatus" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in networkSearchStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式：" prop="supportedPayType">
        <el-select size="small" v-model="searchData.supportedPayType" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option label="支付宝" value="1"></el-option>
          <el-option label="余额支付 " value="2"></el-option>
          <el-option label="微信支付" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司：" prop="company">
        <el-select size="small" v-model="searchData.company" placeholder="不限">
          <el-option label="不限" value=""></el-option>
          <el-option label="慧人" value="huiren"></el-option>
          <el-option label="有方" value="youfang"></el-option>
          <el-option label="合宙" value="hezhou"></el-option>
          <el-option label="企鹅" value="qiekj"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间：">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item>
        <a class="el-button" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <!-- <el-button type="primary" class="moreBtn" @click="changeMyshop" :disabled="!sels || sels.length == 0">更换所在浴室</el-button> -->
      <!-- <el-button type="primary" class="moreBtn" @click="changeMyposition" :disabled="!sels || sels.length == 0">更换所在浴室</el-button> -->
      <el-button type="primary" class="moreBtn" @click="delMoreGoods" :disabled="!sels || sels.length == 0">删除</el-button>
      <el-table border :data="list" ref="list" @selection-change="selsChange" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orgName" label="所属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column prop="positionName" label="所属浴室" show-overflow-tooltip></el-table-column>
        <el-table-column prop="baseCategoryName" label="设备类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="categoryName" label="设备型号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operatorUserName" label="运营商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceSn" label="设备编号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="communicationType" label="通信类型" :formatter="formatterComType" show-overflow-tooltip></el-table-column>
        <el-table-column prop="company" label="公司" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="NQT" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imei" label="IMEI" show-overflow-tooltip></el-table-column>
        <el-table-column prop="firmwareVersion" label="模块版本号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supportedPayType" label="支付方式" :formatter="formatterType" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceWorkStatus" label="设备状态" :formatter="formatterStatus" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="computeStatus" label="网络状态" :formatter="formatterNetStatus" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signals" label="信号值" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{signalred:scope.row.signals < 18}">{{scope.row.signals}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bd" label="BD" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provinceName" label="省" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cityName" label="市" show-overflow-tooltip></el-table-column>
        <el-table-column prop="districtName" label="区" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="editGoods(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip>
            <el-tooltip content="日志" placement="top" effect="dark" v-if="scope.row.imei">
              <svg class="icon" aria-hidden="true" @click="operatingLog(scope.row)">
                <use xlink:href="#icon-mydetail"></use>
              </svg>
              <!-- <i class="el-icon-document-checked" style="font-size: 20px;color: #1296db;vertical-align: top;" @click="operatingLog(scope.row)"></i> -->
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
    </div>
    <!--新增/编辑-->
    <editGoods v-if="visible" :visible.sync="visible" @submitSearch="goSearchList" :goodsId="goodsId" />

    <!--更换店铺-->
    <changeShop v-if="isShowShopDialog" :visible.sync="isShowShopDialog" @submitChange="changeOrg" :orgName="orgName" :orgId="orgId" />

    <!--更换浴室-->
    <changePosition v-if="isShowPositionDialog" :visible.sync="isShowPositionDialog" @submitChange="changePos" />

    <!--IOT日志-->
    <IOT :visible.sync="isShowSetShopDialog" v-if="isShowSetShopDialog" :imei="iotLogId"></IOT>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { assetCurStatusType,networkSearchStatus,MachineStatus } from "@/utils/Mapping";

import {
  getCategoryFun,
  getModelFun,
  goodsListFun,
  delGoodsFun,
  delMoreGoodsFun,
  changeFun,
  goodsListApi,
  goodsTypeListFun
} from "../goods";

import changePosition from "./changePosition";
import changeShop from "./changeShop";
import editGoods from "./editGoods";
import IOT from '../../device/IOT.vue';

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    changePosition,
    changeShop,
    editGoods,
    IOT
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "name": "",
        "deviceSn": "",
        "imei": "",
        "code": "",
        "orgName": "",
        "baseCategoryId": "",
        "categoryId": "",
        "positionName": "",
        "communicationType": "",
        "deviceWorkStatus": "",
        "computeStatus": "",
        "supportedPayType": "",
        "company": "",
        "time": [],
        "startTime": "",
        "endTime": "",
      },
      sels: [],
      categoryOptions: [],
      modelOptions: [],
      goodsId: "",
      visible: false,
      isShowSetShopDialog: false,
      isShowShopDialog: false,
      isShowPositionDialog: false,
      iotLogId: '',
      orgId: '',
      orgName: ''
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetCurStatusType() {
      return assetCurStatusType;
    },
    networkSearchStatus() {
      return networkSearchStatus;
    },
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getCategory();
    // }
  },
  methods: {
    async getCategory() {
      let par = {
      }
      let res = await getCategoryFun(par);
      this.categoryOptions = res;
    },
    async getModel(code) {
      var par = {
        categoryCode: code,
        pageNum: 1,
        page: 1,
        pageSize: 1000
      }
      let res = await goodsTypeListFun(par);
      this.modelOptions = res.items;
    },
    // 网络状态
    formatterNetStatus(row, column) {
      return networkSearchStatus[row.computeStatus];
    },
    formatterComType(row, column) {
      if (row.communicationType == 1) {
        return '串口'
      } else if (row.communicationType == 0) {
        return '脉冲'
      } else  {
        return '未知'
      }
    },
    // 设备状态
    formatterStatus(row, column) {
      if (row.deviceWorkStatus == 10) {
        return '空闲'
      } else if (row.deviceWorkStatus == 20) {
        return '工作中'
      }  else if (row.deviceWorkStatus == 30) {
        return '故障'
      }
    },
    //支付方式
    formatterType(row, column) {
      if (!row.supportedPayType) return '';
      let typeArr = row.supportedPayType.split(',');
      return typeArr.join(' ');
    },
    changeCategory() {
      this.searchData.categoryId = "";
      this.modelOptions = [];
      if (this.searchData.baseCategoryId) {
        for (let i = 0; i < this.categoryOptions.length; i++) {
          const element = this.categoryOptions[i];
          if (element.id == this.searchData.baseCategoryId) {
            this.getModel(element.code);
            break;
          }
        }
      }
    },
    editGoods(item) {
      this.goodsId = item.goodsId;
      this.visible = true;
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    async getAssetList() {
      
      let par = Object.assign({}, this.page, this.searchData);
      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;
      let res = await goodsListFun(par);
      this.total = res.total;
      this.list = res.items;
    },
    addType() {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },

    goSearchList(par) {
      if (par && par.pageNum) {
        this.page.pageNum = par.pageNum;
        this.page.page = par.pageNum;
      } else {
        this.page.pageNum = 1;
        this.page.page = 1
      }
      if (par && par.pageSize) {
        this.page.pageSize = par.pageSize;
      } else {
        this.page.pageSize = 30;
      }
      this.getAssetList();
    },
    delMoreGoods(row) {
      if (!this.sels || this.sels.length == 0) {
        this.$message.warning('请选择商品后重试!');
        return false;
      }
      var arr = [];
      arr = this.sels.map(item => {
        return item.goodsId;
      })
      this.$confirm('您确定批量删除商品吗？', '提示').then(() => {
        delMoreGoodsFun( {
            id: String(arr)
          })
          .then(resp => {
            this.$message.success('删除成功');
            this.getAssetList();
          });
      });
    },
    handleDelete(row) {
      this.$confirm('您确定删除该商品吗？', '提示').then(() => {
        delGoodsFun( {
            id: row.goodsId
          })
          .then(resp => {
            this.$message.success('删除成功');
            this.getAssetList();
          });
      });
    },
    operatingLog(row) {
      this.iotLogId = row.imei;
      this.isShowSetShopDialog = true;
    },
    changePos(positionId) {
      var arr = [];
      arr = this.sels.map(item => {
        return item.goodsId;
      })
      var par = {
        id: String(arr),
        positionId: positionId
      }
      changeFun(par)
      .then(resp => {
        this.$message.success('修改成功');
        this.isShowPositionDialog = false;
        this.getAssetList();
      });
    },
    changeOrg(obj) {
      var arr = [];
      arr = this.sels.map(item => {
        return item.goodsId;
      })
      var par = {
        id: String(arr),
        orgId: obj.orgId,
        positionId: obj.positionId,
      }
      // console.log(par);
      changeFun(par)
      .then(resp => {
        this.$message.success('修改成功');
        this.isShowShopDialog = false;
        this.getAssetList();
      });
    },
    changeMyposition() {
      if (!this.sels || this.sels.length == 0) {
        this.$message.warning('请选择商品后重试!');
        return false;
      }
      this.isShowPositionDialog = true;
    },
    changeMyshop() {
      if (!this.sels || this.sels.length == 0) {
        this.$message.warning('请选择商品后重试!');
        return false;
      }
      this.orgId = '';
      this.orgName = '';
      let oneOrgId = null;
      let oneOrgName = null;
      let isSame = true;
      for (let i = 0; i < this.sels.length; i++) {
        const element = this.sels[i];
        if (element.baseCategoryId != 9) {
          this.$message.warning('请选择设备类型为“淋浴”的商品!');
          return false;
        }
        if (i == 0) {
          oneOrgId = element.orgId;
          oneOrgName = element.orgName;
        } else {
          if (oneOrgId != element.orgId) {
            isSame = false;
          }
        }
      }
      if (isSame) {
        this.orgId = oneOrgId;
        this.orgName = oneOrgName;
      } else {
        this.orgId = '';
        this.orgName = '';
      }
      this.isShowShopDialog = true;
    },
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;
      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;
      exportExcel(goodsListApi, "投放器列表总览.xlsx", par);
    },
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
.moreBtn {
  margin-bottom: 12px;
}
</style>
