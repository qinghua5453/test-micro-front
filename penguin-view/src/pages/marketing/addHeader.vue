<template>
  <!--新增活动头部信息-->
  <div>
    <el-form :model="couponHeaderData" :rules="addEventRules" label-width="94px" ref="couponHeaderData">
      <el-tag>活动信息</el-tag>
      <el-form-item label="活动名称：" prop="name">
        <el-input clearable v-model="couponHeaderData.name" auto-complete="off" :disabled="!isEditorAdd"></el-input>
      </el-form-item>
      <el-form-item label="活动时间：" class="form-item-m" required>
        <el-col :span="6">
          <el-form-item prop="startTime">
            <el-date-picker :disabled="isEdit" v-model="couponHeaderData.startTime" type="date" :picker-options="pickerBeginDateAfter" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="开始日期" style="width: 100%;" @change="handleStartTime"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-form-item prop="endTime">
            <el-date-picker v-model="couponHeaderData.endTime" type="date" :picker-options="pickerEndDateAfter" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="结束日期" @change="handleEndTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="活动类型：" prop="collectionType">
        <el-radio-group v-model="couponHeaderData.type" :disabled="!isEditorAdd">
          <el-radio :label="13" @change="changeActType(13, $event)">赠券活动</el-radio>
          <el-radio :label="2" @change="changeActType(2, $event)">抽奖活动</el-radio>
          <el-radio :label="4" @change="changeActType(4, $event)">扫码活动</el-radio>
          <el-radio :label="5" @change="changeActType(5, $event)">邀友活动</el-radio>
          <el-radio :label="6" @change="changeActType(6, $event)">弹窗</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领取方式：" prop="receiveWay" v-if="couponHeaderData.type===13">
        <el-radio-group v-model="couponHeaderData.receiveWay" :disabled="!isEditorAdd">
          <el-radio :label="1" @change="changeReceiveWay(1)">手动领取</el-radio>
          <el-radio :label="3" @change="changeReceiveWay(3)">无需领取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="费用承担：" prop="sponsor">
        <el-radio-group v-model="couponHeaderData.sponsor" :disabled="!isEditorAdd || isScanType">
          <el-radio :label="1">平台</el-radio>
          <el-radio :label="2">运营商</el-radio>
          <el-radio :label="3">平台&nbsp;&nbsp;
            <el-input style="width:100px;" clearable v-model="couponHeaderData.platformRatio" auto-complete="off" :disabled="!isEditorAdd"></el-input>&nbsp;&nbsp;% &nbsp;&nbsp;+&nbsp;&nbsp; 运营商&nbsp;&nbsp;
            <el-input clearable style="width:100px;" v-model="couponHeaderData.operatorRatio" auto-complete="off" :disabled="!isEditorAdd"></el-input>&nbsp;&nbsp;%
            <div v-if="isshowrRatio" class="el-form-item__error">平台或运营商百分比必须是大于0小于100的整数</div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与对象：" prop="conditionType" v-if="couponHeaderData.type!==5">
        <el-radio-group v-model="couponHeaderData.conditionType" @change="changeConditionType" :disabled="!isEditorAdd">
          <el-radio :label="0">不限</el-radio>
          <el-tooltip class="item" effect="dark" content="全平台订单数为0的用户" placement="top">
            <el-radio :label="1">平台新用户</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="全平台订单数大于等于2的用户" placement="top">
            <el-radio :label="2">平台老用户</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="isVipAndNewnUser" content="在指定店铺内订单数为0的用户" placement="top">
            <el-radio :label="7">店铺新用户</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="活动期间内用户注册并且注册后7天内未消费的用户" placement="top">
            <el-radio :label="3">首次注册且7天内未消费</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="活动期间内用户注册并且产生消费的用户" placement="top">
            <el-radio :label="4">注册且已消费</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="isVipAndNewnUser" content="活动期间内购买指定店铺VIP卡的用户" placement="top">
            <el-radio :label="8">购买店铺VIP</el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与对象：" prop="conditionType" v-if="couponHeaderData.type===5">
        <el-radio-group v-model="couponHeaderData.conditionType" @change="changeConditionType" :disabled="!isEditorAdd">
          <el-tooltip class="item" effect="dark" content="受邀人通过分享链接购买VIP后，邀请人和受邀人分别获得该店铺的优惠券" placement="top">
            <el-radio :label="9">VIP邀友</el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="isVipAndNewnUser" content="受邀人打开分享链接，如果受邀人为店铺新用户（在店铺订单数=0）那么直接获取该店铺优惠券。受邀人在该店铺消费后，邀请人获得该店铺优惠券" placement="top">
            <el-radio :label="10">店铺拉新邀友</el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与店铺：" prop="joinType">
        <el-radio-group v-model="couponHeaderData.joinType" @change="handleSetShop" :disabled="isScanType">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">指定店铺</el-radio>
        </el-radio-group>
        <label class="name-active set-shop" v-if="couponHeaderData.joinType == 1 && isShowSetShop" @click="handleManual">手动配置</label>
        <label class="name-active set-shop" v-if="couponHeaderData.joinType == 1 && isShowSetShop" @click="handleBatch">批量上传</label>
      </el-form-item>
      <el-form-item label="弹窗图片：" class="form-item-m add-img" prop="layerUrl">
        <q-upload v-model="couponHeaderData.layerUrl" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Api from '@/utils/Api';
