<template>
  <div>
    <el-select
      v-model="data"
      filterable
      remote
      clearable
      placeholder="请输入关键词"
      :remote-method="getAreaList"
      :loading="loading"
      :style="'width: '+changewidth+'%'">'
      <el-option v-if="defaultOption" :label="defaultOption" :value="null" />
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Api from "@/utils/Api";

export default {
  name: "component-shop-select",
  props: {
    // v-model 绑定数据
    value: String,

    // 默认List，如有默认有选中的传这个值
    defaultList: Array,

    // 默认Option，值为null的option
    defaultOption: String,
    width: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      data: this.value,
      list: this.defaultList,
      changewidth: this.width,
      loading: false
    };
  },
  methods: {
    async getAreaList(keywords) {
      if (keywords === "") {
        return;
      }
      this.loading = true;
      let resp = await this.$axios.post(Api.SHOP_GETFORNAME, {
        name: keywords
      });
      this.list = resp || [];
      this.loading = false;
    }
  },
  watch: {
    // 监听数据变化，触发数据更新
    data(v) {
      this.$emit("input", v);
    }
  }
};
</script>
