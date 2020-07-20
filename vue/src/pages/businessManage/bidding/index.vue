<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['商机管理', '高校招投标']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="标题" prop="title">
        <el-input clearable v-model.trim="searchData.title" size="small"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select size="small" v-model="searchData.tag" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(item, index) in tagOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="不限">
          <el-option label="不限" value></el-option>
          <el-option v-for="(key, value) in biddingStatus" :key="key" :label="key" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="time">
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
        <a class="el-button el-button--primary" type="primary" @click="goTopSearch()">查询</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="goDetail(scope.row)">
              {{scope.row.title}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" show-overflow-tooltip></el-table-column>
        <el-table-column prop="readNum" label="阅读量" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="support" label="点赞量" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatterTime(scope.row.releaseTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="reviewName" label="审核人" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" width="120" show-overflow-tooltip :formatter="formatterStatusType"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="筛选" placement="top" effect="dark" v-if="scope.row.status == 3 && getPerm('mer:bidding:filter')">
              <svg class="icon" aria-hidden="true" @click="screen(scope.row)">
                <use xlink:href="#icon-shenhe"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="发布" placement="top" effect="dark" v-if="scope.row.status == 0 && getPerm('mer:bidding:release')">
              <svg class="icon" aria-hidden="true" @click="release(scope.row)">
                <use xlink:href="#icon-release"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="撤回" placement="top" effect="dark" v-if="scope.row.status == 1 && getPerm('mer:bidding:back')">
              <svg class="icon" aria-hidden="true" @click="withdraw(scope.row)">
                <use xlink:href="#icon-withdraw"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="dark" v-if="scope.row.status == 0 && getPerm('mer:bidding:edit')">
              <svg class="icon" aria-hidden="true" @click="editType(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark" v-if="getPerm('mer:bidding:delete')">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block" v-if="showPage">
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
import moment from 'moment'

import { biddingStatus } from "@/utils/Mapping";
import { mixinObj } from "@/utils/tool";

import {
  tagsListFun,
  biddingListFun,
  fallbackFun,
  deleteFun,
  releaseFun
} from "../business";

export default {
  mixins: [PagerTmixin],
  components: {
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
        "status": "",
        "tag": "",
        "title": "",
      },
      tagOptions: [],
      visible:false,
      typeId: "",
      showPage: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    biddingStatus() {
      return biddingStatus;
    },
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      if (from.path == "/editBiddings" || from.path == "/biddingsDetail") {
        let keepalivedata = JSON.parse(sessionStorage.getItem("keepAliveData"));
        vm.searchData = mixinObj(vm.searchData,keepalivedata);
        if (vm.searchData.startTime && vm.searchData.endTime) {
          vm.searchData.time = [vm.searchData.startTime,vm.searchData.endTime];
        }
        vm.page.pageNum = keepalivedata.pageNum ? keepalivedata.pageNum : 1;
        vm.page.page = keepalivedata.page ? keepalivedata.page : 1;
        vm.page.pageSize = keepalivedata.pageSize ? keepalivedata.pageSize : 30;
      }
      vm.showPage = true;
      vm.getList();
    });
  },
  created() {
    // if (this.getPerm("dal:ship:list")) {
      // this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getTags();
    // }
  },
  methods: {
    async getTags() {
      let par = {
        category: 1
      }
      let res = await tagsListFun(par);
      this.tagOptions = res;
    },
    formatterStatusType(row,column) {
      return biddingStatus[row.status];
    },
    formatterTime(time) {
      if (time) {
        return moment(time).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    editType(row) {
      this.$router.push({
        name: 'editBiddings',
        query: { biddingsId: row.id }
      });
    },
    goDetail(row) {
      this.$router.push({
        name: 'biddingsDetail',
        query: { biddingsId: row.id }
      });
    },
    screen(row) {
      this.$router.push({
        name: 'editBiddings',
        query: { biddingsId: row.id,isScreen: 1 }
      });
    },
    release(row) {
      this.$confirm('您确定发布该招投标信息吗？', '提示').then(() => {
        releaseFun( {
            id: row.id
          })
          .then(resp => {
            this.$message.success('发布成功');
            this.getList();
          });
      });
    },
    withdraw(row) {
      this.$confirm('您确定撤回该招投标信息吗？', '提示').then(() => {
        fallbackFun( {
            id: row.id
          })
          .then(resp => {
            this.$message.success('撤回成功');
            this.getList();
          });
      });
    },
    handleDelete(row) {
      this.$confirm('您确定删除该招投标信息吗？', '提示').then(() => {
        deleteFun( {
            id: row.id
          })
          .then(resp => {
            this.$message.success('删除成功');
            setTimeout(() => {
              this.getList();
            }, 400);
          });
      });
    },
    async getList() {
      let par = Object.assign({}, this.page, this.searchData);
      par.startTime = par.time && par.time.length > 0 ? par.time[0] : null;
      par.endTime = par.time && par.time.length > 0 ? par.time[1] : null;
      par.time = null;

      sessionStorage.setItem("keepAliveData",JSON.stringify(par));
      if (this.getPerm("mer:bidding:list")) {
        let res = await biddingListFun(par);
        this.total = res.total;
        this.list = res.items;
      }
      this.showPage = true;
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
    goTopSearch(par) {
      this.page.pageNum = 1;
      this.page.page = 1;
      this.page.pageSize = 30;
      
      this.showPage = false;
      this.getList();
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
