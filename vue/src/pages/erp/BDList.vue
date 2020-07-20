<template>
  <section v-if="getPerm('dal:bd:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['成员管理', '用户列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="手机号：">
            <el-input size="small" clearable v-model="searchData.phone"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input size="small" clearable v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select size="small" v-model="searchData.role" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option :label="name" :value="id" :key="id" v-for="(name, id) in roleList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区：" prop="areaIds">
            <el-select size="small" v-model="searchData.areaIds" placeholder="全部">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in proviceTypes" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('dal:bd:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddBDDialog({})">新增运维</el-button>
          <!--表格-->
          <el-table :data="list" border tooltip-effect="dark" class="my-table" height="695">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
            <el-table-column fixed prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column label="负责店铺数" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="name-active" @click="ShowDetailDialog(scope.row)">{{scope.row.shopCount}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="role" label="角色" :formatter="formatterStatus" show-overflow-tooltip></el-table-column>
            <el-table-column prop="areaName" label="负责区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parentPhone" label="所属账号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.role === 9">{{scope.row.parentPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="130">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:bd:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.role !== 8&&scope.row.role !== 9" @click="openAddBDDialog(scope.row)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:shop:relationBD')" content="配置店铺" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.role === 1||scope.row.role === 2||scope.row.role === 3||scope.row.role === 4||scope.row.role === 5" @click="openSetShopModle(scope.row.id)" style="color: rgb(0, 160, 232);">
                    <use xlink:href="#icon-dianpupeizhi"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:bd:delete')" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.role !== 8&&scope.row.role !== 9" @click="handleBDDelete(scope.row.id)">
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
          <!--新增BD-->
          <el-dialog :title="addBDTitle" :visible.sync="isShowAddBDDialog" @close="resetForm('addBDForm')" width="1035px">
            <el-form class="addBDForm" :rules="addBDrules" :model="addBDForm" ref="addBDForm" label-width="125px" v-if="isShowAddBDDialog">
              <el-form-item label="姓名：" class="form-item-m" prop="name">
                <el-input clearable v-model.trim="addBDForm.name" auto-complete="off" class="input-w"></el-input>
              </el-form-item>
              <el-form-item label="手机号：" class="form-item-m" prop="phone">
                <el-input clearable v-model.trim="addBDForm.phone" auto-complete="off" class="input-w"></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                <el-radio-group v-model="addBDForm.role" @change="changeRole">
                  <el-radio :label="id" :key="id" v-for="(name, id) in ADDroleList">{{ name }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="负责区域" prop="areas" v-if="isshowareas">
                <el-select v-model="addBDForm.areas" multiple :multiple-limit="multipleLimit" value-key="id" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in proviceTypes" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="isCCActionControlShow">
                <el-form-item label="操作管控">
                  <el-radio-group v-model="addBDForm.action" @change="CCActionControl">
                    <el-radio :label="1">无</el-radio>
                    <el-radio :label="2">有</el-radio>
                  </el-radio-group>
                  <p style="color:#409EFF;line-height: 24px;">选无：此用户可查看操作所有设备；</p>
                  <p style="color:#409EFF;line-height: 24px;">选有：此用户仅可查看操作已勾选的设备；</p>
                </el-form-item>
                <div v-if="isCCActionControlMachineShow">
                  <el-form-item label="设备类型">
                    <el-tree ref="tree" :data="machineTypeList" show-checkbox node-key="id" @check="CCActionControlSecondType" :default-expanded-keys="defaultPropsList" :default-checked-keys="defaultPropsList" :props="defaultProps">
                    </el-tree>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer btn-footer">
              <el-button type="primary" @click="handleAdd('addBDForm')">保存</el-button>
            </div>
          </el-dialog>
          <!--店铺详情-->
          <el-dialog class="dialog-shop" title="店铺详情" :visible.sync="isShowShopDetailDialog" @close="isShowShopDetailDialog = false" width="900px">
            <el-table :data="BDrelationShoplist" border tooltip-effect="dark" class="my-table" height="500">
              <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod"></el-table-column>
              <el-table-column fixed prop="name" label="店铺名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="operatorName" label="运营商" show-overflow-tooltip></el-table-column>
              <el-table-column prop="address" label="店铺地址" show-overflow-tooltip></el-table-column>
              <el-table-column prop="parentPhone" label="所属账号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
              <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                  <el-tooltip content="删除店铺" placement="top" effect="dark">
                    <svg class="icon" aria-hidden="true" @click="delRelationBD(scope.row.id)">
                      <use xlink:href="#icon-trashcopy"></use>
                    </svg>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <!--配置店铺-->
          <el-dialog class="dialog-shop" title="配置店铺" :visible.sync="isShowSetShopDialog" @close="isShowSetShopDialog = false;multipleShopSelection = []" width="1000px">
            <relationbd @chaeckShop="chaeckShop" v-if="isShowSetShopDialog"></relationbd>
            <div slot="footer" class="dialog-footer btn-footer">
              <el-button type="primary" @click="handleSetShop">保存</el-button>
            </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </section>
</template> 

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";
import { exportExcel } from "@/utils/tool";
import { BDRole, AddBDRole } from "@/utils/Mapping";
import relationbd from "./relationBD";

export default {
  name: "page-bd-list",
  mixins: [PagerMixin],
  data () {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {},
      proviceTypes: [],
      multipleLimit: 1, //多选时用户最多可以选择的项目数，为 0 则不限制
      isShowAddBDDialog: false,
      addBDTitle: "新增运维",
      addBDForm: {
        areas: [],
        action: 1,
        category: [],
      },
      addBDrules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: "^[\u4e00-\u9fa5]{2,5}$",
            message: "姓名为2至5个中文",
            trigger: "change"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: "^1\\d{10}$",
            message: "手机号格式不对",
            trigger: "change"
          }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        areas: [{ required: true, message: "请选择区域" }]
      },
      isShowShopDetailDialog: false,
      BDrelationShoplist: [],
      isShowSetShopDialog: false,
      multipleShopSelection: [],
      relationBDid: "",
      delshopBd: false,
      isshowareas: true,
      allMachineTypeList: [],
      machineTypeList: [],
      isCCActionControlShow: false,
      isCCActionControlMachineShow: false,
      defaultProps: {
        children: 'nodes',
        label: 'machineTypeName'
      },
      defaultPropsList: []
    };
  },
  created () {
    // 判断该用户是否有查看权限
    if (this.getPerm("dal:bd:list")) {
      this.getCommonProvice();
      this.getBDList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
    }
  },
  methods: {
    // 给table添加序号
    indexMethod (index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    // 获取省份
    getCommonProvice () {
      return this.$axios
        .post(Api.AREA_LIST, {
          parentId: 0
        })
        .then(resp => {
          this.proviceTypes = resp;
        });
    },
    // 获取bd列表信息
    getBDList () {
      this.apiUrl = Api.BD_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    //根据条件查询店铺列表信息
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.filter(this.searchData);
          query["t"] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    // 格式化角色
    formatterStatus (row, column) {
      return BDRole[row.role];
    },
    changeRole (val) {
      //运维大区经理和一级运维省份可以多选其他只能单选
      this.addBDForm.areas = [];
      if (Number(val) === 6 || Number(val) === 7) {
        this.multipleLimit = 0;
        this.isshowareas = true;
        this.isCCActionControlShow = false;
        this.isCCActionControlMachineShow = false;
      } else if (Number(val) === 10) {
        this.isCCActionControlShow = true;
        this.$set(this.addBDForm, 'action', 1);
        this.isshowareas = false;
      } else {
        this.multipleLimit = 1;
        this.isshowareas = true;
        this.isCCActionControlShow = false;
        this.isCCActionControlMachineShow = false;
      }
    },
    // 新增bd
    async openAddBDDialog (row) {
      this.addBDForm = {};
      this.addBDTitle = "新增运维";
      this.isshowareas = true;
      if (row.id) {
        this.addBDTitle = "编辑运维";
        let res = await this.$axios.post(Api.BD_DETAIL, { id: row.id });
        if (res.role == 6 || res.role == 7) {
          this.multipleLimit = 0;
          this.isshowareas = true;
          this.isCCActionControlShow = false;
          this.isCCActionControlMachineShow = false;
        } else if (res.role == 10) {
          this.isshowareas = false;
          this.isCCActionControlShow = true;
        } else {
          this.multipleLimit = 1;
          this.isshowareas = true;
          this.isCCActionControlShow = false;
          this.isCCActionControlMachineShow = false;
        }
        this.addBDForm = {
          id: res.id,
          phone: res.phone,
          name: res.realName,
          role: res.role.toString(),
          areas: res.areas ? res.areas.map(v => String(v.areaId)) : [],
          control: res.controls ? res.controls : [],
        };
        if (res.role == 10 && res.controls.length > 0) {
          this.$set(this.addBDForm, 'action', 2);
          this.isCCActionControlMachineShow = true;
          this.CCActionControl(2);
        } else {
          this.$set(this.addBDForm, 'action', 1);
        }
        this.defaultPropsList = res.controls ? res.controls.map(v => v.model) : [];
      } else {
        this.isCCActionControlShow = false;
        this.isCCActionControlMachineShow = false;
      }
      this.isShowAddBDDialog = true;
    },
    handleAdd (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.addBDForm);
          let url = params.id ? Api.BD_UPDATE : Api.BD_ADD;
          if (Number(params.role) === 10) { //厂测工程师
            delete params.areas;
            if (params.action == 2) {
              if (params.control && params.control.length > 0) {
                params.control = JSON.stringify(params.control);
              } else {
                this.$message.error("请勾选设备类型");
                return false;
              }
            }
          } else {
            delete params.control;
          }
          delete params.action;
          this.$axios.post(url, params).then(res => {
            this.getBDList();
            this.isShowAddBDDialog = false;
            this.$message.success("恭喜你，操作成功");
            this.defaultPropsList = [];
          });
        } else {
          this.$message.error("信息未填写完整");
          return false;
        }
      });
    },
    // 关闭或者取消新增bd
    resetForm (formName) {
      this.isShowAddBDDialog = false;
      this.$refs[formName].resetFields();
    },

    // 删除BD
    handleBDDelete (id) {
      this.$confirm("您确定要删除该用户", "删除确认").then(() => {
        this.$axios
          .post(Api.BD_DELETE, {
            id: id
          })
          .then(res => {
            this.$message({
              showClose: true,
              message: "用户删除成功！",
              type: "success"
            });
            this.getBDList();
            this.delshopBd = true;
          });
      });
    },

    //BD负责店铺数详情
    ShowDetailDialog (row) {
      if (row.shopCount === 0) {
        return false;
      }
      this.$axios
        .post(Api.SHOP_LIST, {
          bdId: row.id,
          page: 1,
          pageSize: 999
        })
        .then(res => {
          this.BDrelationShoplist = res.items;
          this.relationBDid = row.id;
          this.isShowShopDetailDialog = true;
        });
    },
    //删除bd已绑定的店铺
    delRelationBD (shopid) {
      this.$axios
        .post(Api.SHOP_relationBD, {
          shopIds: shopid,
          bdId: this.relationBDid,
          type: 0
        })
        .then(res => {
          this.isShowShopDetailDialog = false;
          this.getBDList();
        });
    },
    //配置店铺
    openSetShopModle (id) {
      this.isShowSetShopDialog = true;
      this.relationBDid = id;
    },
    chaeckShop (data) {
      this.multipleShopSelection = data;
    },
    handleSetShop () {
      let shopIds = [];
      this.multipleShopSelection.forEach(item => {
        shopIds.push(item.id);
      });
      let ids = shopIds.join(",");
      if (ids <= 0) {
        this.$message.warning("请至少选择一个店铺");
        return false;
      }
      this.$axios
        .post(Api.SHOP_relationBD, {
          shopIds: ids,
          bdId: this.relationBDid,
          type: 1
        })
        .then(res => {
          this.isShowSetShopDialog = false;
          this.multipleShopSelection = [];
          this.getBDList();
        });
    },
    CCActionControl (val) { //厂测工程师操作管理
      if (val === 2) {
        this.$axios.post(Api.MACHINETYPE_LIST).then(res => {
          this.allMachineTypeList = res;
          this.machineTypeList = DataUtils.tree(res, 'id', 'parentTypeId');
          this.isCCActionControlMachineShow = true;
        });
      } else {
        this.isCCActionControlMachineShow = false;
      }
    },
    CCActionControlSecondType (val) {
      let list = this.$refs.tree.getCheckedNodes(true);
      let checkedMachineTypeList = [];
      this.allMachineTypeList.forEach(v => list.forEach(k => {
        if (k.parentTypeId == v.id) {
          checkedMachineTypeList.push({
            category: v.id,
            model: k.id
          });
        }
      }));
      this.$set(this.addBDForm, 'control', checkedMachineTypeList);
    },
    //导出
    exportTable () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          exportExcel(Api.EXPORT_ORDER, "订单总览.xlsx", query);
        }
      });
    }
  },
  computed: {
    roleList () {
      return BDRole;
    },
    ADDroleList () {
      return AddBDRole;
    },
    ...mapGetters("user", ["getPerm"])
  },
  components: {
    QBreadcrumb,
    relationbd
  }
};
</script>

<style lang="less">
.order-detail {
  .el-collapse {
    border-top: none;
  }
  .el-dialog {
    width: 60%;
  }
}

.refuse-dialog {
  .el-textarea__inner {
    line-height: 3.5;
  }
}

.border-b {
  border-bottom: 1px solid #e3e1e1;
  margin-bottom: 10px;
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    i {
      margin-right: 8px;
    }
  }
}

.carrier-detail {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
