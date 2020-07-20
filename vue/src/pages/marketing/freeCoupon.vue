<template>
    <!--免费体验券信息-->
    <div style="margin-top:40px;">
        <el-form :rules="rules" :model="freeCouponData"  ref="freeCouponData">
            <el-table border :data="freeCouponData.vouchers" style="width: 100%" class="my-table">
                <el-table-column prop="type" label="类型" fixed>
                    <template slot-scope="scope">
                        {{freeCouponData.vouchers[scope.$index].type === 6 ? '免费体验券' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="validType" label="有效期类型"  width="130">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.dateType'" :rules='rules.dateType'>
                             <el-select v-model="scope.row.dateType"  placeholder="请选择" :disabled="!isEditorAdd" @change="handleDateType">
                                <el-option label="相对时间" :value="0"></el-option>
                                <el-option label="固定时间" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="生效日" width="160">
                     <template slot-scope="scope">
                        <el-form-item v-if="freeCouponData.vouchers[scope.$index].dateType === 0" :prop="'vouchers.' + scope.$index + '.startDays'" :rules='rules.startDays'>
                             自领取日&nbsp;&nbsp;<el-input style="width:35%;" v-model="scope.row.startDays" :disabled="!isEditorAdd"/>&nbsp;&nbsp;天
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="有效期" width="280">
                    <template slot-scope="scope">
                        <el-form-item v-if="freeCouponData.vouchers[scope.$index].dateType === 0" :prop="'vouchers.' + scope.$index + '.day'" :rules='rules.day'>
                             <el-input style="width:80%;" v-model="scope.row.day" :disabled="!isEditorAdd"/>&nbsp;&nbsp;天
                        </el-form-item>
                        <el-form-item v-if="freeCouponData.vouchers[scope.$index].dateType === 1" :prop="'vouchers.' + scope.$index + '.date'" :rules='rules.date'>
                            <el-date-picker
                                v-model="scope.row.date"
                                type="daterange"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width:250px;">
                            </el-date-picker>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="有效时段" width="200">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.time'" :rules='rules.time'>
                           <el-time-picker
                                :disabled="!isEditorAdd"
                                is-range
                                style="width:180px"
                                v-model="scope.row.time"
                                value-format="HH:mm"
                                format="HH:mm"
                                range-separator="至"
                                start-placeholder="开始"
                                end-placeholder="结束"
                                placeholder="选择时间范围">
                            </el-time-picker>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="130" v-if="activityType === 2 && !isEditorAdd">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.prizeNum'" :rules='rules.prizeNum'>
                            <el-input v-model="scope.row.prizeNum" :disabled="!isEditorAdd"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column :label="isEditorAdd ? '发放数量' : '剩余数量'" width="200" v-if="activityType === 2">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.num'" :rules='rules.num'>
                            <el-input v-model="scope.row.num"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="中奖次数/人" width="200" v-if="activityType === 2">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.assocNum'" :rules='rules.assocNum'>
                            <el-input v-model="scope.row.assocNum"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" width="230" v-if="activityType === 2">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.chance'" :rules='rules.chance'>
                            <el-input style="width:80%;" v-model="scope.row.chance"></el-input>&nbsp;&nbsp;%
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="functionDescribe" label="操作" width="150" v-if="isEditorAdd">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleActAddCoupon(scope.$index)" v-if="freeCouponData.vouchers[scope.$index].isShowCouponAddBtn"> + </el-button>
                        <el-button type="primary" size="mini" @click="handleRemoveActCoupon(scope.$index)" v-if="freeCouponData.vouchers.length > 1" >  - </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import Api from "@/utils/Api";
import moment from "moment";

export default {
  data() {
    // 验证生效日
    var checkStartDays = (rule, value, callback) => {
      let reg_startDays = /^[0-9]\d*$/; // 验证0-9整数
      if (!reg_startDays.test(value)) {
        return callback(new Error("必须是大于或者等于0的整数"));
      } else {
        callback();
      }
    };
    // 验证有效期
    var checkDay = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/; // 验证正整数
      if (!reg.test(value)) {
        return callback(new Error("必须是大于0的整数"));
      } else {
        callback();
      }
    };
    // 验证发放数量
    var checkNum = (rule, value, callback) => {
      let reg = /^(0|[1-9][0-9]*)$/; // 验证大于或者等于0的正整数
      if (!reg.test(value)) {
        return callback(new Error("必须是大于或者等于0的正整数"));
      } else {
        callback();
      }
    };
    // 验证中奖次数
    var checkAssocNum = (rule, value, callback) => {
      let reg = /^(0|[1-9][0-9]*)$/; // 验证大于或者等于0的正整数
      if (!reg.test(value)) {
        return callback(new Error("必须是大于或者等于0的正整数"));
      } else {
        callback();
      }
    };
    // 验证中奖概率
    var checkChance = (rule, value, callback) => {
      let reg = /^([0-9]\d*)(\s|$|\.\d{1,2}\b)/; // 验证概率大于或者等于0，并且包含两位小数
      if (!reg.test(value)) {
        return callback(new Error("必须是大于或者等于0，允许两位小数"));
      } else {
        callback();
      }
    };
    // 验证有效期
    var checkDate = (rule, value, callback) => {
      if (moment(value[0]) < moment(this.startTime)) {
        return callback(
          new Error("有效期开始时间必须大于或者等于活动开始时间")
        );
      } else if (moment(value[1]) < moment(value[0])) {
        return callback(
          new Error("有效期结束时间必须大于或者等于有效期开始时间")
        );
      } else if (moment(value[1]) < moment(this.endTime)) {
        return callback(
          new Error("有效期结束时间必须大于或者等于活动结束时间")
        );
      } else {
        callback();
      }
    };
    return {
      rules: {
        dateType: {
          required: true,
          message: "请选择有效期类型",
          trigger: "change"
        },
        startDays: [
          { required: true, message: "请填写生效日", trigger: "blur" },
          { validator: checkStartDays, trigger: "blur" }
        ],
        day: [
          { required: true, message: "请填写有效期", trigger: "blur" },
          { validator: checkDay, trigger: "blur" }
        ],
        date: [
          { required: true, message: "请选择有效期", trigger: "change" },
          { validator: checkDate, trigger: "change" }
        ],
        time: { required: true, message: "请选择有效时段", trigger: "change" },
        num: [
          { required: true, message: "请填写发放数量", trigger: "blur" },
          { validator: checkNum, trigger: "blur" }
        ],
        assocNum: [
          { required: true, message: "请填写中奖次数", trigger: "blur" },
          { validator: checkAssocNum, trigger: "blur" }
        ],
        chance: [
          { required: true, message: "请填写概率", trigger: "blur" },
          { validator: checkChance, trigger: "blur" }
        ]
      },
      lastOutID: null
    };
  },
  props: [
    "freeCouponData",
    "startTime",
    "activityType",
    "isEditorAdd",
    "endTime"
  ],
  methods: {
    // 新增活动优惠券
    handleActAddCoupon(index) {
      let addActCoupon = {
        id: null,
        outId: null,
        type: 6,
        dateType: 0, // 时间类型
        startDays: 0, // 生效日
        day: null, // 有效期
        date: null, // 有效期
        time: ["00:00", "23:59"],
        num: null, // 发放数量
        assocNum: null, // 中奖次数/人
        chance: null, // 概率
        //
        isShowCouponAddBtn: false
      };
      this.freeCouponData.vouchers.push(addActCoupon);
      this.isShowBtn(this.freeCouponData.vouchers);
    },
    // 移除活动优惠券
    handleRemoveActCoupon(index) {
      if (this.freeCouponData.vouchers.length > 1) {
        this.freeCouponData.vouchers.splice(index, 1);
      }
      this.isShowBtn(this.freeCouponData.vouchers);
      this.$refs.freeCouponData.clearValidate();
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
    // 表单是否验证通过
    validateFullForm() {
      let flag = false;
      this.$refs["freeCouponData"].validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 清除验证
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
    },
    // 更改有效期类型
    handleDateType() {
      this.$refs.freeCouponData.clearValidate();
    }
  }
};
</script>

<style lang="less">
</style>
