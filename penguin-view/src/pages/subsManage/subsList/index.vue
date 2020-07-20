<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['投放器管理', '分账配置']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="店铺名称：" prop="shopName">
        <el-input clearable v-model.trim="searchData.shopName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="运营商帐号：" prop="operatorName">
        <el-input clearable v-model.trim="searchData.operatorName" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="moreBtn" @click="addMyrate" v-if="getPerm('mer:dispenser:revenue:add')">新增配置</el-button>
      <el-button class="moreBtn" @click="changeMyshop" :disabled="!sels || sels.length == 0" v-if="getPerm('mer:dispenser:revenue:batch')">分账配置</el-button>
      <!-- <el-button class="moreBtn" @click="exportTable()">导出</el-button> -->
      <el-table border :data="list" ref="list" @selection-change="selsChange" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopAddress" label="店铺地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="shopType" label="店铺类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="proportion" label="运营商分账比例" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.proportion ? scope.row.proportion : 0}}%
          </template>
        </el-table-column>
        <el-table-column prop="operatorAccount" label="运营商帐号" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="分账配置" placement="top" effect="dark" v-if="getPerm('mer:dispenser:revenue:edit')">
              <svg class="icon" aria-hidden="true" @click="changeRates(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
      </div>
    </div>
    <!--新增配置-->
    <addRates v-if="visible" :visible.sync="visible" @submitAdd="submitAdds" :goodsId="goodsId" />

    <!--分账配置-->
    <changeRate v-if="isShowRateDialog" :visible.sync="isShowRateDialog" @submitChange="submitRates" :account="operatorAccount" :rateNum="rateNum" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";

import {
  subsListFun,
  changeRateFun,
  changeMoreRateFun,
} from "../subs";

import changeRate from "./changeRate";

import addRates from "./addRates";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    changeRate,
    addRates,
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "shopName": "",
        "operatorName": "",
        // "operatorName": "13576091630",
      },
      sels: [],
      selOrgs: [],
      goodsId: "",
      visible: false,
      isShowSetShopDialog: false,
      isShowRateDialog: false,
      isChangeMore: false,
      rateId: '',
      rateNum: null,
      operatorAccount: null,
      rules: {
        // 编辑的表单验证
        operatorName: [{ required: true, message: '请输入运营商帐号', trigger: 'change' }],
      }
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
  },
  created() {
      if (this.searchData.shopName || this.searchData.operatorName) {
        this.getAssetList()
      }
  },
  methods: {
    changeRates(item) {
      this.rateId = item.id;
      this.operatorAccount = item.operatorAccount;
      this.rateNum = item.proportion;
      this.isChangeMore = false;
      this.isShowRateDialog = true;
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    async getAssetList() {
      let par = Object.assign({}, this.page, this.searchData);
      if (this.getPerm("mer:dispenser:revenue:list")) {
        let res = await subsListFun(par);
        this.total = res.total;
        this.list = res.items;
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
        this.page.page = 1;
      }
      if (par && par.pageSize) {
        this.page.pageSize = par.pageSize;
      } else {
        this.page.pageSize = 30;
      }
      if (this.searchData.shopName || this.searchData.operatorName) {
        this.getAssetList();
      } else {
        this.$message.warning('请输入搜索条件后重试!');
      }
    },
    submitAdds(arr) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        element.orgId = element.id;
      }
      this.selOrgs = JSON.parse(JSON.stringify(arr));
      this.isChangeMore = true;
      this.rateId = '';
      this.operatorAccount = '';
      this.rateNum = null;
      
      this.isShowRateDialog = true;
    },
    submitRates(rate) {
      if (this.isChangeMore) {
        var arr = [];
        arr = this.selOrgs.map(item => {
          return item.orgId;
        })
        var par = {
          orgIds: arr,
          proportion: rate
        }
        changeMoreRateFun(par)
        .then(resp => {
          this.$message.success('修改成功');
          this.isShowRateDialog = false;
          if (this.searchData.shopName || this.searchData.operatorName) {
            this.getAssetList()
          }
        });
      } else {
        var par = {
          id: this.rateId,
          proportion: rate
        }
        changeRateFun(par)
        .then(resp => {
          this.$message.success('修改成功');
          this.isShowRateDialog = false;
          if (this.searchData.shopName || this.searchData.operatorName) {
            this.getAssetList()
          }
        });
      }
    },
    addMyrate() {
      this.isChangeMore = true;
      this.rateId = '';
      this.operatorAccount = '';
      this.rateNum = null;
      this.selOrgs = [];
      this.visible = true;
    },
    changeMyshop() {
      if (!this.sels || this.sels.length == 0) {
        this.$message.warning('请选择店铺后重试!');
        return false;
      }
      this.selOrgs = JSON.parse(JSON.stringify(this.sels));
      this.isChangeMore = true;
      this.rateId = '';
      this.operatorAccount = '';

      let rate = null;
      let isSame = true;
      for (let i = 0; i < this.selOrgs.length; i++) {
        const element = this.selOrgs[i];
        if (i == 0) {
          rate = element.proportion;
        } else {
          if (rate != element.proportion) {
            isSame = false;
          }
        }
      }
      if (isSame) {
        this.rateNum = rate;
      } else {
        this.rateNum = null;
      }
      
      this.isShowRateDialog = true;
    },
    exportTable() {
      let par = DataUtils.clone(this.searchData);
      par.excel = true;
      
      exportExcel(changeMoreRateFun, "分账配置列表.xlsx", par);
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
