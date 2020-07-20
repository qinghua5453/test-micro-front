<template>
  <el-dialog title="返利基准设置" :visible="visible" :before-close="modalClose" :close="modalClose" :close-on-click-modal="false" width="680px" top="10vh">
    <el-form :model="rebateForm" :rules="rebateFormRules" ref="rebateForm" label-width="20px" label-position="right" class="rebateForm" size="small">
      <el-form-item>
        <el-row>
          <el-col :span="8">梯度设置</el-col>
          <el-col :span="12">金额设置</el-col>
        </el-row>
        <el-row v-for="(item,index) in rebateForm.rebateVals" :key="index">
          <el-col :span="8" class="price-set">
            <span style="margin-right: 10px;">{{word(index)}}</span>
            <el-form-item :prop="`rebateVals[${index}].minVal`" :rules='rebateFormRules.minVal' lass="proportion-input">
              <el-input type="minVal" v-model.number="item.minVal" maxlength="6" placeholder="请输入" autocomplete="off" @blur="validateGrads(index,item.minVal)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="price-set">
            <span>返利标准：</span>
            <el-form-item :prop="`rebateVals[${index}].money`" :rules='rebateFormRules.money' class="proportion-input">
              <el-input type="money" v-model="item.money" placeholder="请输入" autocomplete="off"></el-input>
            </el-form-item>
            <span>元/台</span>
            <i class="el-icon-circle-plus-outline" v-if="index===(rebateForm.rebateVals.length-1)&&(index)<4" @click="plusDomain(item)"></i>
            <i class="el-icon-remove-outline" v-if="index>0" @click.prevent="removeDomain(item)"></i>
          </el-col>
        </el-row>
        <el-row style="color:#999">梯度：大于A小于等于B</el-row>
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onEditRebate('rebateForm')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import { businessType } from '@/utils/Mapping';
import { getRebateConfigList, editRebate } from '../invoiceList';
export default {
  props: {
    rebateInfo: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    // 验证洗衣液价格
    return {
      rebateForm: { rebateVals: [] },
      rebateFormRules: {
        minVal: [{ required: true, message: '请输入梯度值', trigger: 'blur' }, { type: 'number', min: 0, max: 9999, message: '请输入大于等于0的整数', trigger: 'blur' }],
        money: [{ required: true, message: '请输入金额', trigger: 'blur' }, { pattern: /^([0-9]+)(\.\d{1,2})?$/, message: '必须大于等于0，支持两位小数', trigger: 'blur' }]
      },
      gradsStatusNum: 0
    };
  },
  computed: {
    word() {
      return index => {
        let map = ['A', 'B', 'C', 'D', 'E', 'F'];
        return map[index];
      };
    }
  },
  created() {
    this.getRebateConfigList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getRebateConfigList() {
      let payload = { shipId: this.rebateInfo.id };
      let res = await getRebateConfigList(payload);
      this.rebateForm.rebateVals = res || [{ type: 1, minVal: null, money: null }];
    },
    removeDomain(item) {
      let index = this.rebateForm.rebateVals.indexOf(item);
      index !== -1 && this.rebateForm.rebateVals.splice(index, 1);
    },
    plusDomain(item) {
      this.rebateForm.rebateVals.push({
        type: item.type ? Number(item.type) + 1 : 1,
        minVal: null,
        money: null
      });
    },
    validateGrads(index, value) {
      if (index > 0) {
        let preGradsVal = this.rebateForm.rebateVals.length > 0 ? this.rebateForm.rebateVals[index - 1].minVal : 0;
        if (value && value <= preGradsVal) {
          this.$message.error('不能小于上一梯度值');
          return;
        }
      }
    },
    checkGrads() {
      let checkGrads = true;
      let [preGradsVal, ...restValue] = this.rebateForm.rebateVals;
      let firstVal = preGradsVal.minVal || 0;
      for (let i = 0; i < restValue.length; i++) {
        const item = restValue[i];
        if (item.minVal > firstVal) {
          firstVal = item.minVal;
          checkGrads = true;
        } else {
          checkGrads = false;
          break;
        }
      }
      return checkGrads;
    },
    onEditRebate(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!this.checkGrads()) {
            this.$message.error('梯度值输入不正确');
            return;
          }
          let payload = Object.assign({ shipId: this.rebateInfo.id, operatorName: this.rebateInfo.operatorName }, this.rebateForm);
          payload.rebateVals = payload.rebateVals && JSON.stringify(payload.rebateVals);
          editRebate(payload).then(() => {
            this.$listeners.getInvoiceListData && this.$listeners.getInvoiceListData();
            this.$message.success('操作成功！');
            this.modalClose();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.imei {
  position: relative;
}
.imei_count {
  position: absolute;
  bottom: -3%;
  right: 2%;
}
.price-set {
  display: flex;
}
/deep/ .el-row {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
  /deep/ .el-form-item {
    width: 38%;
  }
}
.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 24px;
  color: #f06363;
  padding: 4px 2px 0 2px;
  cursor: pointer;
}
.action {
  text-align: right;
}
</style>