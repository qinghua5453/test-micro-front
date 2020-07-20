<template>
  <section v-if="getPerm('sys:user:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['成员管理', '成员列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="账号：">
            <el-input size="small" clearable v-model="searchData.userName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input size="small" clearable v-model="searchData.fullName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="角色：">
            <el-input size="small" clearable v-model="searchData.roleName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('sys:user:save')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddMemberDialog">新增成员</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="695" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed prop="userPhone" label="账号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.userName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fullName" label="姓名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="roles" label="角色" width="200" :formatter="formatterRoles" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createName" label="创建人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('sys:user:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddMemberDialog(scope.row.userId)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('sys:user:delete')" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleRemove(scope.row.userId)">
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

    <!-- 成员详情 暂时不需要
	<el-dialog class="dialog-member" title="成员详情" :visible.sync="isShowMemberDialog">
		<el-form label-width="96px" ref="addForm" v-if="memberData">
			<el-form-item label="账号：">
				<span>{{ memberData.userName }}</span>
			</el-form-item>
			<el-form-item label="角色：">
				<span>{{ formatterRoles(null, null, memberData.roles) }}</span>
			</el-form-item>
			<el-form-item label="姓名：">
				<span>{{ memberData.fullName }}</span>
			</el-form-item>
			<el-form-item label="创建人：">
				<span>{{ memberData.createName }}</span>
			</el-form-item>
			<el-form-item label="所属部门：">
				<span>{{ memberData.deptName }}</span>
			</el-form-item>
			<el-form-item label="创建时间：">
				<span>{{ memberData.createTime }}</span>
			</el-form-item>
			<el-form-item label="负责的店铺：">
			</el-form-item>
		</el-form>
		<el-table border :data="[]">
			<el-table-column prop="userPhone" label="店铺名称">
			</el-table-column>
			<el-table-column prop="userPhone" label="运营商">
			</el-table-column>
			<el-table-column prop="userPhone" label="店铺地址">
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<div class="block">
				<el-pagination background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout=" prev, pager, next" :total="400">
				</el-pagination>
			</div>
		</el-col>
	</el-dialog>-->

    <!-- 新增成员 -->
    <el-dialog class="min-dialog" title="新增成员" width="500px" :visible.sync="isShowAddMemberDialog" @close="handleCancel">
      <el-form label-width="94px" :model="addMember" :rules="memberRules" ref="addMember">
        <el-form-item label="手机号码：" prop="userName">
          <el-input clearable auto-complete="off" v-model="addMember.userName"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="fullName">
          <el-input clearable auto-complete="off" v-model="addMember.fullName"></el-input>
        </el-form-item>
        <el-form-item label="角色：" class="form-item-m" prop="roleIdList">
          <el-select v-model="addMember.roleIdList" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属部门：">
				<el-select v-model="addUser.member" placeholder="请选择" style="width: 100%;">
					<el-option v-for="item in members" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="handleAdd">确认</el-button>
        <el-button type="primary" plain @click.native="handleCancel">取消</el-button>
      </div>
    </el-dialog>

    <!-- 配置店铺暂不支持
	<el-dialog class="config-shop" title="配置店铺" :visible.sync="dialogCreateVisible" @close="dialogCreateVisible = false">
		<el-form id="#create" :model="create" ref="create" label-width="75px" class="config-shop-form demo-form-inline">
			<el-form-item label="店铺名称" prop="shopName">
				<el-input size="mini" v-model="create.shopName" style="width: 120px;"></el-input>
			</el-form-item>
			<el-form-item label="区域" prop="area">
				<el-input size="mini" v-model="create.area" style="width: 120px;"></el-input>
			</el-form-item>
			<el-form-item label="店铺地址" prop="address">
				<el-input size="mini" v-model="create.address" auto-complete="off" style="width: 120px;"></el-input>
			</el-form-item>
			<el-form-item label="运营商账号" prop="opeacct">
				<el-input size="mini" v-model="create.opeacct" style="width: 120px;"></el-input>
			</el-form-item>
			<a class="el-button btn-inquire" type="primary">查询</a>
		</el-form>
		<el-table border :data="tableData" style="width: 100%" :fit="true" ref="table">
			<el-table-column type="selection" width="60">
			</el-table-column>
			<el-table-column fixed prop="id" label="序号" width="60">
			</el-table-column>
			<el-table-column fixed prop="userPhone" label="店铺名称">
			</el-table-column>
			<el-table-column prop="userName" label="运营商">
			</el-table-column>
			<el-table-column prop="member" label="店铺地址">
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<div class="block">
				<el-pagination background @size-change="" @current-change="" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout=" prev, pager, next" :total="400">
				</el-pagination>
			</div>
		</el-col>
		<div slot="footer" class="dialog-footer btn-footer">
			<el-button type="primary">确 定</el-button>
			<el-button @click="dialogCreateVisible = false">取 消</el-button>
		</div>
	</el-dialog>
	配置店铺暂不支持 -->
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';

