<template>
	<section v-if="getPerm('sys:role:list')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['成员管理', '角色列表']" />
				<div class="tab-s role-wrapper">
					<el-button v-if="getPerm('sys:role:save')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddRoleDialog">新增角色</el-button>
					<!--表格-->
					<el-table border :data="list" style="width: 100%" height="767" :fit="true" ref="table" class="my-table">
						<el-table-column fixed type="index" label="序号" width="60" show-overflow-tooltip>
						</el-table-column>
						<el-table-column fixed prop="roleName" label="角色名称" width="120" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="createName" label="创建人" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="createName" label="最后更新人" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="updateTime" label="最后更新时间" width="180" show-overflow-tooltip>
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="110">
							<template slot-scope="scope">
								<el-tooltip v-if="getPerm('sys:role:update')" content="编辑" placement="top" effect="dark">
									<svg class="icon" aria-hidden="true" @click="openAddRoleDialog(scope.row.roleId)">
										<use xlink:href="#icon-document-edit"></use>
									</svg>
								</el-tooltip>
								<el-tooltip v-if="getPerm('sys:role:delete')" content="删除" placement="top" effect="dark">
									<svg class="icon" aria-hidden="true" @click="handleRemove(scope.row.roleId)">
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

		<!-- 新增/修改角色弹出框 -->
		<el-dialog title="新增角色" :visible.sync="isShowAddRoleDialog" @close="handleCancel">
			<el-form label-width="94px" :rules="rolerules" :model="addRole" ref="addRole" style="max-height: 600px; overflow-y: scroll;">
				<el-form-item label="角色名称："  prop="roleName">
					<el-input clearable auto-complete="off" v-model="addRole.roleName"></el-input>
				</el-form-item>
				<el-form-item label="权限：" prop="menuIdList">
					<el-tree :data="menuData" show-checkbox highlight-current node-key="menuId" ref="tree"  :default-checked-keys="addRole.menuIdList" :default-expanded-keys="addRole.menuIdList" :props="defaultProps" @check-change="handleCheckChange">
					</el-tree>
					<div class="el-form-item__error" v-if="isMenuId">请选择权限</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer btn-footer">
				<el-button type="primary" @click.native="handleAdd('addRole')">确认</el-button>
				<el-button type="primary" plain @click.native="handleCancel">取消</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import _ from "lodash";
import QBreadcrumb from "@/components/Breadcrumb";
import Api from "@/utils/Api";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";

export default {
  name: "page-role-list",
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,

      // 新增角色
      isShowAddRoleDialog: false,
      menuList: [],
      addRole: {
        roleId: null,
        roleName: null,
        menuIdList: []
      },
      menuData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultCheckedKeys: [],
      rolerules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
        // menuIdList: [{
        // 	required: true,
        // 	message: '请选择权限',
        // 	trigger: 'check-change'
        // }],
      },
      isMenuId: false // 提示用户选择权限
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm("sys:role:list")) {
      this.getRoleList();
    }
  },
  methods: {
    getRoleList() {
      this.apiUrl = Api.GET_ROLE_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 获取角色详细信息
    getRoleDetail(id) {
      return this.$axios.post(Api.GET_ROLE_DETAIL + "/" + id).then(resp => {
        this.addRole.roleId = resp.roleId;
        this.addRole.roleName = resp.roleName;
        resp.menuIdList.map(item => {
          if (item.toString().length >= 5 || Number(item) === 11) {
            this.addRole.menuIdList.push(item);
          }
        });
      });
    },
    // 获取权限列表
    getMenuList() {
      return this.$axios
        .post(Api.GET_MENU_LIST, {
          pageSize: 1000,
          page: 1
        })
        .then(resp => {
          this.menuList = resp.items;
          this.menuData = DataUtils.getTrees(this.menuList, 0);
        });
    },
    // 添加角色弹出框
    async openAddRoleDialog(id) {
      this.addRole = {
        roleId: null,
        roleName: null,
        menuIdList: []
      };
      if (id > 0) {
        await this.getRoleDetail(id);
      }
      await this.getMenuList();
      this.isShowAddRoleDialog = true;
    },
    // 选择权限
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.isMenuId = false;
      }
    },
    // 添加角色提交
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过
          let url = this.addRole.roleId > 0 ? Api.UPDATE_ROLE : Api.ADD_ROLE;
          this.addRole.menuIdList = this.$refs.tree
            .getHalfCheckedKeys()
            .concat(this.$refs.tree.getCheckedKeys());
          if (this.addRole.menuIdList.length == 0) {
            this.isMenuId = true;
          } else {
            this.isMenuId = false;
          }
          if (!this.isMenuId) {
            this.$axios.post(url, this.addRole).then(_ => {
              this.getRoleList();
              this.isShowAddRoleDialog = false;
            });
          }
        }
      });
    },
    // 删除
    handleRemove(id) {
      this.$confirm("您确定要删除该角色吗？", "警告").then(_ => {
        this.$axios
          .post(Api.REMOVE_ROLE, {
            roleId: id
          })
          .then(_ => {
            this.getRoleList();
          });
      });
    },
    // 取消编辑和新增
    handleCancel() {
      this.isShowAddRoleDialog = false;
      this.$refs.addRole.resetFields();
    }
  },
  computed: {
    menuTree() {
      return DataUtils.tree(this.menuList, "menuId");
    },
    ...mapGetters("user", ["getPerm"])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.role-wrapper {
  .el-dialog {
    width: 60%;
  }
}

.second {
  padding-left: 20px;
}

.third {
  padding-left: 20px;
}
</style>
