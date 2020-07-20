<template>
  <el-form label-width="94px" :model="beInviteFormData" :rules="beInviteFormDataRules" ref="beInviteFormData">
    <el-form-item label="券类型：" prop="inviteePrizeType">
      <el-checkbox-group v-model="beInviteFormData.inviteePrizeType" :disabled="!isEditorAdd">
        <el-checkbox label="1" name="inviteePrizeType" @change="handleVoucherType(1, $event)">满减券</el-checkbox>
        <el-checkbox label="5" name="inviteePrizeType" @change="handleVoucherType(5, $event)">折扣券</el-checkbox>
        <el-checkbox label="6" name="inviteePrizeType" @change="handleVoucherType(6, $event)">免费体验券</el-checkbox>
        <el-checkbox label="2" name="inviteePrizeType" v-if="activityType === 2" @change="handleVoucherType(2, $event)">现金</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="适用类型：" prop="usePosition">
      <el-checkbox-group v-model="beInviteFormData.usePosition" :disabled="!isEditorAdd">
        <el-checkbox label="1">洗衣机</el-checkbox>
        <el-checkbox label="2">烘干机</el-checkbox>
        <el-checkbox label="3">洗鞋机</el-checkbox>
        <el-checkbox label="4">吹风机</el-checkbox>
        <el-checkbox label="5">充电桩</el-checkbox>
        <el-checkbox label="6">饮水机</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="适用店铺：" prop="inviteeJoinType">
      <el-radio-group v-model="beInviteFormData.inviteeJoinType" :disabled="!isEditorAdd">
        <el-radio :label="0">通用</el-radio>
        <el-radio :label="1">指定店铺</el-radio>
      </el-radio-group>
    </el-form-item>
    <full-coupon v-if="isShowFullcoupon" :isEditorAdd="isEditorAdd" :fullCouponData="fullCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="fullCoupon"></full-coupon>
    <discount-coupon v-if="isShowDisCountDialog" :isEditorAdd="isEditorAdd" :discountCouponData="discountCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="discountCoupon"></discount-coupon>
    <free-coupon v-if="isShowFreeCoupon" :isEditorAdd="isEditorAdd" :freeCouponData="freeCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="freeCoupon"></free-coupon>
    <cash-coupon v-if="isShowCashCoupon" :isEditorAdd="isEditorAdd" :cashCouponData="cashCouponData" :startTime="startTime" :activityType="activityType" ref="cashCoupon"></cash-coupon>

  </el-form>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import fullCoupon from './fullCoupon';
