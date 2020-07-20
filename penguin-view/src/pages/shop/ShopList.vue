<template>
  <div v-if="getPerm('dal:shop:list')">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['店铺管理', '店铺列表']" />
    <!--表单-->
    <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
      <el-form-item label="店铺名称：" prop="name">
        <el-input size="small" clearable v-model="searchData.shopName"></el-input>
      </el-form-item>
      <el-form-item label="区域：">
        <q-area v-model="searchData.areaIds" size="small" default-option="不限" />
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input clearable v-model="searchData.address" size="small"></el-input>
      </el-form-item>
      <el-form-item label="运营商账号：" prop="number">
        <el-input clearable size="small" v-model="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="type">
        <el-select v-model="searchData.type" size="small" placeholder="全部">
          <el-option label="不限" :value="null" />
          <el-option v-for="item in shopTypeList" :label="item.name" :value="item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="searchData.status" placeholder="全部" size="small">
          <el-option label="不限" value="" />
          <el-option v-for="(name, id) in shopType" :key="id" :label="name" :value="+id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺属性：" prop="attribute">
        <el-select size="mini" v-model="searchData.attribute" placeholder="全部" style="width: 140px;">
          <el-option label="不限" value="" />
          <el-option v-for="(name, id) in attributeType" :key="id" :label="name" :value="+id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：" prop="date">
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
        <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
      </el-form-item>
      <el-form-item v-if="getPerm('dal:shop:excel')">
        <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <div class="tab-s">
      <el-button v-if="getPerm('dal:shop:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddShopDialog({})">新增店铺</el-button>
      <el-table :data="list" border center="true" height="648" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip> </el-table-column>
        <el-table-column label="店铺名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="name-active" @click="openShopDetailDialog(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="店铺地址" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="shopTypeName" label="店铺类型" width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="shopState" :formatter="formatterState" label="店铺状态" width="120"> </el-table-column>
        <el-table-column prop="operatorName" label="运营商" width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="attribute" label="店铺属性" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.attribute | attributeType }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="机器数量" show-overflow-tooltip width="80">
          <template slot-scope="scope">
            <div class="name-active" @click="openMachineListDialog(scope.row)">{{ scope.row.machineCount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope" v-if="scope.row.status != 4">
            <el-tooltip v-if="getPerm('dal:shop:update')" content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="openAddShopDialog(scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:shop:wechatPayOpen')" content="开通微信支付" placement="top" effect="dark">
              <svg style="font-size: 24px;" v-if="scope.row.wechatPayStauts == 0" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                <use xlink:href="#icon-kaiguankai"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:shop:wechatPayOpen')" content="关闭微信支付" placement="top" effect="dark">
              <svg style="font-size: 24px;" v-if="scope.row.wechatPayStauts == 1" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                <use xlink:href="#icon-kaiguanguan"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:shop:delete')" content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row)">
                <use xlink:href="#icon-trashcopy"></use>
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

    <!-- 新增编辑店铺 -->
    <add-or-edit-shop v-if="isShowAddShopDialog" :visible.sync="isShowAddShopDialog" :shopId="shopIds" @getShoplist="getShoplist" />

    <!-- 店铺设备数量 -->
    <machines-in-shop v-if="isShowMachineListDialog" :visible.sync="isShowMachineListDialog" :shopId="shopIds"></machines-in-shop>

    <!--店铺详情-->
    <shop-detail v-if="isShowShopDetailDialog" :visible.sync="isShowShopDetailDialog" :shopId="shopIds"></shop-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import QBreadcrumb from '@/components/Breadcrumb';
import QArea from '@/components/Area';
import QUpload from '@/components/Upload';
import QShopSelect from '@/components/ShopSelect';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { ShopType, AttributeType } from '@/utils/Mapping';
import addOrEditShop from './addOrEditShop';
import machinesInShop from './machinesInShop';
import shopDetail from './shopDetail';

export default {
  name: 'page-shop-list',
  mixins: [PagerMixin],

  components: {
    QBreadcrumb,
    QUpload,
    QArea,
    addOrEditShop,
    machinesInShop,
    shopDetail
  },
  data() {
    return {
      loading: false,
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      // 店铺类型
      shopTypeList: [],
      //头部搜索
      searchData: {
        operatorId: null,
        operatorName: null,
        shopName: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        address: null,
        type: null,
        status: null,
        attribute: null,
        startTime: null,
        endTime: null,
        areaIds: null,
        time: null
      },
      isShowShopDetailDialog: false,
      isShowAddShopDialog: false,
      isShowMachineListDialog: false,
      shopIds: '' //店铺id
    };
  },
  filters: {
    attributeType: val => {
      return AttributeType[val];
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    attributeType() {
      return AttributeType;
    },
    shopType() {
      return ShopType;
    }
  },
  mounted() {},
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:shop:list')) {
      this.getShoplist();
      this.getShopType();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
      // 地区转换
      this.searchData.areaIds = [this.$route.query.provinceId || null, this.$route.query.cityId || null, this.$route.query.districtId || null];
    }
  },
  methods: {
    //获取店铺列表
    getShoplist() {
      this.apiUrl = Api.SHOP_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 获取店铺类型
    getShopType() {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
      });
    },
    //根据条件查询店铺列表信息
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          // 地区转换
          query.provinceId = query.areaIds ? query.areaIds[0] : null;
          query.cityId = query.areaIds ? query.areaIds[1] : null;
          query.districtId = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    //店铺状态
    formatterState(row, column) {
      return ShopType[row.status];
    },

    //新增店铺
    async openAddShopDialog(row = {}) {
      this.shopIds = '';
      if (row.id) {
        this.shopIds = row.id;
      }
      this.isShowAddShopDialog = true;
    },
    // 查看机器
    openMachineListDialog(row) {
      if (row.machineCount === 0) return false;
      this.shopIds = row.id;
      this.isShowMachineListDialog = true;
    },

    //查看店铺详情
    openShopDetailDialog(row) {
      if (this.getPerm('dal:shop:details')) {
        this.shopIds = row.id;
        this.isShowShopDetailDialog = true;
      }
    },

    // 开通微信支付
    handleToggleWxPay(shop) {
      let w = shop.wechatPayStauts === 1 ? '关闭' : '开通';
      this.$confirm(`是否需要${w}微信支付功能?`, '提示', {
        type: 'warning'
      }).then(_ => {
        this.$axios
          .post(Api.WECHATPAY_OPEN, {
            id: shop.id,
            status: shop.wechatPayStauts
          })
          .then(resp => {
            this.$message.success(`恭喜你，微信支付已经${w}！`);
            this.getShoplist();
          });
      });
    },
    // 删除店铺
    handleDelete(row) {
      this.$confirm('您确定要删除该店铺，如果店铺下有机器无法删除哦', '删除确认').then(_ => {
        this.$axios
          .post(Api.SHOP_DELETE, {
            id: row.id
          })
          .then(resp => {
            this.$message.success('店铺已删除成功！');
            this.getShoplist();
          });
      });
    },
    //导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          // 地区转换
          query.provinceId = query.areaIds ? query.areaIds[0] : null;
          query.cityId = query.areaIds ? query.areaIds[1] : null;
          query.districtId = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          exportExcel(Api.EXPORT_SHOP, '店铺总览.xlsx', query);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-date-table td.in-range div,
.el-date-table td.in-range div:hover,
.el-date-table.is-week-mode .el-date-table__row.current div,
.el-date-table.is-week-mode .el-date-table__row:hover div {
  background-color: #cad7ea !important;
}

.name-active:hover {
  cursor: pointer;
}
</style>
