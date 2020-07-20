<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '入库单', '入库详情']" />
    <!--表格-->
    <div class="tab-s">
      <ul class="item-ul">
        <li class="item-li">
          <div class="left-label" title="单据日期">
            单据日期: 
          </div>
          <div class="right-content" title="单据日期">
            {{inventoryData.createTime}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            入库单号: 
          </div>
          <div class="right-content">
            {{inventoryData.inventoryOrderNo}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            仓库: 
          </div>
          <div class="right-content">
            {{inventoryData.warehouseCode  + "-" + inventoryData.warehouseName}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            入库类别: 
          </div>
          <div class="right-content">
            {{inventoryData.inventoryOrderTypeName}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            业务类型: 
          </div>
          <div class="right-content">
            {{inventoryData.businessTypeName}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            属性: 
          </div>
          <div class="right-content">
            {{inventoryData.goodsAttribute == 20 ? "消耗品" : "资产"}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            供应商: 
          </div>
          <div class="right-content">
            {{inventoryData.companyCode + "-" + inventoryData.companyName}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            操作人: 
          </div>
          <div class="right-content">
            {{inventoryData.operator}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            操作时间: 
          </div>
          <div class="right-content">
            {{inventoryData.operationTime}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            备注: 
          </div>
          <div class="right-content">
             <el-input type="textarea" style="width:100%;padding-right: 6px;" v-model="inventoryData.remark" :disabled="true" ></el-input>
          </div>
        </li>
      </ul>

      <el-table v-show="inventoryData.goodsAttribute == 10" border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="存货名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsCode" label="存货编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkUnit(scope.row.unit)}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="入库数量" width="200" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-table v-show="inventoryData.goodsAttribute == 20" border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="存货名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsCode" label="存货编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
          <template slot-scope="scope">
            {{checkUnit(scope.row.unit)}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="入库数量" width="200" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="myAllNum">
        <span style="padding-left:12px;">
          总计
        </span>
        <span class="right-span">
          {{inventoryData.sumNum}}
        </span>
      </div>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { assetStatusType } from "@/utils/Mapping";
import {
  wareDetailFun,
  wareDetailApi,
  moreDetailFun
} from "../stock";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
  },
  data() {
    return {
      inventoryOrderId: "",
      inventoryData: {
        goodsAttribute: 10
      },
      list: [], // 数据
      total: 0,
      searchData: {
        "inventoryOrderId": "",
      },
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetStatusType() {
      return assetStatusType;
    },
  },
  created() {
    this.getAssetList();
    this.getAllAssetList();
    // if (this.getPerm("dal:ship:list")) {
    //   this.searchData = Object.assign(this.searchData, this.$route.query);
    //   this.getAssetList();
    // }
  },
  methods: {
    checkUnit(unit) {
      if(unit == 1) {
        return "台";
      }else if(unit == 2) {
        return "桶";
      }else {
        return unit;
      }
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
      this.getAllAssetList();
    },
    async getAssetList() {
      let par = Object.assign({}, this.page);
      par.inventoryOrderId = this.$route.query.id;
      let url = wareDetailApi + par.inventoryOrderId;


      let res = await wareDetailFun(url, par);

      this.inventoryData = res;
    },
    async getAllAssetList() {

      let par = Object.assign({}, this.page);
      par.inventoryOrderId = this.$route.query.id;
      let res = await moreDetailFun(par);
      this.total = res.total;
      this.list = res.items;
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
.item-ul {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  .item-li  {
    width: 33%;
    display: flex;
    flex-wrap: nowrap;
    padding: 16px 0;
    font-size: 16px;
    box-sizing: border-box;
    padding-right: 40px;
    .left-label {
      text-align: right;
      color: #606266;
      padding-right: 20px;
      width: 35%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .right-content {
      width: 65%;
      color: #909399;
      border-bottom: 1px solid #909399;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
    }
  }
}
.myAllNum {
  line-height: 58px;
  overflow: hidden;
  border: 1px solid #EBEEF5;
  .right-span{
    display: block;
    width: 190px;
    float: right;
  }
}
.right-content {
  /deep/ .el-textarea.is-disabled .el-textarea__inner{
    background: #fff;
    color: #909399;
  }
}
</style>
