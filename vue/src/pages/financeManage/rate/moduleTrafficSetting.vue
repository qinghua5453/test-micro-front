<template>
  <el-dialog
    title="模块流量费设置"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="420px"
  >
    <el-form :model="setModuleTrafficForm" ref="setModuleTrafficForm">
      <el-form-item label="模块流量费：">
        <el-select size="small" v-model="setModuleTrafficForm.amount" placeholder="请选择">
          <el-option
            v-for="(item, index) in moduleTraffics"
            :key="index"
            :label="item | moduleTrafficTrans"
            :value="item"
          ></el-option>
        </el-select>
        <span>元/年</span>
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
    moduleTrafficForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    moduleTraffics: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  filters: {
    moduleTrafficTrans: value => {
      return value / 100;
    }
  },
  data() {
    return {
      setModuleTrafficForm: {
        operatorId: "",
        amount: ""
      }
    };
  },
  created() {
    this.setModuleTrafficForm = Object.assign({}, this.moduleTrafficForm);
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    doSetingRate() {
      this.$axios
        .post(Api.TRAFFIC_SET, this.setModuleTrafficForm)
        .then(resp => {
          this.$message.success("操作成功");
          this.modalClose();
          this.$listeners.getOperatorList && this.$listeners.getOperatorList();
        });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
