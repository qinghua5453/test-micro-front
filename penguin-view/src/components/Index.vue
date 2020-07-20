<template>
	<el-table-column fixed label="序号" width="52" type="index" :index="indexMethod">
	</el-table-column>
</template>

<script>
export default {
  name: "component-index",
  methods: {
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    }
  }
};
</script>
