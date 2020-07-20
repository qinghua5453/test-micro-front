<template>
    <!--参与用户列表信息-->
    <div class="tab-s"> 
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
            <el-form-item label="手机号码">
                <el-input v-model="searchData.phone" :clearable="true" size="small" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item>
                <a class="el-button el-button--primary" type="primary" @click="search()">查询</a>
            </el-form-item>
            <el-form-item v-if="getPerm('dal:member:event:assoc:excel')">
                <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
            </el-form-item>
        </el-form>
        <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="500">
            <el-table-column label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="手机号码" prop="phone" show-overflow-tooltip >
            </el-table-column>
            <el-table-column label="参与时间" prop="createTime" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="block">
               <el-pagination
               v-show="pageShow"
                @size-change="pageSizeChange"
                @current-change="currentChange"
                :current-page="searchData.page"
                :page-sizes="pageSizeOpts"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>   
            </div>
        </el-col>
    </div>
        
</template>

<script>
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import QArea from "@/components/Area";
import DataUtils from "@/utils/Data";
import { exportExcel } from "@/utils/tool";
import modlePageMixin from "@/mixins/modlePageMixin";

export default {
  name: "page-relationbd-list",
  mixins: [modlePageMixin],
  data() {
    return {};
  },
  props: ["id"],
  created() {
    this._getList();
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    _getList() {
      try {
        const payload = Object.assign(
          { type: 2 },
          { eventId: this.id },
          this.searchData
        );
        for (const key in this.payload) {
          if (!this.payload[key]) {
            delete this.payload[key];
          }
        }
        this.$axios.post(Api.MEMBER_ASSOC_LIST, payload).then(resp => {
          this.total = resp.total;
          this.list = resp.items || [];
        });
      } catch (e) {
        this.list = [];
        this.tota = 0;
      }
    },
    // 格式化奖品内容
    formatterContent(row, column) {
      if (row.type === 1) {
        return row.value + "优惠券";
      } else if (row.type === 2) {
        return row.value + "元";
      } else if (row.type === 5) {
        return row.value * 10 + "折";
      } else if (row.type === 6) {
        return row.value;
      }
    },
    // 导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.type = 2;
          query.eventId = this.id;
          exportExcel(Api.MEMBER_ASSOC_ExCEL, "参与用户列表总览.xlsx", query);
        }
      });
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  },
  components: {
    QArea
  }
};
</script>

<style lang="less">
</style>