export default {
  name: 'page-member-list',
  mixins: [PagerMixin],
  data() {
    // 验证手机号码
    var checkPhone = (rule, value, callback) => {
      var partten = /^1\d{10}$/;
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!partten.test(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    };
    return {
      list: [], // 数据
      total: 0,
      searchData: {
        //头部搜索
        userName: this.$route.query.userName,
        fullName: this.$route.query.fullName
      },

      // 成员详细
      isShowMemberDialog: false,
      memberData: null,

      //新增成员
      isShowAddMemberDialog: false,
      roleList: [],
      addMember: {
        userId: null,
        userName: null,
        fullName: null,
        roleIdList: [],
        deptId: 1
      },
      memberRules: {
        userName: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        fullName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        roleIdList: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('sys:user:list')) {
      this.getMemberList();
    }
  },
  methods: {
    // 获取成员列表
    getMemberList() {
      this.apiUrl = Api.GET_MEMBER_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 获取角色列表
    getRoleList() {
      return this.$axios.post(Api.GET_ROLE_LIST,{page:1,pageSize:99}).then(resp => {
        this.roleList = resp.items;
      });
    },
    // 获取成员详情
    getMemberDetail(id) {
      return this.$axios.post(Api.GET_MEMBER_DETAIL + '/' + id).then(resp => {
        this.memberData = resp;
        this.addMember.userId = resp.userId;
        this.addMember.userName = resp.userName;
        this.addMember.fullName = resp.fullName;
        this.addMember.roleIdList = resp.roles.map(item => item.roleId);
        this.addMember.deptId = resp.deptId;
      });
    },
    // 根据条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          let query = DataUtils.filter(this.searchData);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        } else {
          return false;
        }
      });
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    // 导出
    handleExport() {
      this.$alert('暂不支持');
    },
    // 详细信息
    openMemberDialog(id) {
      // 暂时不做
      return false;
      // if (id > 0) {
      // 	this.getMemberDetail(id).then(_ => this.isShowMemberDialog = true)
      // }
    },
    // 格式化角色数据
    formatterRoles(row, column, cellValue) {
      return DataUtils.arrToString(cellValue, 'roleName');
    },
    // 添加成员弹出框
    async openAddMemberDialog(id) {
      this.addMember = {
        userName: null,
        fullName: null,
        roleIdList: [],
        deptId: 1
      };
      if (id > 0) {
        await this.getMemberDetail(id);
      }
      await this.getRoleList();
      this.isShowAddMemberDialog = true;
    },
    // 添加成员提交
    handleAdd() {
      this.$refs.addMember.validate(valid => {
        if (valid) {
          // 验证通过
          let data = DataUtils.clone(this.addMember);
          let url = data.userId > 0 ? Api.UPDATE_MEMBER : Api.ADD_MEMBER;

          // data.roleIdList = JSON.stringify(data.roleIdList)
          this.$axios.post(url, data).then(_ => {
            this.getMemberList();
            this.isShowAddMemberDialog = false;
            this.$message({
              showClose: true,
              message: '操作成功！',
              type: 'success'
            });
          });
        }
      });
    },
    // 取消增加
    handleCancel() {
      this.isShowAddMemberDialog = false;
      this.$refs.addMember.resetFields();
    },

    // 删除
    handleRemove(id) {
      this.$confirm('您确定要删除该用户吗？', '警告').then(_ => {
        this.$axios
          .post(Api.REMOVE_MEMBER, {
            userIds: [id]
          })
          .then(_ => {
            this.getMemberList();
          });
      });
    },
    // 配置店铺 todo
    handerBindShop(id) {
      this.$alert('暂不支持 id: ' + id);
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.config-shop {
  .config-shop-form {
    padding: 8px 0;
    margin-bottom: 0;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-dialog {
    width: 80%;
    .el-dialog__footer {
      border: none;
    }
    .btn-inquire {
      margin-top: 5px !important;
    }
    .el-button {
      margin-top: 30px;
    }
  }
  .demo-form-inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }
}

.dialog-member {
  .el-form-item {
    width: 50%;
    float: left;
  }
  .el-dialog__body {
    padding: 10px 40px 100px;
  }
}

.cancel {
  background-color: #5f9dde;
  border-color: #5f9dde;
}
</style>
