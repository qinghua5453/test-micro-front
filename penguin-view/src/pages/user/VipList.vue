<template>
  <section v-if="getPerm('dal:vip:member:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['用户管理', 'VIP会员']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="用户账号：">
            <el-input size="small" clearable v-model="searchData.phone" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="购买店铺：">
            <el-input size="small" clearable v-model="searchData.shopName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="运营商：">
            <el-input size="small" clearable v-model="searchData.operator" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.status" style="width: 140px;" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="未过期" value="0"></el-option>
              <el-option label="已过期" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:vip:member:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="740" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip> </el-table-column>
            <el-table-column fixed prop="phone" label="用户账号" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" label="昵称" min-width="60" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="type" label="购买时长" width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.timeInterval">{{ scope.row.timeInterval}}个月</span>
              </template> </el-table-column>
            <el-table-column prop="price" label="价格" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="buyShopName" label="购买店铺" min-width="140" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="shopName" label="适用店铺" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="toseeAllowUseSHop(scope.row)" class="preview">点击查看</span>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="运营商" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="balance" label="有效时间" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.startTime | formatterValidTime}}至{{scope.row.endTime | formatterValidTime}}</span>
              </template> </el-table-column>
            <el-table-column prop="createTime" label="购买时间" width="180" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="status" label="状态" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.status === 0 ? "未过期" : "已过期" }}</span>
              </template> </el-table-column>
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
    <!-- 适用店铺 -->
    <allow-use-shop :visible.sync="isAllowUseShopVisible" v-if="isAllowUseShopVisible" :id="vipId" />
  </section>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import allowUseShop from './allowUseShop';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { VipType, CouponType } from '@/utils/Mapping';
export default {
  name: 'page-user-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        phone: null,
        type: null,
        shopName: null,
        operator: null,
        status: null,
        startTime: moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        time: []
      },
      isAllowUseShopVisible: false,
      vipId: ''
    };
  },
  filters: {
    formatterValidTime(value) {
      return moment(value).format('YYYY-MM-DD');
    }
  },
  created() {
    // 判断该用户是否有查看的权限
    if (this.getPerm('dal:vip:member:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
      this.getVipMemberList();
    }
  },
  methods: {
    //获取用户列表信息
    getVipMemberList() {
      this.apiUrl = Api.VIP_MEMBER_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
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

    // 格式化vip卡类型
    formatterVipType(row, column) {
      return VipType[row.type];
    },

    // 格式化优惠券状态
    formatterStatus(row, column) {
      return CouponType[row.status];
    },

    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    toseeAllowUseSHop(row) {
      this.vipId = row.id;
      this.isAllowUseShopVisible = true;
    },
    // 导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.VIP_MEMBER_ExCEL, 'VIP会员总览.xlsx', query);
        }
      });
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    allowUseShop
  }
};
</script>

<style lang="less">
.draw-textarea {
  .el-textarea__inner {
    line-height: 3.5 !important;
  }
}
.preview {
  cursor: pointer;
  color: #409eff;
}
</style>
