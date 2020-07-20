<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['洗衣液管理', '洗衣液配置']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="名称" prop="name">
        <el-input clearable v-model.trim="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="brandTypeId">
        <el-select size="small" v-model="searchData.brandTypeId" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in brandTypes" :key="item.id" :label="item.name" :value="String(item.id)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" prop="brandNameId">
        <el-select size="small" v-model="searchData.brandNameId" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in brandNames" :key="item.id" :label="item.name" :value="String(item.id)"></el-option>
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
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="el-icon-circle-plus btn-add" @click="goAddDetergent">添加洗衣液/除菌液</el-button>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="brandType" label="类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qty" label="规格" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.qty }}ml</template>
        </el-table-column>
        <el-table-column prop="amount" label="单次用量(ml)" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="price" label="单次售价(元)" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="logo" label="品牌logo" show-overflow-tooltip>
          <template slot-scope="scope">
            <img :src="scope.row.logo" :alt="scope.row.name" @click="lookLogo(scope.row)" width="43" />
          </template>
        </el-table-column>
        <el-table-column prop="voice" label="语音提示" show-overflow-tooltip min-width="320">
          <template slot-scope="scope">
            <audio :src="scope.row.voice" controls="controls" v-if="scope.row.voice">
              Your browser does not support the audio tag.
            </audio>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="goAddDetergent(scope.row)">
                <use xlink:href="#icon-document-edit" />
              </svg>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy" />
              </svg>
            </el-tooltip>
            <el-tooltip content="生成激活码" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="generateCode(scope.row)">
                <use xlink:href="#icon-shengchengerweima"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="操作记录" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="operatingRecord(scope.row)">
                <use xlink:href="#icon-mydetail"></use>
              </svg>
              <!-- <i class="el-icon-document-checked" style="font-size: 20px;color: #1296db;vertical-align: top;" @click="operatingRecord(scope.row)"></i> -->
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>

    <!--新增内容-->
    <add v-if="isAddModleVisible" :visible.sync="isAddModleVisible" :brandId="brandId" @getDetergentList="getDetergentList"></add>

    <!--生成激活码-->
    <qrcode v-if="isCodeModleVisible" :visible.sync="isCodeModleVisible" :brandId="brandId" @getDetergentList="getDetergentList"></qrcode>
    <!--操作记录-->
    <record v-if="isRecordModleVisible" :visible.sync="isRecordModleVisible" :brandId="brandId"></record>

    <el-dialog class="big-img" :visible.sync="logoVisible" width="500px">
      <img style="display: block;margin: 0 auto;" :src="logoUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerMixin from "@/mixins/PagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { brandListApi, brandListFun, brandDelFun,brandTypesFun,brandNamesFun } from '../detergent';

import add from "./add";
import qrcode from "./qrcode";
import record from "./record";

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
    add,
    qrcode,
    record
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        name:'',
        brandTypeId:'',
        brandNameId:'',
        time: []
      },
      brandNames:[],
      brandTypes:[],
      brandId:'',
      logoUrl:'',
      logoVisible:false,
      isAddModleVisible: false,
      isCodeModleVisible: false,
      isRecordModleVisible: false
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  },
  created() {
    if (this.getPerm("mer:dispenser:brand:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [
          this.searchData.startTime,
          this.searchData.endTime
        ];
      }
      this.getBrandTypesFun();
      this.getBrandNamesFun();
      this.getDetergentList();
    }
  },
  methods: {
    async getBrandTypesFun(){
      let res = await brandTypesFun();
      this.brandTypes= res;
    },
    async getBrandNamesFun(){
      let res = await brandNamesFun();
      this.brandNames = res;
    },
    async getDetergentList() {
      this.apiUrl = brandListApi;
      let query = this.$route.query;
      this.setApiParams(query);
      let res = await brandListFun(this.apiUrl, this.apiParams);
      console.log(res);
      this.total = res.total;
      this.list = res.items;
    },
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query["t"] = +new Date();
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          query = DataUtils.filter(query);
          this.$router.push({
            query: query
          });
        }
      });
    },
    lookLogo(row){
      if(row.logo){
        this.logoUrl = row.logo;
        this.logoVisible = true;
      }
    },
    goAddDetergent(row = {}) {
      this.brandId = '';
      if(row.id){
        this.brandId = row.id;
      }
      this.isAddModleVisible = true;
    },
    generateCode(row = {}) {
      this.isCodeModleVisible = true;
      this.brandId = row.id;
    },
    operatingRecord(row = {}) {
      this.isRecordModleVisible = true;
      this.brandId = row.id;
    },
    handleDelete(row) {
      this.$confirm("确定删除？", "提示", {
        showClose: false
      }).then(() => {
        brandDelFun({brandId:row.id}).then(() => {
          this.$message.success("操作成功");
          this.getDetergentList();
        });
      });
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
.big-img /deep/ .el-dialog__header {
  border-bottom: 0;
}
</style>
