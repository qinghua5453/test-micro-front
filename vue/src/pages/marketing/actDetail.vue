<template>
  <div>
    <!--活动详情-->
    <el-dialog class="coupon_activity_detail" title="活动详情" :visible.sync="visible" :before-close="modalClose">
      <el-form :model="couponHeaderDetail" label-width="94px">
        <el-tag>活动信息</el-tag>
        <el-form-item label="活动名称：">
          <span>{{couponHeaderDetail.name}}</span>
        </el-form-item>
        <el-form-item label="活动时间：">
          <span>{{couponHeaderDetail.startTime}}至{{couponHeaderDetail.endTime}}</span>
        </el-form-item>
        <el-form-item label="活动类型：">
          <span v-if="couponHeaderDetail.type == 1">手动领取</span>
          <span v-else-if="couponHeaderDetail.type == 2">抽奖</span>
          <span v-else-if="couponHeaderDetail.type == 3">自动发放</span>
          <span v-else-if="couponHeaderDetail.type == 4">扫码领券</span>
          <span v-else-if="couponHeaderDetail.type == 5">邀友活动</span>
          <span v-else-if="couponHeaderDetail.type == 6">弹窗</span>
        </el-form-item>
        <el-form-item label="费用承担：">
          <span v-if="couponHeaderDetail.sponsor == 1">平台</span>
          <span v-else-if="couponHeaderDetail.sponsor == 2">运营商</span>
          <span v-else-if="couponHeaderDetail.sponsor == 3">共同承担{{'(平台:' + this.couponHeaderDetail.platformRatio + '%' + '运营商:' + this.couponHeaderDetail.operatorRatio + '%)'}}</span>
        </el-form-item>
        <el-form-item label="参与对象：">
          <span v-if="couponHeaderDetail.conditionType == 0">不限</span>
          <span v-else-if="couponHeaderDetail.conditionType == 1">平台新用户</span>
          <span v-else-if="couponHeaderDetail.conditionType == 2">平台老用户</span>
          <span v-else-if="couponHeaderDetail.conditionType == 7">店铺新用户</span>
          <span v-else-if="couponHeaderDetail.conditionType == 3">首次注册且7天内未消费</span>
          <span v-else-if="couponHeaderDetail.conditionType == 4">注册且已消费</span>
          <span v-else-if="couponHeaderDetail.conditionType == 8">购买店铺VIP</span>
          <span v-else-if="couponHeaderDetail.conditionType == 9">VIP邀友</span>
          <span v-else-if="couponHeaderDetail.conditionType == 10">店铺拉新邀友</span>
        </el-form-item>
        <el-form-item label="参与店铺：">
          <span v-if="couponHeaderDetail.joinType == 0">全部</span>
          <span v-else-if="couponHeaderDetail.joinType == 1">指定店铺</span>
          <label class="name-active set-shop" v-if="couponHeaderDetail.joinType == 1" @click="openShopListDialog(couponHeaderDetail.shopIds)">查看店铺</label>
        </el-form-item>
        <el-tag>{{couponHeaderDetail.type===5 ? '邀请人':'优惠券信息'}}</el-tag>
        <el-form-item label="券类型：">
          <el-checkbox-group v-model="couponHeaderDetail.prizeType" disabled="disabled">
            <el-checkbox label="1">满减券</el-checkbox>
            <el-checkbox label="5">折扣券</el-checkbox>
            <el-checkbox label="6">免费体验券</el-checkbox>
            <el-checkbox v-if="couponHeaderDetail.type == 2 || couponHeaderDetail.type == 6" label="2">现金</el-checkbox>
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
          <el-form-item label="券总量：" v-if="couponHeaderDetail.type ===4">
            <span>{{couponHeaderDetail.limitSum}}</span>
          </el-form-item>
          <el-form-item label="参与次数限制：" label-width="widht:140px" v-if="couponHeaderDetail.type ===4">
            <span>{{couponHeaderDetail.limitNum}}</span>
          </el-form-item>
        </el-form>
        <el-form label-width="94px" :model="fullDetail">
          <full-detail v-if="isShowFullDetail" :fullDetail="fullDetail" :couponHeaderDetail="couponHeaderDetail"></full-detail>
          <discount-detail v-if="isShowDiscountDetail" :discountDetail="discountDetail" :couponHeaderDetail="couponHeaderDetail"></discount-detail>
          <free-detail v-if="isShowFreeDetail" :freeDetail="freeDetail" :couponHeaderDetail="couponHeaderDetail"></free-detail>
          <cash-detail v-if="isShowCashDetail" :cashDetail="cashDetail" :couponHeaderDetail="couponHeaderDetail"></cash-detail>
        </el-form>
        <invite-detail v-if="couponHeaderDetail.type===5" :couponHeaderDetail="inviteDetail"></invite-detail>
      </el-form>
    </el-dialog>
    <!--  已配置店铺  -->
    <selected-shop :visible.sync="isShowDialogConfigShop" v-if="isShowDialogConfigShop" :couponHeaderDetail="couponHeaderDetail"></selected-shop>
  </div>
