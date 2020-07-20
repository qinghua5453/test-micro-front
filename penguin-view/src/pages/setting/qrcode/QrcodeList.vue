s<template>
  <section v-if="getPerm('dal:qrcode:list')" class="qrcode-wrap">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['设置', '二维码管理']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="创建人">
            <el-input size="small" clearable v-model="searchData.createUser" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="通信类型：">
            <el-select size="small" v-model="searchData.type" style="width: 140px;" placeholder="全部">
              <el-option value="" label="全部">全部</el-option>
              <el-option value="0" label="脉冲"></el-option>
              <el-option value="1" label="串口"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司：">
            <el-select size="small" v-model="searchData.company" style="width: 140px;" placeholder="全部">
              <el-option value="" label="全部">全部</el-option>
              <el-option value="youfang" label="有方"></el-option>
              <el-option value="hezhou" label="合宙"></el-option>
              <el-option value="qiekj" label="企鹅"></el-option>
            </el-select>
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
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('dal:qrcode:add')" type="primary" class="el-icon-circle-plus btn-add" @click="generateCode">生成二维码</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="675" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
            <el-table-column fixed prop="count" label="数量"></el-table-column>
            <el-table-column prop="type" label="通信类型" :formatter="formatterTypeStatus"></el-table-column>
            <el-table-column prop="company" label="公司" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="ver" label="VER"></el-table-column>
            <el-table-column prop="createUser" label="创建人"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-tooltip content="下载链接" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="showDownloadModle(scope.row.id)">
                    <use xlink:href="#icon-fahuo"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip content="生成二维码" v-if="scope.row.count <= 300" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="generateCode(scope.row)">
                    <use xlink:href="#icon-shengchengerweima"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <!--新增内容-->
    <add v-if="isAddModleVisible" :visible.sync="isAddModleVisible" :qrcodId="qrcodId" :editFrom="editFrom" @getQrcodeList="getQrcodeList"></add>

    <!--下载链接-->
    <download v-if="isDownloadVisible" :visible.sync="isDownloadVisible" :qrcodId="qrcodId"></download>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { MachineCompany, MachineType } from '@/utils/Mapping';
import add from './add';
import download from './download';

export default {
  name: 'page-qrcode-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      searchData: {
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
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:qrcode:list')) {
      this.getQrcodeList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //获取用户列表信息
    getQrcodeList() {
      this.apiUrl = Api.QRCODE_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    formatterStatus(row, column) {
      return MachineCompany[row.company];
    },
    formatterTypeStatus(row, column) {
      return MachineType[row.type];
    },
    //根据搜索条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    showDownloadModle(id) {
      this.qrcodId = id;
      this.isDownloadVisible = true;
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
