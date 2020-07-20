<template>
  <section v-if="getPerm('dal:funtion:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['设置', '功能模式']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="模式名称：">
            <el-input size="small" clearable v-model="searchData.functionName"></el-input>
          </el-form-item>
          <el-form-item label="一级类型：">
            <el-select size="small" v-model="searchData.machineTypeId" placeholder="全部">
              <el-option v-for="item in firstTypes" :key="item.id" :label="item.machineTypeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s seconde-wrapper">
          <!--新增弹出框-->
          <el-button v-if="getPerm('dal:funtion:save')" type="primary" class="el-icon-circle-plus" @click="openAddFunctionDialog(null)" style="margin-bottom: 10px;">新增功能模式</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="functionName" label="模式名称" width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="functionDescribe" label="功能描述" width="250" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="machineTypeName" label="适用类型" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="needMinutes" label="耗时(分钟)" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="funtionPrice" label="价格" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="attachFunction" label="附加功能" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ifOpen" :formatter="formatterisOpen" label="是否开放">
            </el-table-column>
            <el-table-column prop="detergentLiquid" label="洗衣液用量" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.detergentLiquid || scope.row.detergentLiquid == 0 ? scope.row.detergentLiquid : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detergentPrice" label="洗衣液价格" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:funtion:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddFunctionDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:funtion:delete')" content="删除" placement="top" effect="dark">
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
    <!--////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->
    <el-dialog class="dialog-standfed" :title="funtionTitle" size="tiny" :visible.sync="isShowAddFunctionDialog" @close="handleCancel">
      <el-form :model="addForm" label-width="110px" :rules="standrules" ref="addForm">
        <el-form-item label="模式名称：" prop="functionName">
          <el-input clearable v-model="addForm.functionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能描述：" prop="functionDescribe">
          <el-input clearable v-model="addForm.functionDescribe" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="耗时(分钟):" prop="needMinutes">
          <el-input clearable v-model="addForm.needMinutes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)：" prop="funtionPrice">
          <el-input clearable v-model="addForm.funtionPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="洗衣液用量：" prop="detergentLiquid" v-if="isShowDetergent">
          <el-select v-model="addForm.detergentLiquid" placeholder="请选择" style="width:100%;" @change="changeDetergentPrice">
            <el-option v-for="item in detergentList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="洗衣液价格：" prop="detergentPrice" v-if="isShowDetergent">
          <el-input clearable v-model="addForm.detergentPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input clearable v-model="addForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="适用类型：" prop="machineTypeId">
          <el-radio-group v-model="addForm.machineTypeId" class="group-radio-type" @change="handleChangeInfo">
            <el-radio v-for="item in firstTypes" :key="item.id" :label="item.id">{{item.machineTypeName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附加功能：">
          <el-checkbox-group v-model="addForm.attachId" @change="handleChange">
            <el-checkbox v-for="item in attachNames" :key="item.id" :label="item.id">{{item.functionName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否开放：" prop="ifOpen">
          <el-radio-group v-model="addForm.ifOpen">
            <el-radio :label="0">开放</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isShoworiginalFunctionId" label="功能组合：" class="form-item-m">
          <el-select v-model="addForm.originalFunctionId" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in functionCombins" :key="item.id" :label="item.functionName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="handleAdd()">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { MachineTypes } from '@/utils/Mapping';

export default {
  name: 'page-standfea-list',
  mixins: [PagerMixin],
  data() {
    // 验证金额
    var checkPrice = (rule, value, callback) => {
      let reg = /^(\d|[1-9]\d|99)(\.\d{1,2})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (!reg.test(value)) {
        return callback(new Error('金额0-99，最多允许两位小数'));
      } else {
        callback();
      }
    };
    return {
      list: [], // 数据
      total: 0,

      searchData: {
        // 头部搜索
        functionName: null,
        machineTypeId: null,
        communicationType: null,
        startTime: null,
        endTime: null,

        //
        time: null
      },

      //新增
      addForm: {
        id: null,
        functionName: null,
        functionDescribe: null,
        needMinutes: null,
        funtionPrice: null,
        machineTypeId: null,
        ifOpen: null,
        attachId: [],
        originalFunctionId: null,
        detergentLiquid: null,
        detergentPrice: null
      },
      // 洗衣液用量
      detergentList: [
        {
          value: '0',
          label: '0'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '12',
          label: '12'
        }
      ],
      isShowDetergent: false, // 是否显示洗衣液或者洗衣液价格
      firstTypes: [], // 一级类型
      isShoworiginalFunctionId: false, // 组合功能是否显示
      standrules: {
        functionName: [
          {
            required: true,
            message: '请输入功能名称',
            trigger: 'blur'
          }
        ],
        functionDescribe: [
          {
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }
        ],
        needMinutes: [
          { required: true, message: '请输入耗时分钟', trigger: 'blur' },
          {
            pattern: '^\\d{0,5}?$',
            message: '耗时分钟最多不超过5位整数',
            trigger: 'blur'
          }
        ],
        funtionPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          {
            pattern: '^\\d{0,10}([.]{1}[0-9]{1,4})?$',
            message: '价格最多不超过10位整数且最多带4位小数',
            trigger: 'blur'
          }
        ],
        sort: [{ pattern: '^\\d*?$', message: '排序只能输入数字', trigger: 'blur' }],
        ifOpen: [{ required: true, message: '请选择类型', trigger: 'change' }],
        detergentPrice: [{ required: true, message: '请填写价格', trigger: 'blur' }, { validator: checkPrice, trigger: 'blur' }]
        // machineTypeId: [{
        // 	required: true,
        // 	message: '请选择适用类型',
        // 	trigger: 'change'
        // }],
      },
      isShowAddFunctionDialog: false,
      attachNames: [],
      functionCombins: [],
      funtionTitle: ''
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:funtion:list')) {
      this.getFunctionList();
      this.getTypelist();
      this.getAttachList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //获取功能模式列表
    getFunctionList() {
      this.apiUrl = Api.FUNCTION_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
        // this.functionCombins = resp.items
      });
    },
    // 获取附加功能列表
    getAttachList() {
      let query = this.$route.query;
      this.setApiParams(query);
      return this.$axios.post(Api.ATTACH_LIST, this.apiParams).then(resp => {
        this.attachNames = resp.items;
      });
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    // 附加功能改变的时候
    handleChange() {
      if (this.addForm.attachId != '') {
        this.isShoworiginalFunctionId = true;
      } else {
        this.isShoworiginalFunctionId = false;
      }
    },
    // 获取功能组合
    getFunctionOriginal(id) {
      return this.$axios
        .post(Api.FUNCTION_ORIGINALS, {
          machineTypeId: id
        })
        .then(resp => {
          this.functionCombins = resp;
        });
    },
    //适用类型
    handleChangeInfo(val) {
      let type = MachineTypes[val];
      if (type == 1 || type == 3) {
        this.isShowDetergent = true;
      } else {
        this.isShowDetergent = false;
      }
      this.addForm.detergentLiquid = null;
      this.addForm.detergentPrice = null;
      let machineTypeId = this.addForm.machineTypeId || '';
      this.getFunctionOriginal(machineTypeId);
    },
    //根据条件查询标准功能列表信息
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;

          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    //获取一级类型
    getTypelist() {
      this.$axios
        .post(Api.MACHINE_GETTYPELIST, {
          parentId: 0
        })
        .then(resp => {
          this.firstTypes = resp;
        });
    },
    //是否开放
    formatterisOpen(row, column) {
      switch (row.ifOpen) {
        case 0:
          return '开放';
          break;
        case 1:
          return '不开放';
          break;

        case 2:
          return '通用';
          break;
      }
    },
    //获取标准功能详情
    getFunctionDetail(id) {
      return this.$axios
        .post(Api.FUNCTION_DETAILS, {
          id: id
        })
        .then(resp => {
          this.addForm.id = resp.id;
          this.addForm.functionName = resp.functionName;
          this.addForm.needMinutes = String(resp.needMinutes);
          this.addForm.functionDescribe = resp.functionDescribe;
          this.addForm.funtionPrice = String(resp.funtionPrice);
          this.addForm.sort = resp.sort ? String(resp.sort) : '0';
          this.addForm.machineTypeId = resp.machineTypeId;
          this.addForm.ifOpen = resp.ifOpen;
          this.addForm.attachId = resp.attachId || [];
          this.addForm.originalFunctionId = resp.originalFunctionId;
          this.addForm.detergentLiquid = resp.detergentLiquid;
          this.addForm.detergentPrice = resp.detergentPrice;

          let type = MachineTypes[resp.machineTypeId];
          if (type == 1 || type == 3) {
            this.isShowDetergent = true;
          } else {
            this.isShowDetergent = false;
          }
          if (this.addForm.attachId != '') {
            this.isShoworiginalFunctionId = true;
          } else {
            this.isShoworiginalFunctionId = false;
          }
          this.getFunctionOriginal(resp.machineTypeId);
        });
    },
    // 新增功能模式
    async openAddFunctionDialog(id) {
      this.isShowDetergent = false;
      this.funtionTitle = '新增功能模式';
      this.addForm = {
        id: null,
        functionName: null,
        functionDescribe: null,
        needMinutes: null,
        funtionPrice: null,
        machineTypeId: null,
        ifOpen: null,
        sort: null,
        attachId: [],
        originalFunctionId: null,
        detergentLiquid: null,
        detergentPrice: null
      };
      if (id != null) {
        this.funtionTitle = '编辑功能模式';
        await this.getFunctionDetail(id);
      }
      this.isShowAddFunctionDialog = true;
    },
    // 改变洗衣液用量
    changeDetergentPrice(val) {
      if (val == 0) {
        this.addForm.detergentPrice = 0;
      } else if (val == 20) {
        this.addForm.detergentPrice = 0.8;
      } else if (val == 30) {
        this.addForm.detergentPrice = 1;
      } else if (val == 40) {
        this.addForm.detergentPrice = 1.2;
      }
    },
    //保存添加信息
    handleAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 验证通过
          let data = DataUtils.clone(this.addForm);
          let apiUrl = data.id != null ? Api.FUNCTION_EDIT : Api.FUNCTION_ADD;
          this.$axios.post(apiUrl, data).then(_ => {
            this.getFunctionList();
            this.isShowAddFunctionDialog = false;
            this.isShoworiginalFunctionId = false;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          });
        }
      });
    },
    // 取消新增或者编辑
    handleCancel() {
      this.isShowAddFunctionDialog = false;
      this.$refs.addForm.resetFields();
    },
    //删除
    handleDelete(id) {
      this.$confirm('您确定要删除该功能吗', '删除确认').then(_ => {
        this.$axios
          .post(Api.FUNCTION_DELETE, {
            id: id
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功！',
              type: 'success'
            });
            this.getFunctionList();
          });
      });
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
.dialog-standfed {
  .el-dialog {
    width: 700px;
  }
  .group-radio-type {
    .el-radio {
      margin-right: 30px;
      margin-top: 20px;
    }
    .el-radio + .el-radio {
      margin-right: 30px;
      margin-left: 0;
    }
  }
  .el-checkbox {
    margin-right: 30px;
  }
  .el-checkbox + .el-checkbox {
    margin-right: 30px;
    margin-left: 0;
  }
}

.dialog-type {
  .el-form-item {
    width: 50%;
    float: left;
  }
}
</style>
