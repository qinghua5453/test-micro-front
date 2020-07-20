<template>
  <div class="page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['广告管理', '广告列表']" />
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="位置归属" prop="appId">
        <el-select size="small" v-model="searchData.appId" placeholder="全部" @change="changeAdvertiseSlot">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in appSolt" :key="item.appId" :label="item.appName" :value="item.appId + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置名称" prop="slotId">
        <el-select size="small" v-model="searchData.slotId" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="item in adverstiseSolt" :key="item.slotId" :label="item.slotName" :value="item.slotId + ''"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in addvertiseSoltStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="更新时间：">
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
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
    </el-form>
    <!--表格-->
    <div class="tab-s">
      <el-button type="primary" class="el-icon-circle-plus btn-add" v-if="getPerm('dal:slot:add')" @click="openAdvertiseModle()">新增</el-button>
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip></el-table-column>
        <el-table-column fixed prop="appName" label="位置归属" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="slotName" label="位置名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="showType" label="展示类型" show-overflow-tooltip :formatter="formatterSlotExhibitionType"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.status | addvertiseSoltStatus }}</template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="最后更新人" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip v-if="getPerm('dal:slot:update')" content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="openAdvertiseModle(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-button v-if="getPerm('dal:slot:update')" size="mini" @click="handleAdvertiseStatus(scope.row)">{{ scope.row.status === 1 ? '下架' : '上架' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <q-pager :total="total" />
      </div>
    </div>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!--IOT日志-->
    <add-adver-slot :visible.sync="isShowAdvertiseDialog" v-if="isShowAdvertiseDialog" :id="advertiseId" :appSolt="appSolt" @getAdvertiseSlotList="getAdvertiseSlotList" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import QArea from '@/components/Area';
import PagerMixin from '@/mixins/PagerMixin';
import DataUtils from '@/utils/Data';
import QBreadcrumb from '@/components/Breadcrumb';
import addAdverSlot from './addAdverSlot.vue';
import { addvertiseSoltStatus, addvertiseLinkType, slotExhibitionType } from '@/utils/Mapping';
export default {
  mixins: [PagerMixin],
  components: {
    QArea,
    QBreadcrumb,
    addAdverSlot
  },
  data() {
    return {
      list: [], // 数据
      total: 0,
      advertiseId: '',
      //头部搜索
      searchData: {
        appId: '',
        slotId: '',
        status: '',
        time: []
      },
      isShowAdvertiseDialog: false,
      appSolt: [],
      adverstiseSolt: [],
      dialogImageVisible: false,
      dialogImageUrl: ''
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    addvertiseSoltStatus() {
      return addvertiseSoltStatus;
    }
  },
  filters: {
    addvertiseSoltStatus(val) {
      return addvertiseSoltStatus[val];
    },
    addvertiseLinkType(val) {
      return addvertiseLinkType[val];
    }
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:slot:list')) {
      this.getAppSolt();
      this.getAdvertiseSlotList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.searchData.appId && this.getAdverstiseSolt();
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    formatterSlotExhibitionType(row,column){
      return slotExhibitionType[row.showType];
    },
    getAppSolt() {
      this.$axios.post(Api.SOLT_APP_LIST).then(res => {
        this.appSolt = res;
      });
    },
    getAdverstiseSolt() {
      this.$axios.post(Api.SOLT_LIST, { appId: this.searchData.appId }).then(res => {
        this.adverstiseSolt = res;
      });
    },
    changeAdvertiseSlot(val) {
      this.adverstiseSolt = [];
      this.searchData.slotId = '';
      val && this.getAdverstiseSolt();
    },
    getAdvertiseSlotList() {
      this.apiUrl = Api.SOLT_CONFIG_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      return this.$axios.post(this.apiUrl, this.apiParams).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    onPreview(imgurl) {
      this.dialogImageVisible = true;
      this.dialogImageUrl = imgurl;
    },
    handleAdvertiseStatus(row) {
      this.$confirm('确认执行该操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // let par = Object.assign({}, row);
        let { id, status } = row;
        status = row.status === 1 ? 0 : row.status === 0 ? 1 : row.status;
        this.$axios.post(Api.SOLT_CONFIG_CHANGE, { id: id, status: status }).then(res => {
          this.getAdvertiseSlotList();
        });
      });
    },
    goSearchList() {
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
    openAdvertiseModle(row = {}) {
      this.advertiseId = '';
      if (row.id) {
        this.advertiseId = row.id;
      }
      this.isShowAdvertiseDialog = true;
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
/deep/ .el-dialog__header {
  border: none;
}
.preview {
  cursor: pointer;
}
</style>