import moment from 'moment';
import QUpload from '@/components/Upload';

export default {
  data() {
    // 验证活动结束时间必须大于活动开始时间
    var checkStartEndTime = (rule, value, callback) => {
      if (moment(value) < moment(this.couponHeaderData.startTime)) {
        return callback(new Error('结束时间必须大于开始时间'));
      } else {
        callback();
      }
    };
    return {
      pickerBeginDateAfter: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerEndDateAfter: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isShowSetShop: true, // 指定店铺
      // 活动验证
      addEventRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 20, message: '活动名称长度不超过20个字符', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5.()a-zA-Z0-9]+$/,
            message: '只支持中英文数字',
            trigger: 'change'
          }
        ],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        receiveWay: [{ required: true, message: '请选择领取方式', trigger: 'change' }],
        sponsor: [{ required: true, message: '请选择费用承担类型', trigger: 'change' }],
        conditionType: [{ required: true, message: '请选择参与对象', trigger: 'change' }],
        joinType: [{ required: true, message: '请选择参与店铺', trigger: 'change' }],
        startTime: [
          {
            type: 'string',
            required: true,
            message: '请选择活动开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            type: 'string',
            required: true,
            message: '请选择活动结束时间',
            trigger: 'change'
          },
          { validator: checkStartEndTime, trigger: 'change' }
        ]
      },
      isEdit: true,
      isshowrRatio: false,
      isScanType: false,
      isVipAndNewnUser: true
    };
  },
  props: ['couponHeaderData', 'isEditorAdd'],
  created() {
    if (!this.isEditorAd) {
      if (this.couponHeaderData.status === 1 || this.couponHeaderData.status === 3) {
        this.isEdit = true;
      } else {
        if (moment(this.couponHeaderData.startTime) <= moment()) {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
      if (this.couponHeaderData.type === 4) {
        this.isScanType = true;
      }
    }
    this.$set(this.couponHeaderData, 'receiveWay', this.couponHeaderData.type); //活动类型为赠券活动时领取方式
    if (this.couponHeaderData.type === 1 || this.couponHeaderData.type === 3) {
      this.$set(this.couponHeaderData, 'type', 13);
    }
  },
  methods: {
    // 选择适用店铺
    handleSetShop(value) {
      if (value === 1) {
        this.isShowSetShop = true;
      } else {
        this.isShowSetShop = false;
      }
      this.$emit('handleSetShop', value);
    },
    // 手动配置店铺
    handleManual() {
      this.$emit('setManualShop', null);
    },
    // 批量上传店铺
    handleBatch() {
      this.$emit('setBatchShop', null);
    },
    // 改变活动类型
    changeActType(value, flag) {
      if (value == 4) {
        this.couponHeaderData.sponsor = 1;
        this.couponHeaderData.joinType = 0;
        this.isScanType = true;
        this.isVipAndNewnUser = false;
      } else if (value == 2) {
        this.isVipAndNewnUser = false;
      } else {
        this.isScanType = false;
        this.isVipAndNewnUser = true;
      }
      let activityType = null;
      if (value !== 13) {
        this.$emit('setActivityType', {
          activityType: value,
          isScanType: this.isScanType
        });
      }
    },
    changeReceiveWay(value) {
      this.$emit('setActivityType', {
        activityType: value,
        isScanType: this.isScanType
      });
    },
    // 参与对象
    changeConditionType(data) {
      this.$emit('setConditionType', data);
    },
    // 开始日期
    handleStartTime(value) {
      this.$emit('setStartTime', value);
    },
    // 活动结束日期
    handleEndTime(value) {
      this.$emit('setEndTime', value);
    },
    // 表单是否验证通过
    validateForm() {
      let flag = false;
      this.$refs['couponHeaderData'].validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 清空验证
    clearValidate() {
      this.$refs['couponHeaderData'].resetFields();
    }
  },
  computed: {
    platformRatio() {
      return this.couponHeaderData.platformRatio;
    },
    operatorRatio() {
      return this.couponHeaderData.operatorRatio;
    }
  },
  watch: {
    platformRatio(newValue, oldValue) {
      let reg = /^[1-9]\d*$/;
      if (reg.test(newValue)) {
        if (0 < newValue < 100) {
          this.isshowrRatio = false;
          this.couponHeaderData.operatorRatio = 100 - parseFloat(newValue);
        }
      } else {
        this.isshowrRatio = true;
        this.couponHeaderData.operatorRatio = null;
      }
    },
    operatorRatio(newValue, oldValue) {
      let reg = /^[1-9]\d*$/;
      if (reg.test(newValue)) {
        if (0 < newValue < 100) {
          this.isshowrRatio = false;
          this.couponHeaderData.platformRatio = 100 - parseFloat(newValue);
        }
      } else {
        this.isshowrRatio = true;
        this.couponHeaderData.platformRatio = null;
      }
    }
  },
  components: {
    QUpload
  }
};
</script>

<style lang="less" scoped>
.line {
  text-align: center !important;
}
.set-shop {
  margin-left: 20px;
}
</style>
