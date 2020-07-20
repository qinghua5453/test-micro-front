<template>
  <el-dialog title="邀请列表" :visible="visible" :before-close="modalClose" :close="modalClose" width="1300px">
    <el-form :inline="true" :model="searchData" class="demo-form-inline">
      <el-form-item label="手机号">
        <el-input v-model.trim="searchData.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称">
        <el-input v-model.trim="searchData.shopName" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" min-height="500" border>
      <el-table-column label="序号" type="index" :index="indexMethod" width="60"></el-table-column>
      <el-table-column prop="inviteePhone" label="受邀人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inviteePrizeDetail" label="奖励内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.inviteePrizeDetail" :key="index">
            {{item.type===2?'':item.type===3?item.faceValue*10:item.faceValue}}{{item.type===3?'折':item.type===1?'元':''}}{{item.type | ActDiscountType}}<span v-if="index !== (scope.row.inviteePrizeDetail.length-1)">，</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="inviteeAwardTime" label="奖励时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inviterPhone" label="邀请人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inviterPrizeDetail" show-overflow-tooltip label="奖励内容">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.inviterPrizeDetail" :key="index">
            {{item.type===2?'':item.type===3?item.faceValue*10:item.faceValue}}{{item.type===3?'折':item.type===1?'元':''}}{{item.type | ActDiscountType}}<span v-if="index !== (scope.row.inviterPrizeDetail.length-1)">，</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="inviterAwardTime" label="奖励时间"></el-table-column>
      <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="block">
        <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-col>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modlePageMixin from '@/mixins/modlePageMixin';
import Api from '@/utils/Api';
import { ActDiscountType } from '@/utils/Mapping';
export default {
  mixins: [modlePageMixin],
  props: {
    eventId: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      searchData: {
        phone: '',
        shopName: ''
      }
    };
  },
  components: {},
  filters: {
    ActDiscountType(val) {
      return ActDiscountType[val];
    }
  },
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    _getList() {
      let payload = Object.assign(this.searchData, { eventId: this.eventId });
      this.$axios.post(Api.MEMBER_INVITE_LIST, payload).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
      });
    },
    onSubmit() {
      this.searchData.page = 1;
      this._getList();
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
</style>
  