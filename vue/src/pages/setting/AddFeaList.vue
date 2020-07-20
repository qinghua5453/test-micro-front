<template>
	<section v-if="getPerm('dal:attach:list')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['设置', '附加功能']" />
				<div class="tab-s">
					<!--新增弹出框-->
					<el-button v-if="getPerm('dal:attach:save')" type="primary" class="el-icon-circle-plus" @click="openAddAttachDialog(null)" style="margin-bottom: 10px;">新增附加功能</el-button>
					<!--表格-->
					<el-table border :data="list" style="width: 100%" height="767" class="my-table">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="functionName" label="功能名称" width="250">
						</el-table-column>
						<el-table-column prop="createUser" label="创建人">
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间">
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="110">
							<template slot-scope="scope">
								<el-tooltip v-if="getPerm('dal:attach:update')" content="编辑" placement="top" effect="dark">
									<svg class="icon" aria-hidden="true" @click="openAddAttachDialog(scope.row.id,scope.row.functionName)">
										<use xlink:href="#icon-document-edit"></use>
									</svg>
								</el-tooltip>
								<el-tooltip v-if="getPerm('dal:attach:delete')" content="删除" placement="top" effect="dark">
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
							<q-pager :total="total" />
						</div>
					</el-col>
				</div>
			</el-col>
		</el-row>
		<el-dialog class="dialog-addfea" :title="attachTitle" size="tiny" :visible.sync="secondVisible" @close="handleCancel">
			<el-form  label-width="94px" :rules="addAttachrules" :model="addAttach" ref="addAttach">
				<el-form-item label="功能名称：" prop="functionName">
					<el-input clearable size="large" v-model="addAttach.functionName" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer btn-footer">
				<el-button type="primary" @click="handleSave('addAttach')">确认</el-button>
				<el-button type="primary"  @click.native="handleCancel" plain>取消</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import QBreadcrumb from "@/components/Breadcrumb";
import Api from "@/utils/Api";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";

export default {
  name: "page-addfea-list",
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,

      // 新增
      addAttach: {
        functionName: null,
        id: null
      },
      secondVisible: false,
      attachTitle: "",

      // 新增验证
      addAttachrules: {
        functionName: [
          { required: true, message: "请输入功能名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm("dal:attach:list")) {
      this.getAttachList();
    }
  },
  methods: {
    // 获取附加功能列表
    getAttachList() {
      this.apiUrl = Api.ATTACH_LIST;
      let query = this.$route.query;
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
    async openAddAttachDialog(id, name) {
      this.attachTitle = "新增附加功能";
      this.addAttach = {
        functionName: null
      };
      if (id != null) {
        this.attachTitle = "编辑附加功能";
        this.addAttach.id = id;
        this.addAttach.functionName = name;
      }
      this.secondVisible = true;
    },
    //提交
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过
          let data = DataUtils.clone(this.addAttach);
          let apiUrl = data.id > 0 ? Api.ATTACH_EDIT : Api.ATTACH_ADD;
          this.$axios.post(apiUrl, data).then(_ => {
            this.getAttachList();
            this.secondVisible = false;
            this.$message({
              showClose: true,
              message: "恭喜你，操作成功！",
              type: "success"
            });
          });
        }
      });
    },

    // 取消编辑或者新增
    handleCancel() {
      this.secondVisible = false;
      this.$refs.addAttach.resetFields();
    },

    // 删除
    handleDelete(id) {
      this.$confirm("是否删除", "确认删除").then(_ => {
        this.$axios
          .post(Api.ATTACH_DELETE, {
            id: id
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: "恭喜你，删除成功！",
              type: "success"
            });
            this.getAttachList();
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
.dialog-addfea {
  .el-dialog {
    width: 500px;
  }
  .el-dialog__body {
    padding: 42px 20px 20px;
  }
}
</style>
