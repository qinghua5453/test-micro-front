<template>
  <el-dialog class="dialog-device" title="设备列表" :visible.sync="visible" :before-close="modalClose" :close="modalClose">
    <el-table class="my-table" :data="deviceData" border tooltip-effect="dark" center="true" height="500px">
      <el-table-column label="序号" width="60" type="index"> </el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="设备名称" width="80"> </el-table-column>
      <el-table-column prop="parentTypeName" show-overflow-tooltip label="一级类型" width="80"> </el-table-column>
      <el-table-column prop="subTypeName" show-overflow-tooltip label="二级类型" width="120"> </el-table-column>
      <el-table-column prop="operatorName" show-overflow-tooltip label="运营商" width="120"> </el-table-column>
      <el-table-column prop="status" :formatter="formatterStatus" show-overflow-tooltip label="设备状态" width="80"> </el-table-column>
      <el-table-column prop="type" show-overflow-tooltip label="通信类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? '脉冲' : '串口' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="company" show-overflow-tooltip label="公司" width="80"> </el-table-column>
      <el-table-column prop="allowPayType" show-overflow-tooltip label="支付方式"> </el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip label="添加时间"> </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import Api from '@/utils/Api';
import { MachineStatus } from '@/utils/Mapping';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      deviceData: []
    };
  },
  created() {
    this.getMachineList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    //设备状态
    formatterStatus(row, column) {
      return MachineStatus[row.status];
    },
    getMachineList() {
      this.$axios
        .post(Api.MACHINE_LIST, {
          shopId: this.shopId,
          page: 1,
          pageSize: 999
        })
        .then(res => {
          this.deviceData = res.items || [];
        });
    }
  }
};
</script>

<style lang="less" scoped></style>
