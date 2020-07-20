<template slot-scope="scope">
  <section>
    <el-row>
      <el-col :span="24">
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column prop="id" label="id" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryCode" label="设备code" show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryName" label="类型名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="250" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';

export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getMachineStairs();
  },
  methods: {
    //获取一级类型配置列表
    getMachineStairs() {
      this.apiUrl = Api.CLOUD_CATEGORY;
      this.$axios.post(this.apiUrl).then(resp => {
        this.list = resp;
      });
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {}
};
</script>
<style lang="less">
.machine-dialog {
  .el-dialog {
    width: 500px;
  }
}
</style>
