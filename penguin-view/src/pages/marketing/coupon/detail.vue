<template>
  <div>
    <el-dialog class="addActivity-dialog" title="活动详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="640px">
      <el-form :model="detail" label-width="114px">
        <el-form-item label="活动名称：">
          <span>{{ detail.title }}</span>
        </el-form-item>
        <el-form-item label="店铺名称：">
          <span v-for="(item, index) in detail.shopNames" :key="index">{{ item }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="适用类型：">
          <span v-for="(item, index) in detail.machineParentTypeNames" :key="index">{{ item }}&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item label="优惠方式：">
          <span>{{ detail.couponType | ActDiscountType }}</span>
        </el-form-item>
        <el-form-item label="面额：" v-if="detail.couponType === 1">
          <span>{{ detail.reduce }}</span
          >元
        </el-form-item>
        <el-form-item label="满减条件：" v-if="detail.couponType === 1">
          <span>{{ detail.orderReachPrice }}</span
          >元可用
        </el-form-item>
        <el-form-item label="折扣：" v-if="detail.couponType === 3">
          <span>{{ detail.percentage }}</span
          >折
        </el-form-item>
        <el-form-item label="减免上限：" v-if="detail.couponType === 3">
          <span>{{ detail.maxDiscountPrice }}</span>
        </el-form-item>
        <el-form-item label="数量：">
          <span>{{ detail.stock }}</span>
        </el-form-item>
        <el-form-item label="有效期：">
          <span>{{ detail.startAt }}至{{ detail.endAt }}</span>
        </el-form-item>
        <el-form-item label="有效时段：">
          <span>{{ detail.hourMinuteStartTime }}-{{ detail.hourMinuteEndTime }}</span>
        </el-form-item>

        <el-form-item label="创建时间：">
          <span>{{ detail.createTime }}</span>
        </el-form-item>
        <el-form-item label="创建人：">
          <span>{{ detail.lastEditor }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/utils/Api';
import { ActDiscountType } from '@/utils/Mapping';

export default {
  props: ['promotionId', 'visible'],
  data() {
    return {
      // 新增活动
      detail: {}
    };
  },
  filters: {
    ActDiscountType(val) {
      return ActDiscountType[val];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getDetail() {
      let res = await this.$axios.post(Api.NEW_COUPON_DETAIL, { promotionId: this.promotionId });
      this.detail = res;
    }
  }
};
</script>

<style lang="less" scoped>
.condition {
  display: flex;
  /deep/ .el-input {
    width: 80%;
    padding: 0 10px;
  }
}
</style>
