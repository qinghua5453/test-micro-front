<template slot-scope="scope">
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="类型名称：">
            <el-input size="small" clearable v-model="searchData.name" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="一级类型：">
            <el-select v-model="searchData.categoryCode" size="small">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in firstType" :key="item.id" :label="item.categoryName" :value="item.categoryCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="openAddModelDialog = true">新增</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column prop="id" label="id" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modelCode" label="设备code" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modelName" label="类型名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openMachineTypeSecondDetailDialog(scope.row.modelCode)">{{scope.row.modelName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="modelType" label="设备型号" width="150"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" width="60" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.status | cloudStatusTypes}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleOpenEditModelDialog(scope.row.modelCode)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="设置指令" placement="top" effect="dark">
                  <i class="el-icon-setting icon" style="color:#00A0E8" @click="handleOpenEditFunctionDialog"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 详细 -->
    <el-dialog class="dialog-type" title="二级类型详情" width="1000" :visible.sync="secondVisible" @close="secondVisible = false">
      <el-form label-width="84px">
        <el-form-item label="类型名称：">
          <span>{{ subTypeDetail.modelName }}</span>
        </el-form-item>
        <el-form-item label="设备型号：">
          <span>{{ subTypeDetail.modelType }}</span>
        </el-form-item>
        <el-form-item label="一级类型：">
          <span>{{ subTypeDetail.categoryName }}</span>
        </el-form-item>
        <el-form-item label="状态：">
          <span>{{ subTypeDetail.status | cloudStatusTypes}}</span>
        </el-form-item>
      </el-form>
      <el-table class="my-table" v-if="subTypeDetail.extraAttr.channels.length>0" :data="subTypeDetail.extraAttr.channels" border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="channel" label="序号"></el-table-column>
        <el-table-column prop="enable" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.enable ? '可用' :'不可用' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table border :data="subTypeDetail.functionList" style="width: 100%" class="my-table">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="charge-table-expand" v-if="subTypeDetail.categoryName === '吹风机'||subTypeDetail.categoryName === '干衣机'">
              <span>最大时间： {{(scope.row.extraAttr.max*scope.row.workTime) | chargeWorkTime}}</span>
              <span>最小时间： {{(scope.row.extraAttr.min*scope.row.workTime) | chargeWorkTime}}</span>
              <span>时间刻度： {{(scope.row.extraAttr.step*scope.row.workTime) |chargeWorkTime}}</span>
            </div>
            <div class="charge-table-expand" v-if="subTypeDetail.categoryName === '饮水机'">
              <span>最大用量： {{scope.row.extraAttr.max?scope.row.extraAttr.max*scope.row.workTime:''}}{{scope.row.extraAttr.unit}}</span>
              <span>最小用量： {{scope.row.extraAttr.min?scope.row.extraAttr.min*scope.row.workTime:''}}{{scope.row.extraAttr.unit}}</span>
              <span>刻度： {{scope.row.extraAttr.step?scope.row.extraAttr.step*scope.row.workTime:''}}{{scope.row.extraAttr.unit}}</span>
            </div>
            <div class="charge-table-expand" v-if="scope.row.extraAttr.detergent">
              <span>洗衣液用量： {{scope.row.extraAttr.detergent ? scope.row.extraAttr.detergent.liquid: '' }}/ML</span>
              <span>洗衣液价格： {{scope.row.extraAttr.detergent ? scope.row.extraAttr.detergent.price :'' }}元</span>
            </div>
            <div class="charge-table-expand" v-if="subTypeDetail.categoryName === '充电桩'">
              <span>充电时间： {{(scope.row.extraAttr.default*scope.row.workTime) | chargeWorkTime}}</span>
              <span>时间刻度：{{(scope.row.extraAttr.step*scope.row.workTime) | chargeWorkTime}}</span>
              <span>最大时间：{{(scope.row.extraAttr.max*scope.row.workTime) | chargeWorkTime}}</span>
              <span>最小时间：{{(scope.row.extraAttr.min*scope.row.workTime) | chargeWorkTime}}</span>
              <span>最大功率：{{ scope.row.extraAttr.maxPower }}W</span>
              <p><span>当档位介于：0 至 {{ scope.row.extraAttr.power1 }}W之间时，系数为{{ scope.row.extraAttr.ratio1 }}</span></p>
              <p><span>当档位介于：{{ scope.row.extraAttr.power1}} 至 {{ scope.row.extraAttr.power2 }}W之间时，系数为{{ scope.row.extraAttr.ratio2 }}</span></p>
              <p><span>当档位介于：{{ scope.row.extraAttr.power2 }} 至 {{ scope.row.extraAttr.power3 }}W之间时，系数为{{ scope.row.extraAttr.ratio3 }}</span></p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="baseFunctionCode" label="基础指令"></el-table-column>
        <el-table-column prop="functionName" label="功能模式"></el-table-column>
        <el-table-column prop="functionCode" label="功能指令"></el-table-column>
        <el-table-column prop="functionQiekjCode" label="企鹅指令" min-width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="functionYoufangCode" label="有方指令" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="价格">
          <template slot-scope="scope">
            <span>{{scope.row.price}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="functionYoufangCode" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status | cloudStatusTypes}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workTime" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.workTime | chargeWorkTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新增型号dialog -->
    <el-dialog title="新增/修改型号" width="80%" :visible.sync="openAddModelDialog" @close="openAddModelDialog = false">
      <el-form class="add-function-form" :rules="modelRules" :model="addForm" ref="addForm">
        <el-form-item label="老二级类型" prop="code">
          <el-select v-model="addForm.code" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in secondType" :key="item.id" :label="item.machineTypeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号编码：" prop="modelCode">
          <el-input clearable v-model="addForm.modelCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="名称：" prop="modelName">
          <el-input clearable v-model="addForm.modelName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="型号：" prop="modelType">
          <el-input clearable v-model="addForm.modelType" auto-complete="off" />
        </el-form-item>
        <el-form-item label="分类：" class="form-item-m" prop="categoryCode">
          <el-select v-model="addForm.categoryCode" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in firstType" :key="item.categoryCode" :label="item.categoryName + ' [' + item.categoryCode +  ']'" :value="item.categoryCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="特殊参数：" prop="extraAttr">
          <el-input clearable v-model="addForm.extraAttr" type="textarea" 
  :rows="4" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="editSubmit('addForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改功能 -->
    <el-dialog title="编辑型号功能" width="80%" :visible.sync="openEditFunctionDialog" @close="openEditFunctionDialog = false">
      <el-form class="add-function-form" :rules="modelRules" :model="addForm" ref="addForm">
        <el-form-item label="老二级类型" prop="code">
          <el-select v-model="addForm.code" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in secondType" :key="item.id" :label="item.machineTypeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号编码：" prop="modelCode">
          <el-input clearable v-model="addForm.modelCode" auto-complete="off" />
        </el-form-item>
        <el-form-item label="名称：" prop="modelName">
          <el-input clearable v-model="addForm.modelName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="型号：" prop="modelType">
          <el-input clearable v-model="addForm.modelType" auto-complete="off" />
        </el-form-item>
        <el-form-item label="分类：" class="form-item-m" prop="categoryCode">
          <el-select v-model="addForm.categoryCode" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in firstType" :key="item.categoryCode" :label="item.categoryName + ' [' + item.categoryCode +  ']'" :value="item.categoryCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="特殊参数：" prop="extraAttr">
          <el-input clearable v-model="addForm.extraAttr" type="textarea" 
  :rows="4" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="editSubmit('addForm')">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import { cloudStatusTypes } from '@/utils/Mapping';
import moment from 'moment';

export default {
  data() {
    return {
      searchData: {
        // 头部搜索
        categoryCode: null,
        name: null
      },
      list: [],
      firstType: [],
      secondType: [],
      secondVisible: false,
      subTypeDetail: {
        extraAttr: { channels: [] }
      },
      openAddModelDialog: false,
      modelRules: {
        modelCode: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
        code: [{ required: true, message: '请选择老二级类型', trigger: 'blur' }],
        modelName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        modelType: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        categoryCode: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      addForm: {
        // 新增
        id: null,
        code: null,
        modelCode: null,
        modelName: null,
        modelType: null,
        categoryCode: null,
        status: 0,
        extraAttr: null
      },
      openEditFunctionDialog: true
    };
  },
  filters: {
    cloudStatusTypes: val => {
      return cloudStatusTypes[val];
    },
    workTime: val => {
      return val / 60;
    },
    chargeWorkTime: val => {
      return val ? DataUtils.formatSecond(val) : '';
    }
  },
  created() {
    this.geFirstType();
    this.getModelList();
    this.geSecondType();
  },
  methods: {
    //根据搜索条件查询列表信息
    goSearch() {
      this.getModelList();
    },
    //获取一级类型配置列表
    geFirstType() {
      this.$axios.post(Api.CLOUD_CATEGORY).then(resp => {
        this.firstType = resp;
      });
    },
    //获取二级类型配置列表
    geSecondType() {
      this.$axios.post(Api.MACHINETYPE_SECONDS, { page: 1, pageSize: 500 }).then(resp => {
        this.secondType = resp.items;
      });
    },
    //获取二级类型配置列表
    getModelList() {
      this.apiUrl = Api.CLOUD_SUB_CATEGORY;
      let query = Object.assign({}, this.searchData);
      this.$axios.post(this.apiUrl, query).then(resp => {
        this.list = resp;
      });
    },
    // 打开详细页dialog
    openMachineTypeSecondDetailDialog(modelCode) {
      this.$axios.post(Api.CLOUD_SUB_CATEGORY_DETAIL + modelCode).then(resp => {
        this.secondVisible = true;
        this.subTypeDetail = resp;
        this.subTypeDetail.extraAttr = resp.extraAttr ? JSON.parse(resp.extraAttr) : { channels: [] };
        if (this.subTypeDetail.functionList) {
          this.subTypeDetail.functionList.forEach(item => {
            item.extraAttr = item.extraAttr ? JSON.parse(item.extraAttr) : {};
          });
        }
      });
    },
    handleOpenEditModelDialog(modelCode) {
      this.$axios.post(Api.CLOUD_SUB_CATEGORY_DETAIL + modelCode).then(resp => {
        this.addForm = resp;
        this.openAddModelDialog = true
      });
    },
    handleOpenEditFunctionDialog(modelCode) {
      this.$axios.post(Api.CLOUD_MODEL_FUNCTION_LIST, { modelCode }).then(resp => {
        console.log(resp)
        this.addForm = resp;
        this.openEditFunctionDialog = true
      });
    },
    // 新增二级类型
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addForm);
          let apiUrl = data.id ? Api.CLOUD_SUB_CATEGORY_EDIT : Api.CLOUD_SUB_CATEGORY_ADD;

          if (data.id) {
            this.$confirm('此操作会影响线上配置的指令，可能会导致设备不可用，是否继续？', '警告').then(() => {
              this.$axios.post(apiUrl, data).then(resp => {
                this.getModelList();
                this.openAddModelDialog = false;
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功！',
                  type: 'success'
                });
              });
            })
          }
          return;
        }
      });
    },
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
.charge-table-expand {
  span {
    margin-right: 35px;
    display: inline-block;
    padding-bottom: 20px;
  }
}
</style>
