<template>
	<section v-if="getPerm('dal:help:list')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['设置', '意见反馈']" />
				<div class="tab-s">
					<!--表格-->
					<el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="813" class="my-table">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
						</el-table-column>
						<el-table-column fixed prop="contentType" label="分类" :formatter="formatterStatus"  width="150">
						</el-table-column>
						<el-table-column prop="feedbackContent" label="内容">
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间" width="180">
						</el-table-column>
						<el-table-column label="操作" width="110">
							<template slot-scope="scope">
                                <el-tooltip v-if="getPerm('dal:help:delete')" content="删除" placement="top" effect="dark">
                                    <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row.id)">
                                        <use xlink:href="#icon-trashcopy"></use>
                                    </svg>
                                </el-tooltip>
					        </template>
						</el-table-column>
					</el-table>
					<!--分页-->
					<el-col :span="24" class="toolbar">
						<div class="block">
							<q-pager :total="total" :query="query" />
						</div>
					</el-col>
				</div>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import QBreadcrumb from "@/components/Breadcrumb";
import Api from "@/utils/Api";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";
import { exportExcel } from "@/utils/tool";
import { feedbackType } from "@/utils/Mapping";

export default {
  name: "page-opinion-list",
  mixins: [PagerMixin],
  data() {
    return {
      // 额外参数
      query: { contentType: 2 },
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      isthawVisible: false
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm("dal:help:list")) {
      this.getOpinionList();
    }
  },
  methods: {
    //获取用户列表信息
    getOpinionList() {
      this.apiUrl = Api.HELP_LIST;
      let query = Object.assign({}, this.$route.query, this.query);
      // this.$router.push({query: query})
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    formatterStatus(row, column) {
      return feedbackType[row.type];
    },
    // 删除反馈
    handleDelete(id) {
      this.$confirm("您确定要删除该意见反馈", "删除确认").then(() => {
        this.$axios
          .post(Api.HELP_DELETE, {
            id: id
          })
          .then(res => {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success"
            });
            this.getOpinionList();
          });
      });
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.draw-textarea {
  .el-textarea__inner {
    line-height: 3.5 !important;
  }
}
</style>
