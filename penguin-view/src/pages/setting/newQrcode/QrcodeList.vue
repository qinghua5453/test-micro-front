s<template>
  <section v-if="getPerm('dal:qrcode:list')" class="qrcode-wrap">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['设置', '二维码管理(新)']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="创建人">
            <el-input size="small" clearable v-model="searchData.createUser" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              size="small"
              v-model="searchData.time"
              type="daterange"
              align="right"
              :editable="false"
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
        <div class="tab-s">
          <el-button v-if="getPerm('dal:qrcode:add')" type="primary" class="el-icon-circle-plus btn-add" @click="generateCode">生成二维码</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="675" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
            <el-table-column fixed prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="createUserName" label="创建人"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                {{scope.row.status == 1 ? "已生成" : "生成中"}}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-tooltip content="下载链接" placement="top" v-if="scope.row.status == 1" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="showDownloadModle(scope.row.id)">
                    <use xlink:href="#icon-fahuo"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip content="下载二维码" v-if="scope.row.status == 1" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="downGenerateCode(scope.row.id)">
                    <use xlink:href="#icon-shengchengerweima"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <t-pager @currentChange="goSearchList" :page-size="page.pageSize" :currentPage="page.pageNum" :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <!--新增内容-->
    <add v-if="isAddModleVisible" :visible.sync="isAddModleVisible" :qrcodId="qrcodId" :editFrom="editFrom" @getQrcodeList="getQrcodeList"></add>

    <!--下载链接-->
    <download v-if="isDownloadVisible" @submitSearch="goSearchList" :visible.sync="isDownloadVisible" :qrcodId="qrcodId"></download>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerTmixin from "@/mixins/twoPagerMixin";
import { MachineCompany, MachineType } from '@/utils/Mapping';
import add from './add';
import download from './download';
import { exportExcel } from "@/utils/tool";

import {
  codeListFun,
  excelCodesFun,
  zipCodesFun
} from "./qrcode";

export default {
  name: 'page-qrcode-list',
  mixins: [PagerTmixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      searchData: {
        createUser: '',
        startTime: '',
        endTime: '',
        time: ''
      },
      qrcodId: '',
      isAddModleVisible: false,
      isDownloadVisible: false,
      editFrom: {}
    };
  },
  mounted() {},
  created() {
    this.getQrcodeList();
    // 判断该用户是否有查看权限
    // if (this.getPerm('dal:qrcode:list')) {
    //   this.getQrcodeList();
    //   this.searchData = Object.assign(this.searchData, this.$route.query);
    //   // 时间转换
    //   if (this.searchData.startTime && this.searchData.endTime) {
    //     this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
    //   }
    // }
  },
  methods: {
    //获取用户列表信息
    getQrcodeList() {
      let par = Object.assign({}, this.page, this.searchData);
      par.startTime = par.time ? par.time[0] : null;
      par.endTime = par.time ? par.time[1] : null;
      par.time = null;

      codeListFun(par).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    //根据搜索条件查询
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
      this.getQrcodeList();
    },
    showDownloadModle(id) {
      this.qrcodId = id;
      var par = {
        id: id
      }
      excelCodesFun(par).then(res => {
        var link = document.createElement("a");
        link.href = res;
        // link.download = "二维码压缩包.zip";
        link.click();
        window.URL.revokeObjectURL(link.href);
        // console.log(res);
      });
    },
    pagerIndex(index) {
      return (this.page.pageNum-1) * this.page.pageSize + index + 1;
    },
    downGenerateCode(id) {
      var par = {
        id: id
      }
      zipCodesFun(par).then(res => {
        var link = document.createElement("a");
        link.href = res;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    },
    generateCode(row = {}) {
      this.qrcodId = '';
      if (row.id) {
        this.qrcodId = row.id;
        this.editFrom = row;
      }
      this.isAddModleVisible = true;
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    add,
    download
  }
};
</script>

<style lang="less">
.qrcode-wrap {
  .el-dialog__body {
    padding: 0;
  }
  .bd-con {
    padding: 30px;
  }
}
</style>
