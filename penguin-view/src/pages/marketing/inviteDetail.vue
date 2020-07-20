<template>
  <el-form label-width="94px" :model="couponHeaderDetail" ef="couponHeaderDetail" style="margin-top: 20px;">
    <el-tag>受邀人</el-tag>
    <el-form-item label="券类型：">
      <el-checkbox-group v-model="couponHeaderDetail.inviteePrizeType" disabled="disabled">
        <el-checkbox label="1">满减券</el-checkbox>
        <el-checkbox label="5">折扣券</el-checkbox>
        <el-checkbox label="6">免费体验券</el-checkbox>
        <el-checkbox v-if="couponHeaderDetail.type == 2" label="2">现金</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form label-width="94px" :model="fullDetail">
      <el-form-item label="适用类型：">
        <el-checkbox-group v-model="fullDetail.usePosition" disabled>
          <el-checkbox label="1">洗衣机</el-checkbox>
          <el-checkbox label="2">烘干机</el-checkbox>
          <el-checkbox label="3">洗鞋机</el-checkbox>
          <el-checkbox label="4">吹风机</el-checkbox>
          <el-checkbox label="5">充电桩</el-checkbox>
          <el-checkbox label="6">饮水机</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="适用店铺：" prop="useScope" v-if="fullDetail.useScope == 0||fullDetail.useScope==1&&isShowUseScope">
        <span v-if="fullDetail.useScope == 0">通用</span>
        <span v-else-if="fullDetail.useScope == 1 && isShowUseScope">指定店铺</span>
      </el-form-item>
    </el-form>
    <el-form label-width="94px" :model="fullDetail">
      <full-detail v-if="isShowFullDetail" :fullDetail="fullDetail" :couponHeaderDetail="couponHeaderDetail"></full-detail>
      <discount-detail v-if="isShowDiscountDetail" :discountDetail="discountDetail" :couponHeaderDetail="couponHeaderDetail"></discount-detail>
      <free-detail v-if="isShowFreeDetail" :freeDetail="freeDetail" :couponHeaderDetail="couponHeaderDetail"></free-detail>
      <cash-detail v-if="isShowCashDetail" :cashDetail="cashDetail" :couponHeaderDetail="couponHeaderDetail"></cash-detail>
    </el-form>
  </el-form>
</template>

<script type="text/ecmascript-6">
import fullDetail from './fullDetail';
import discountDetail from './discountDetail';
import freeDetail from './freeDetail';
import cashDetail from './cashDetail';
export default {
  props: ['couponHeaderDetail'],
  data() {
    return {
      fullDetail: {
        type: 1,
        usePosition: null,
        useScope: null,
        vouchers: []
      },
      discountDetail: {
        type: 5,
        usePosition: null,
        useScope: null,
        vouchers: []
      },
      freeDetail: {
        type: 6,
        usePosition: null,
        useScope: null,
        vouchers: []
      },
      cashDetail: {
        vouchers: []
      },
      isShowFullDetail: false, // 展示满减券详情
      isShowDiscountDetail: false, // 展示折扣券详情
      isShowFreeDetail: false, // 展示免费体验券详情
      isShowCashDetail: false, // 展示现金详情
      isShowDialogConfigShop: false
    };
  },
  components: {
    fullDetail,
    discountDetail,
    freeDetail,
    cashDetail
  },
  computed: {
    isShowUseScope() {
      if (this.couponHeaderDetail.conditionType === 0 || this.couponHeaderDetail.conditionType === 1 || this.couponHeaderDetail.conditionType === 3) {
        if (this.couponHeaderDetail.type === 2 || this.couponHeaderDetail.type === 3) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  },
  mounted() {
    this.couponHeaderDetail.inviteePrizeType = this.couponHeaderDetail.inviteePrizeType.split(',');
    // 赋值
    if (this.couponHeaderDetail.inviteePrizeType && this.couponHeaderDetail.inviteePrizeType.length > 0) {
      this.couponHeaderDetail.inviteePrizes.map(item => {
        if (item.type === 1) {
          // 满减券
          // 详细信息赋值
          this.fullDetail.type = item.type;
          this.fullDetail.usePosition = item.usePosition.split(',');
          this.fullDetail.useScope = item.useScope;
          this.fullDetail.vouchers.push(item);
          this.isShowFullDetail = true;
        } else if (item.type === 5) {
          // 折扣券
          this.fullDetail.type = item.type;
          this.fullDetail.usePosition = item.usePosition.split(',');
          this.fullDetail.useScope = item.useScope;
          this.discountDetail.vouchers.push(item);
          this.isShowDiscountDetail = true;
        } else if (item.type === 6) {
          // 免费体验券
          this.fullDetail.type = item.type;
          this.fullDetail.usePosition = item.usePosition.split(',');
          this.fullDetail.useScope = item.useScope;
          this.freeDetail.vouchers.push(item);
          this.isShowFreeDetail = true;
        } else if (item.type === 2) {
          // 现金
          this.cashDetail.vouchers.push(item);
          this.isShowCashDetail = true;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
</style>
