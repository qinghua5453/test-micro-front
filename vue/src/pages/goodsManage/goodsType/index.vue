<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['商品管理', '商品类目']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="类目名称" prop="name">
        <el-input clearable v-model.trim="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="一级类型" prop="categoryCode">
        <el-select size="small" v-model="searchData.categoryCode" placeholder="不限" @change="changeCategory">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级类型" prop="modelId">
        <el-select size="small" v-model="searchData.modelId" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in modelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="time">
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
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="el-icon-circle-plus btn-add" @click="addType">新增类目</el-button>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="类目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="instructions" label="使用说明" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="一级类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modelName" label="二级类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="needNqt" label="NQT" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.needNqt == 1 ? "需要" : "不需要"}}
          </template>
        </el-table-column>
        <el-table-column prop="flowMeter" label="流量计" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.flowMeter ? "是" : "否"}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="editType(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
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
    <addType v-if="visible" :visible.sync="visible" @submitSearch="goSearchList" :typeid="typeId" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerTmixin from "@/mixins/twoPagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { assetCurStatusType } from "@/utils/Mapping";

import {
  delGoodsTypeFun,
  getCategoryFun,
  getModelFun,
  goodsTypeListFun,
} from "../goods";
import addType from "./addType";

export default {
  mixins: [PagerTmixin],
  components: {
    addType,
    QBreadcrumb,
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "time": [],
        "endTime": "",
        "startTime": "",
        "categoryCode": "",
        "modelId": "",
        "name": "",
      },
      categoryOptions: [],
      modelOptions: [],
      sels: [],
      visible:false,
      typeId: "",
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetCurStatusType() {
      return assetCurStatusType;
    },
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getAssetList();
      this.getCategory();
      // this.getTreeData();
      // this.getAllErpData();
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
        categoryCode: code
      }
      let res = await getModelFun(par);
      this.modelOptions = res;
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    addType() {
      this.typeId = "";
      this.visible = true;
    },
    editType(row) {
      this.typeId = row.id;
      this.visible = true;
    },
    handleDelete(row) {
      this.$confirm('您确定删除该商品类目吗？', '提示').then(() => {
        delGoodsTypeFun( {
            id: row.id
          })
          .then(resp => {
            this.$message.success('删除成功');
            this.getAssetList();
          });
      });
    },
    async getAssetList() {
      
      let par = Object.assign({}, this.page, this.searchData);

      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;

      let res = await goodsTypeListFun(par);
      this.total = res.total;
      this.list = res.items;
    },
    changeCategory(index) {
      this.searchData.modelId = "";
      this.modelOptions = [];
      if (this.searchData.categoryCode) {
        this.getModel(this.searchData.categoryCode);
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
      this.getAssetList();
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
.linkinNum {
  text-decoration: underline;
  color: #409EFF;
  cursor: pointer;
}
</style>
