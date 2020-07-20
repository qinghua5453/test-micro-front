<template>
  <section v-if="getPerm('dal:event:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['营销管理', '新优惠券']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="适用店铺：" class="form-item-m" prop="shopIds">
            <el-select style="width:100%" v-model="searchData.shopIds" multiple filterable remote placeholder="请输入店铺名称" :remote-method="getShopByName" @change="changeShopName($event,1)">
              <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" :data-id="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:coupon:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--新增弹出框-->
          <el-button type="primary" v-if="getPerm('dal:coupon:add')" class="el-icon-circle-plus btn-add" @click="openAddModel()">新增优惠券</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip> </el-table-column>
            <el-table-column label="优惠券名称" min-width="120" prop="title" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openDetailModel(scope.row)">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="面额/折扣" min-width="100" prop="reduce" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.couponType === 1">{{ scope.row.reduce }}元</span>
                <span v-if="scope.row.couponType === 2">免费体验券</span>
                <span v-if="scope.row.couponType === 3">{{ scope.row.percentage }}折</span>
              </template>
            </el-table-column>
            <el-table-column label="条件" min-width="120" prop="orderReachPrice" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.couponType === 1">满{{ scope.row.reduce }}元可用</span>
                <span v-if="scope.row.couponType === 2">无</span>
                <span v-if="scope.row.couponType === 3">减免上限{{scope.row.maxDiscountPrice}}元</span>
              </template>
            </el-table-column>
            <el-table-column label="适用店铺" prop="shopNames" min-width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.shopNames" :key="index">{{ item }}&nbsp;&nbsp;</span>
              </template>
            </el-table-column>
            <el-table-column label="适用类型" prop="machineParentTypeNames" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.machineParentTypeNames" :key="index">{{ item }}&nbsp;&nbsp;</span>
              </template>
            </el-table-column>
            <el-table-column label="优惠方式" prop="couponType" width="100" show-overflow-tooltip :formatter="formatterDiscountType"></el-table-column>
            <el-table-column label="数量" prop="stock" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column label="有效期" show-overflow-tooltip width="300">
              <template slot-scope="scope">
                <span>{{ scope.row.startAt }}-{{ scope.row.endAt }}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效时段" show-overflow-tooltip width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.hourMinuteStartTime }}-{{ scope.row.hourMinuteEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="180"> </el-table-column>
            <el-table-column label="创建人" prop="lastEditor"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-tooltip content="编辑" v-if="getPerm('dal:coupon:update')" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddModel(scope.row)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-button size="mini" v-if="getPerm('dal:coupon:activate')" @click="openGrantModel(scope.row)">发放</el-button>
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
    <!--新增-->
    <add :visible.sync="addVisible" v-if="addVisible" :promotionId="promotionId" @getEventList="getEventList"></add>
    <!--发放-->
    <grant :visible.sync="grantVisible" v-if="grantVisible" :promotionId="promotionId" @getEventList="getEventList"></grant>
    <!--详情-->
    <detail :visible.sync="detailVisible" v-if="detailVisible" :promotionId="promotionId"></detail>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import QIndex from '@/components/Index';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { ActDiscountType } from '@/utils/Mapping';
import add from './add';
import grant from './grant';
import detail from './detail';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,

      //头部搜索
      searchData: {
        shopIds: []
      },
      shopList: [],
      selectedShopList: [],
      addVisible: false,
      grantVisible: false,
      detailVisible: false,
      promotionId: ''
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:coupon:list')) {
      this.getEventList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    async getShopByName(keywords) {
      if (keywords === '') {
        return;
      }
      this.loading = true;
      let res = await this.$axios.post(Api.SHOP_GETFORNAME, {
        name: keywords
      });
      this.shopList = [...res,...this.selectedShopList] || [];
      this._.uniqBy(this.shopList, 'id');
      this.loading = false;
    },
    changeShopName(ev) {
      this.selectedShopList.push({
          id: event.target.dataset.id,
          name: event.target.innerText
      })
      this._.uniqBy(this.selectedShopList, 'id');
    },
    // 格式化优惠方式
    formatterDiscountType(row, column) {
      return ActDiscountType[row.couponType];
    },
    // 格式化类型
    formatterStatus(row, column) {
      let status = '';
      if (row.machineParentTypeIds != null) {
        let usePosition_List = row.machineParentTypeIds.split(',');
        this.status = '';
        usePosition_List.map(item => {
          if (item == 1) {
            status += '洗衣机' + ' ';
          } else if (item == 2) {
            status += '烘干机' + ' ';
          } else if (item == 3) {
            status += '洗鞋机' + ' ';
          } else if (item == 4) {
            status += '吹风机' + ' ';
          } else if (item == 5) {
            status += '充电桩' + ' ';
          } else if (item == 6) {
            status += '饮水机' + ' ';
          } else {
            status = '通用';
          }
        });
      }
      return status;
    },
    // 获取活动列表
    getEventList() {
      this.apiUrl = Api.NEW_COUPON_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
    },
    // 查询活动列表
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.shopIds = JSON.stringify(query.shopIds);
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    openAddModel(row = {}) {
      this.promotionId = '';
      if (row.promotionId) {
        this.promotionId = row.promotionId;
      }
      this.addVisible = true;
    },
    openGrantModel(row) {
      this.promotionId = row.promotionId;
      this.grantVisible = true;
    },
    openDetailModel(row) {
      this.promotionId = row.promotionId;
      this.detailVisible = true;
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
          exportExcel(Api.EVENT_ExCEL, '活动列表总览.xlsx', query);
        }
      });
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    add,
    grant,
    detail
  }
};
</script>
<style lang="less" scoped></style>