import discountCoupon from './discountCoupon';
import freeCoupon from './freeCoupon';
import cashCoupon from './cashCoupon';
import { DateFormat } from '@/utils/tool';
export default {
  props: ['activityType', 'isEditorAdd', 'startTime', 'endTime', 'couponHeaderDatatype', 'beinviteForm'],
  data() {
    return {
      beInviteFormData: {
        inviteePrizeType: [],
        usePosition: ['1', '2', '3', '4', '5', '6'],
        inviteeJoinType: 0,
        inviteePrizeList: []
      },
      // 适用类型或适用店铺验证
      beInviteFormDataRules: {
        usePosition: [{ required: true, message: '请选择适用类型', trigger: 'change' }],
        inviteeJoinType: [{ required: true, message: '请选择适用店铺', trigger: 'change' }],
        prizeType: [{ type: 'array', required: true, message: '请选择券类型', trigger: 'change' }]
      },

      // 优惠券信息
      fullCouponData: {
        type: 1,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowFullcoupon: false, // 满减券是否展示

      discountCouponData: {
        type: 5,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowDisCountDialog: false, // 折扣券是否展示

      freeCouponData: {
        type: 6,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowFreeCoupon: false, // 免费体验券是否展示

      cashCouponData: {
        vouchers: []
      },
      isShowCashCoupon: false, // 现金是否展示

      fullCouponList: [],
      discountCouponList: [],
      freeCouponList: [],
      cashCouponList: [],

      fullEditList: [],
      freeEditList: [],
      discountEditList: [],
      cashEditList: []
    };
  },
  components: {
    fullCoupon,
    discountCoupon,
    cashCoupon,
    freeCoupon
  },
  mounted() {
    if (!this.isEditorAdd) {
      this.beInviteFormData.inviteeJoinType = this.beinviteForm.inviteeJoinType;
      this.beInviteFormData.inviteePrizeType = this.beinviteForm.inviteePrizeType.split(',');
      if (this.beinviteForm.inviteePrizes && this.beinviteForm.inviteePrizes.length > 0) {
        this.beinviteForm.inviteePrizes.map(item => {
          if (item.type === 1) {
            // 满减券
            // 编辑信息赋值
            this.isShowFullcoupon = true;
            this.beInviteFormData.usePosition = item.usePosition.split(',');
            this.beInviteFormData.useScope = item.useScope;
            this.fullEditList.push(item);
            this.fullEditList = this.fullEditList.map(item => {
              let data = {
                id: item.id,
                type: item.type,
                outId: item.outId,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.startDate,
                endDate: item.endDate,
                startTime: item.startTime,
                endTime: item.endTime,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: [item.startTime, item.endTime],
                isShowCouponAddBtn: false,
                date: [item.startDate, item.endDate]
              };
              return data;
            });
          } else if (item.type === 5) {
            // 折扣券
            // 编辑信息赋值
            this.isShowDisCountDialog = true;
            this.discountCouponData.vouchers = [];
            this.beInviteFormData.usePosition = item.usePosition.split(',');
            this.beInviteFormData.useScope = item.useScope;
            this.discountEditList.push(item);
            this.discountEditList = this.discountEditList.map(item => {
              let data = {
                id: item.id,
                type: item.type,
                outId: item.outId,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.startDate,
                endDate: item.endDate,
                startTime: item.startTime,
                endTime: item.endTime,
                maxDerate: item.maxDerate,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: [item.startTime, item.endTime],
                isShowCouponAddBtn: false,
                date: [item.startDate, item.endDate]
              };
              return data;
            });
          } else if (item.type === 6) {
            // 免费体验券
            // 编辑信息赋值
            this.isShowFreeCoupon = true;
            this.freeCouponData.vouchers = [];
            this.beInviteFormData.usePosition = item.usePosition.split(',');
            this.beInviteFormData.useScope = item.useScope;
            this.freeEditList.push(item);
            this.freeEditList = this.freeEditList.map(item => {
              let data = {
                id: item.id,
                type: item.type,
                outId: item.outId,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.startDate,
                endDate: item.endDate,
                startTime: item.startTime,
                endTime: item.endTime,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: [item.startTime, item.endTime],
                isShowCouponAddBtn: false,
                date: [item.startDate, item.endDate]
              };
              return data;
            });
          } else if (item.type === 2) {
            // 现金
            // 编辑信息赋值
            this.isShowCashCoupon = true;
            this.cashCouponData.vouchers = [];
            this.cashEditList.push(item);
            this.cashEditList = this.cashEditList.map(item => {
              let data = {
                id: item.id,
                type: item.type,
                value: item.value,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                isShowCouponAddBtn: false
              };
              return data;
            });
          }
          this.fullCouponData.vouchers = [...this.fullEditList];
          this.discountCouponData.vouchers = [...this.discountEditList];
          this.freeCouponData.vouchers = [...this.freeEditList];
          this.cashCouponData.vouchers = [...this.cashEditList];
        });
      }
    }
  },
  methods: {
    // 选择券类型
    handleVoucherType(value, flag) {
      if (flag && value === 1) {
        // 满减券
        this.fullCouponData = {
          // 清空数据
          type: 1,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 1,
          outId: null, // 金额
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.fullCouponData.vouchers.push(coupon);
        this.isShowBtn(this.fullCouponData.vouchers);
        this.isShowFullcoupon = true;
      } else if (!flag && value === 1) {
        this.fullCouponData = {
          // 清空数据
          type: 1,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowFullcoupon = false;
      } else if (flag && value === 2) {
        // 现金
        this.cashCouponData = {
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 2,
          price: null, // 金额
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.cashCouponData.vouchers.push(coupon);
        this.isShowBtn(this.cashCouponData.vouchers);
        this.isShowCashCoupon = true;
      } else if (!flag && value === 2) {
        this.cashCouponData = {
          vouchers: []
        };
        this.isShowCashCoupon = false;
      } else if (flag && value === 5) {
        // 折扣券
        this.discountCouponData = {
          type: 5,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 5,
          outId: null, // 金额
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          maxDerate: null, // 减免上限
          //
          isShowCouponAddBtn: false
        };
        this.discountCouponData.vouchers.push(coupon);
        this.isShowBtn(this.discountCouponData.vouchers);
        this.isShowDisCountDialog = true;
      } else if (!flag && value === 5) {
        this.discountCouponData = {
          type: 5,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowDisCountDialog = false;
      } else if (flag && value === 6) {
        // 免费体验券
        this.getVoucherSelect();
        this.freeCouponData = {
          type: 6,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 6,
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.freeCouponData.vouchers.push(coupon);
        this.isShowBtn(this.freeCouponData.vouchers);
        this.isShowFreeCoupon = true;
      } else if (!flag && value === 6) {
        this.freeCouponData = {
          type: 6,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowFreeCoupon = false;
      }
    },
    // 获取优惠券金额
    getVoucherSelect() {
      this.$axios.post(Api.VOUCHER_SELECT, { type: 2 }).then(resp => {
        if (resp && resp.length > 0) {
          this.lastOutID = resp[resp.length - 1].id || null;
        }
      });
    },
    // 判断'+ - '按钮显示
    isShowBtn(list) {
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          list[i].isShowCouponAddBtn = true;
        } else {
          list[i].isShowCouponAddBtn = false;
        }
      }
    },
    formatBeInvitedData() {
      var total_chance = 0;
      var flag = true;
      if (this.beInviteFormData.inviteePrizeType && this.beInviteFormData.inviteePrizeType.length > 0) {
        this.beInviteFormData.inviteePrizeType.map(item => {
          if (item == 1) {
            // 满减券
            let total_num = 0;
            var fullData = this.$refs.fullCoupon.fullCouponData || null; // 满减券数据
            fullData.usePosition = this.beInviteFormData.usePosition.join(',');
            fullData.useScope = this.beInviteFormData.inviteeJoinType;
            // 组装数据
            fullData.vouchers = fullData.vouchers.map(item => {
              total_chance += parseFloat(item.chance);
              total_num += parseFloat(item.num);
              let data = {
                id: item.id,
                type: item.type,
                outId: item.outId,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.date ? item.date[0] : null,
                endDate: item.date ? item.date[1] : null,
                startTime: item.time ? item.time[0] : null,
                endTime: item.time ? item.time[1] : null,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: item.time,
                isShowCouponAddBtn: false,
                date: item.date
              };
              return data;
            });
            this.isShowBtn(fullData.vouchers);
            if (this.$refs.fullCoupon.validateFullForm()) {
              // 验证通过
              this.fullCouponList = [];
              this.fullCouponList.push(fullData);
            } else {
              flag = false;
            }
            // 验证发放次数的总和不能小于或者等于0
            if (this.couponHeaderDatatype === 2) {
              let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
              if (total_num <= 0) {
                this.$message.error('满减券' + addeditTest + '的总和必须大于0');
                flag = false;
              }
            }
          } else if (item == 2) {
            // 现金
            let total_num = 0;
            var cashData = this.$refs.cashCoupon.cashCouponData || null; // 现金数据
            // 组装数据
            cashData.vouchers = cashData.vouchers.map(item => {
              total_chance += parseFloat(item.chance);
              total_num += parseFloat(item.num);
              let data = {
                id: item.id,
                type: item.type,
                value: item.value,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                isShowCouponAddBtn: false
              };
              return data;
            });
            this.isShowBtn(cashData.vouchers);
            if (this.$refs.cashCoupon.validateFullForm()) {
              // 验证通过
              this.cashCouponList = [];
              this.cashCouponList = [...cashData.vouchers];
            } else {
              flag = false;
            }
            // 验证发放次数的总和不能小于或者等于0
            if (this.couponHeaderDatatype === 2) {
              let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
              if (total_num <= 0) {
                this.$message.error('现金' + addeditTest + '的总和必须大于0');
                flag = false;
              }
            }
          } else if (item == 5) {
            // 折扣券
            let total_num = 0;
            var discountData = this.$refs.discountCoupon.discountCouponData || null; // 折扣券数据
            discountData.usePosition = this.beInviteFormData.usePosition.join(',');
            discountData.useScope = this.beInviteFormData.inviteeJoinType;
            // 组装数据
            discountData.vouchers = discountData.vouchers.map(item => {
              total_chance += parseFloat(item.chance);
              total_num += parseFloat(item.num);
              let data = {
                id: item.id,
                type: item.type,
                outId: item.outId,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.date ? item.date[0] : null,
                endDate: item.date ? item.date[1] : null,
                startTime: item.time ? item.time[0] : null,
                endTime: item.time ? item.time[1] : null,
                maxDerate: item.maxDerate,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: item.time,
                isShowCouponAddBtn: false,
                date: item.date
              };
              return data;
            });
            this.isShowBtn(discountData.vouchers);
            if (this.$refs.discountCoupon.validateFullForm()) {
              // 验证通过
              this.discountCouponList = [];
              this.discountCouponList.push(discountData);
            } else {
              flag = false;
            }
            // 验证发放次数的总和不能小于或者等于0
            if (this.couponHeaderDatatype === 2) {
              let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
              if (total_num <= 0) {
                this.$message.error('折扣券' + addeditTest + '的总和必须大于0');
                flag = false;
              }
            }
          } else if (item == 6) {
            // 免费体验券
            let total_num = 0;
            var freeData = this.$refs.freeCoupon.freeCouponData || null; // 免费体验券数据
            freeData.usePosition = this.beInviteFormData.usePosition.join(',');
            freeData.useScope = this.beInviteFormData.inviteeJoinType;
            // 组装数据
            freeData.vouchers = freeData.vouchers.map(item => {
              total_chance += parseFloat(item.chance);
              total_num += parseFloat(item.num);
              let data = {
                id: item.id,
                type: item.type,
                outId: this.lastOutID,
                dateType: item.dateType,
                startDays: item.startDays,
                day: item.day,
                startDate: item.date ? item.date[0] : null,
                endDate: item.date ? item.date[1] : null,
                startTime: item.time ? item.time[0] : null,
                endTime: item.time ? item.time[1] : null,
                prizeNum: item.prizeNum, // 已发放数量
                num: item.num, // 发放数量
                assocNum: item.assocNum, // 中奖次数/人
                chance: item.chance, // 概率
                //
                time: item.time,
                isShowCouponAddBtn: false,
                date: item.date
              };
              return data;
            });
            this.isShowBtn(freeData.vouchers);
            if (this.$refs.freeCoupon.validateFullForm()) {
              // 验证通过
              this.freeCouponList = [];
              this.freeCouponList.push(freeData);
            } else {
              flag = false;
            }
            // 验证发放次数的总和不能小于或者等于0
            if (this.couponHeaderDatatype === 2) {
              let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
              if (total_num <= 0) {
                this.$message.error('免费体验券' + addeditTest + '的总和必须大于0');
                flag = false;
              }
            }
          }
        });
        // 验证中奖概率
        if (total_chance > 100) {
          this.$message.error('所有奖项中奖概率相加不能超过100%');
          flag = false;
        }
      }
      if (!flag) {
        return;
      }
      this.beInviteFormData.inviteePrizeList = [...this.fullCouponList, ...this.discountCouponList, ...this.freeCouponList, ...this.cashCouponList];
      return this.beInviteFormData;
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
</style>
