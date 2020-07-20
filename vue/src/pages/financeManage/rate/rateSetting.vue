<template>
  <el-dialog title="费率设置" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="420px">
    <el-form :model="setRateForm" ref="setRateForm">
      <el-form-item label="提现费率：">
        <el-select size="small" v-model="setRateForm.rate" placeholder="请选择">
          <el-option
            v-for="(item, index) in rates"
            :key="index"
            :label="item | ratesTrans"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="doSetingRate">确定</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
export default {
   props: {
    visible: {
      type: Boolean,
      default: false
    },
    rateForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rates: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
        setRateForm: {
        operatorId: '',
        rate: ''
      }
    };
  },
  filters: {
    ratesTrans: value => {
      return value / 1000 + '%';
    }
  },
  created() {
    this.setRateForm = Object.assign({},this.rateForm)
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    doSetingRate() {
      this.$axios.post(Api.WITHDRAWAL_RATE_SET, this.setRateForm).then(resp => {
        this.$message.success("操作成功");
        this.modalClose();
        this.$listeners.getOperatorList && this.$listeners.getOperatorList();
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