</template>

<script>
import Api from '@/utils/Api';
import selectedShop from './selectedShop';
import actDetail from './actDetail';
import fullDetail from './fullDetail';
import discountDetail from './discountDetail';
import freeDetail from './freeDetail';
import cashDetail from './cashDetail';
import inviteDetail from './inviteDetail';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showActivtiyDetailId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      couponHeaderDetail: {},
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
      isShowDialogConfigShop: false,
      inviteDetail: {}
    };
  },
  created() {
    this.openEventDetailDialog();
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
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    // 查看活动详情
    openEventDetailDialog() {
      // 清空详细数据
      this.fullDetail.vouchers = [];
      this.discountDetail.vouchers = [];
      this.freeDetail.vouchers = [];
      this.cashDetail.vouchers = [];
      // 详细信息
      this.isShowFullDetail = false;
      this.isShowDiscountDetail = false;
      this.isShowFreeDetail = false;
      this.isShowCashDetail = false;
      this.$axios.post(Api.MEMBER_EVENT_DETAILS, { id: this.showActivtiyDetailId }).then(resp => {
        this.isShowActivtiyDetal = true;
        this.inviteDetail = resp;
        // 给详情信息赋值
        this.couponHeaderDetail.id = resp.id;
        this.couponHeaderDetail.name = resp.name;
        this.couponHeaderDetail.type = resp.type;
        this.couponHeaderDetail.sponsor = resp.sponsor;
        this.couponHeaderDetail.platformRatio = resp.platformRatio;
        this.couponHeaderDetail.operatorRatio = resp.operatorRatio;
        this.couponHeaderDetail.conditionType = resp.conditionType;
        this.couponHeaderDetail.startTime = resp.startTime;
        this.couponHeaderDetail.endTime = resp.endTime;
        this.couponHeaderDetail.prizeType = resp.prizeType.split(',');
        this.couponHeaderDetail.joinType = resp.joinType;
        this.couponHeaderDetail.shopIds = resp.shopIdList;
        this.couponHeaderDetail.limitSum = resp.limitSum;
        this.couponHeaderDetail.limitNum = resp.limitNum;
        this.couponHeaderDetail.shopCondition = resp.shopCondition;
        // 赋值
        if (resp.prizes && resp.prizes.length > 0) {
          resp.prizes.map(item => {
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
      });
    },
    // 关闭详情弹窗
    handleCanceldetail() {
      this.isShowActivtiyDetal = false;
      this.isShowFullDetail = false;
      this.isShowDiscountDetail = false;
      this.isShowFreeDetail = false;
      this.isShowCashDetail = false;
    },
    // 查看已配置店铺信息
    openShopListDialog(shopIds) {
      this.isShowDialogConfigShop = true;
    }
  },
  components: {
    selectedShop,
    actDetail,
    fullDetail,
    discountDetail,
    freeDetail,
    cashDetail,
    inviteDetail
  }
};
</script>

<style lang="less">
</style>
