<template>
  <el-dialog class="dialog-shop" title="新增配置" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1000px">
      <div class="invoice">
      <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
        <el-form-item label="店铺名称：" prop="shopName">
          <el-input size="small" clearable v-model="searchData.shopName"></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <q-area v-model="searchData.areaIds" size="small" default-option="不限" />
        </el-form-item>
        <el-form-item label="运营商账号：" prop="operatorName">
          <el-input clearable size="small" v-model="searchData.operatorName"></el-input>
        </el-form-item>
        <el-form-item>
          <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
        </el-form-item>
      </el-form>
      <!--表格-->
      <div class="tab-s">
        <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="503" class="my-table" @selection-change="selsChange">
          <el-table-column type="selection" :selectable="selectable">
          </el-table-column>
          <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="店铺地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopType" label="店铺类型" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="operatorAccount" label="运营商帐号" show-overflow-tooltip></el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
          <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click.native="submitForm('ruleForm')">确定</el-button>
      <el-button @click.native="modalClose">取消</el-button>
    </div>
  </el-dialog>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import { exportExcel } from "@/utils/tool";
import QArea from '@/components/Area';

import {
  shopListFun,
} from "../subs";

export default {
  components: {
    QArea,
  },
  mixins: [PagerTmixin],
  props: ['billsId', 'visible'],
  data() {
    return {
      sels: [],
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "operatorName": "",
        "shopName": "",
        areaIds: [],
      },
      totalData: {},
      allShops: [],
      filterOptions: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
  },
  created() {
    this.getList();
  },
  methods: {
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    selectable (row, index) {
        return row.status != 1 // isHidden 0-否 1-是 返回false不可选
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getList() {
      let par = Object.assign({}, this.page, this.searchData);
      // 地区转换
      par.provinceId = par.areaIds ? par.areaIds[0] : null;
      par.cityId = par.areaIds ? par.areaIds[1] : null;
      par.districtId = par.areaIds ? par.areaIds[2] : null;
      par.areaIds = null;

      let res = await shopListFun(par);
      this.total = res.total;
      this.list = res.items;
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
      this.getList();
    },
    submitForm(formName) {
      if (this.sels && this.sels.length > 0) {
        this.$emit("submitAdd",this.sels);
        this.$emit('update:visible', false); // 直接修改父组件的属性
      } else {
        this.$message.warning('请选择店铺后重试!');
      }
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
.moreBtn {
  margin-bottom: 12px;
}
</style>
