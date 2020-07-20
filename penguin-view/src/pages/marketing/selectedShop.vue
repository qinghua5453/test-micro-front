<template>
  <!--中奖用户列表信息-->
  <el-dialog title="已选店铺" :visible.sync="visible" :before-close="modalClose">
    <!-- <div class="condtion_card" v-if="couponHeaderDetail.shopCondition">
          <div class="header">
            <span>已选条件</span>
          </div>
          <div class="condtion_card_detail">
            <p>
              <span>创建时间：</span>
              <span v-if="!couponHeaderDetail.shopCondition.startTime&&!couponHeaderDetail.shopCondition.endTime">不限</span>
              <span v-else>{{couponHeaderDetail.shopCondition.startTime}}至{{couponHeaderDetail.shopCondition.endTime}}</span></p>
            <p>
              <span>店铺区域：</span>
              <span v-if="couponHeaderDetail.shopCondition.areaIds.length<=0">不限</span>
              <span v-else v-for="(item,index) in proviceTypesName" :key="index">{{item.areaName}}<i v-if="index !== (proviceTypesName.length-1)">，</i></span>
            </p>
            <p><span>类型：</span><span v-for="(item,index) in shopTypeListName" :key="index">{{item.name}}<i v-if="index !== (shopTypeListName.length-1)">，</i></span></p>
          </div>
        </div> -->
    <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
      <el-form-item label="店铺名单：">
        <el-input v-model="searchData.keyword" :clearable="true" size="small" placeholder="按运营商账号或店铺查找"></el-input>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="search()">查询</a>
      </el-form-item>
    </el-form>
    <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table">
      <el-table-column show-overflow-tooltip prop="name" label="店铺名称"></el-table-column>
      <el-table-column prop="operatorName" label="运营商账号"></el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="block">
        <el-pagination
          v-show="pageShow"
          @size-change="pageSizeChange"
          @current-change="currentChange"
          :current-page="searchData.page"
          :page-sizes="pageSizeOpts"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-col>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import modlePageMixin from '@/mixins/modlePageMixin';
import DataUtils from '@/utils/Data';
import { exportExcel } from '@/utils/tool';

export default {
  name: 'page-relationbd-list',
  mixins: [modlePageMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    couponHeaderDetail: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      proviceTypes: [],
      shopTypeList: [],
      proviceTypesName: [],
      shopTypeListName: []
    };
  },
  created() {
    this._getList();
    this.getCommonProvice();
    this.getShopType();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    // 获取省份
    getCommonProvice() {
      return this.$axios.post(Api.AREA_LIST, { parentId: 0 }).then(resp => {
        this.proviceTypes = resp;
        let areaIds = this.couponHeaderDetail.shopCondition ? (this.couponHeaderDetail.shopCondition.areaIds ? this.couponHeaderDetail.shopCondition.areaIds : []) : [];
        this.proviceTypesName = this.proviceTypes.filter(v => areaIds.some(k => k == v.id));
      });
    },
    // 获取店铺类型
    getShopType() {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
        let shopTypeIds = this.couponHeaderDetail.shopCondition ? (this.couponHeaderDetail.shopCondition.shopTypeIds ? this.couponHeaderDetail.shopCondition.shopTypeIds : []) : [];
        this.shopTypeListName = this.shopTypeList.filter(v => shopTypeIds.some(k => k == v.id));
      });
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    _getList() {
      const payload = Object.assign({ eventId: this.couponHeaderDetail.id }, this.searchData);
      this.$axios.post(Api.MEMBER_EVENT_SHOP, payload).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
      });
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  }
};
</script>

<style lang="less">
.condtion_card {
  padding-bottom: 18px;
  border-bottom: 1px solid #ebeef5;
}
.condtion_card_detail {
  padding: 4px 10px;
  background: #f1f1f1;
  border-radius: 3px;
  margin-top: 8px;
  p {
    line-height: 38px;
  }
}
</style>
