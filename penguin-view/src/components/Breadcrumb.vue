<template>
  <el-breadcrumb class="breadcrumb" :separator="separator" v-if="data.length > 0">
    <el-breadcrumb-item v-for="(item, i) in data" :key="i">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "component-breadcrumb",
  props: {
    // 分割符
    separator: {
      type: String,
      default: "-"
    },
    // 数据
    data: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.breadcrumb {
  margin-bottom: 14px;
}
</style>
