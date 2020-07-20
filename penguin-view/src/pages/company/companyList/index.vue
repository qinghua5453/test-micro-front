<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['供应商管理', '供应商列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <!-- <el-form-item label="关键字" prop="keywords">
        <el-input clearable v-model.trim="searchData.keywords" size="small"></el-input>
      </el-form-item> -->
      <el-form-item label="供应商编码" prop="code">
        <el-input clearable v-model.trim="searchData.code" size="small"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称" prop="name">
        <el-input clearable v-model.trim="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input clearable v-model.trim="searchData.contact" size="small"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input clearable v-model.trim="searchData.tel" size="small"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in companystatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="厂商类型" prop="type">
        <el-select size="small" v-model="searchData.type" placeholder="全部">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in companyType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goCheckList">查询</a>
      </el-form-item>
      <!-- <el-form-item>
        <a class="el-button" @click="exportTable()">导出</a>
      </el-form-item> -->
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="el-icon-circle-plus btn-add" @click="handlebatchUpdateNo" v-if="getPerm('mer:company:add')">新增供应商</el-button>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="供应商编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="供应商名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="详细地址" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contact" label="联系人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="联系电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contact" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark" v-if="getPerm('mer:company:edit')">
              <svg class="icon" aria-hidden="true" @click="operatingLog(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark" v-if="getPerm('mer:company:delete')">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip>
            <el-tooltip content="启用" placement="top" effect="dark">
              <svg style="font-size: 30px;" v-if="scope.row.status" class="icon weiixn-icon" aria-hidden="true" @click="handleScrapAsset(scope.row, true)">
                <use xlink:href="#icon-kaiguanguan2-copy"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="停用" placement="top" effect="dark">
              <svg style="font-size: 30px;" v-if="!scope.row.status" class="icon weiixn-icon" aria-hidden="true" @click="handleScrapAsset(scope.row, false)">
                <use xlink:href="#icon-kaiguanguan1"></use>
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
    <!--新增/编辑-->
    <addCompany v-if="visible" :visible.sync="visible" @submitSearch="getCompanyList" :companyid="companyId" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { companystatus,companyType } from "@/utils/Mapping";
import {
  companyListApi,
  companyListFun,
  changeStatusFun,
  companyEditFun,
  companyDelFun
} from "../company";

import addCompany from "./addCompany";

export default {
  mixins: [PagerTmixin],
  components: {
    QBreadcrumb,
    addCompany
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "keywords": "",
        "status": "",
        "type": "10",
        "code": "",
        "name": "",
        "contact": "",
        "tel": "",
      },
      visible:false,
      companyId:'',
      allList: [],
      checkedList: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    companystatus() {
      return companystatus;
    },
    companyType() {
      return companyType;
    },
  },
  created() {
    // this.getCompanyList();
    if (this.getPerm("mer:company:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getCompanyList();
    }
  },
  methods: {
    async getCompanyList() {
      this.apiUrl = companyListApi;
      let query = Object.assign(this.searchData, this.page);
      let res = await companyListFun(this.apiUrl, query);
      this.allList = res;
      this.list = res;
      this.checkedList = res;
      this.total = this.list.length;
    },
    goCheckList() {
      let arr = [];
      for (let i = 0; i < this.allList.length; i++) {
        const item = this.allList[i];
        let checked1 = this.checkItem(item,this.searchData.code ,'code');
        let checked2 = this.checkItem(item,this.searchData.name ,'name');
        let checked3 = this.checkItem(item,this.searchData.contact ,'contact');
        let checked4 = this.checkItem(item,this.searchData.tel ,'tel');
        if (checked1 && checked2 && checked3 && checked4) {
          arr.push(item);
        }
      }
      this.checkedList = arr;
      this.total = this.checkedList.length;
      this.page = {
        pageNum: 1,
        page: 1,
        pageSize: this.page.pageSize,
      };
      var num1 = (this.page.pageNum-1) * this.page.pageSize;
      var num2 = this.page.pageNum * this.page.pageSize;
      this.list = this.checkedList.slice(num1,num2);
    },
    checkItem(item,value,key) {
      if (!value) {
        return true;
      } else {
        if (item[key] == value) {
          return true;
        } else {
          return false;
        }
      }
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
      var num1 = (this.pageNum-1) * this.page.pageSize;
      var num2 = this.pageNum * this.page.pageSize;
      this.list = this.checkedList.slice(num1,num2);
    },
    operatingLog(row = {}) {
      this.visible = true;
      this.companyId = row.id;
    },
    handleScrapAsset(row,status) {
      var text = status ? "停用" : "启用";
      this.$confirm('您确定' + text + '该供应商吗？', '提示').then(() => {
        var par = JSON.parse(JSON.stringify(row));
        par.status = !par.status;
        companyEditFun(par).then(resp => {
            this.$message.success('操作成功!');
            this.getCompanyList();
          });
      });
    },
    handlebatchUpdateNo(row = {}) {
      this.companyId = row.id;
      this.visible = true;
    },
    handleDelete(row = {}) {
      this.$confirm('您确定删除该供应商吗？', '提示').then(() => {
        companyDelFun( {
            id: row.id
          })
          .then(resp => {
            this.$message.success('删除成功');
            this.getCompanyList();
          });
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.excel = true;
      exportExcel(codeListApi, "供应商列表.xlsx", query);
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
