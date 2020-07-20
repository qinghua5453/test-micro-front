<template>
  <section v-if="getPerm('dal:machineTypeSeconds:list')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="类型名称：">
            <el-input clearable size="small" v-model="searchData.machineTypeName"></el-input>
          </el-form-item>
          <el-form-item label="一级类型：">
            <el-select v-model="searchData.parentTypeId" size="small" placeholder="全部">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in firstType" :key="item.id" :label="item.machineTypeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通信类型：">
            <el-select v-model="searchData.communicationType" size="small" placeholder="全部">
              <el-option label="不限" :value="null"></el-option>
              <el-option label="串口" value="1"></el-option>
              <el-option label="脉冲" value="0"></el-option>
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
          <el-button v-if="getPerm('dal:machineTypeSeconds:save')" type="primary" class="el-icon-circle-plus" @click="openMachineTypeSecondEditDialog(0)" style="margin-bottom: 10px;">新增二级类型</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column fixed label="序号" width="80" type="index" :index="pagerIndex" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="类型名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openMachineTypeSecondDetailDialog(scope.row.id)">{{scope.row.machineTypeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="parentMachineTypeName" label="所属一级类型" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="communicationType" label="通信类型" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.communicationType == 0 ? '脉冲' : '串口'}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="公司" width="200" show-overflow-tooltip>
						</el-table-column> -->
            <el-table-column prop="funtionNames" label="功能模式" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column prop="createUserName" label="创建人" width="200" show-overflow-tooltip>
						</el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip width="180">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openMachineTypeSecondEditDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:delete')" content="删除" placement="top" effect="dark">
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
    <!-- 详细 -->
    <el-dialog class="dialog-type" title="二级类型详情" width="800" :visible.sync="secondVisible" @close="secondVisible = false" v-if="subTypeDetail">
      <el-form label-width="84px">
        <el-form-item label="类型名称：">
          <span>{{ subTypeDetail.machineTypeName }}</span>
        </el-form-item>
        <el-form-item label="一级类型：">
          <span>{{ subTypeDetail.parentTypeName }}</span>
        </el-form-item>
        <el-form-item label="通信类型：">
          <span>{{ subTypeDetail.communicationType == 0 ? '脉冲' : '串口'}}</span>
        </el-form-item>
        <el-form-item label="功能模式：">
          {{ functionNameList }}
        </el-form-item>
      </el-form>
      <el-table border :data="subTypeDetail.shopFuntions" style="width: 100%" class="my-table">
        <el-table-column prop="functionName" label="功能模式" width="180">
        </el-table-column>
        <el-table-column prop="detergentLiquid" label="洗衣液用量" width="180" v-if="isShowDetergent">
        </el-table-column>
        <el-table-column prop="detergentPrice" label="洗衣液价格" width="180" v-if="isShowDetergent">
        </el-table-column>
        <el-table-column :label="name" width="180" :key="key" v-for="(name, key) in company">
          <el-table-column prop="functionCode" label="功能指令">
            <template slot-scope="scope">
              {{ getCodeVer(scope.row.standardFunctionId, key, subTypeDetail.communicationType, 'functionCode') }}
              <!-- <el-input v-model="scope.row.functionCode"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="verFunctionCode" label="Ver指令">
            <template slot-scope="scope">
              {{ getCodeVer(scope.row.standardFunctionId, key, subTypeDetail.communicationType, 'verFunctionCode') }}
              <!-- <el-input v-model="scope.row.verFunctionCode"></el-input> -->
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog title="新增二级类型" width="80%" :visible.sync="dialogTableVisible" @close="handleCancel">
      <el-form class="add-function-form" :rules="secondrules" :model="addForm" ref="addForm">
        <el-form-item label="类型名称：" prop="machineTypeName">
          <el-input clearable v-model="addForm.machineTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="一级类型：" class="form-item-m" prop="parentTypeId">
          <el-select v-model="addForm.parentTypeId" placeholder="请选择" style="width: 100%" @change="handleSelectFirstType">
            <el-option v-for="item in firstType" :key="item.id" :label="item.machineTypeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通信类型：">
          <el-radio-group v-model="addForm.communicationType">
            <el-radio :label="0">脉冲</el-radio>
            <el-radio :label="1">串口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能模式" prop="firstTypeFunction">
          <el-checkbox v-for="item in firstTypeFunction" :checked="isFirstTypeCheck(item.id)" :disabled="isFirstTypeDisabled(item.id)" @change="handleChangeFirstType(item.id, $event)" :key="item.id">
            {{ item.functionName }}</el-checkbox>
        </el-form-item>
        <el-table border :data="addForm.shopFuntionList" style="width: 100%" class="my-table add-function-table">
          <el-table-column prop="standardFunctionId" label="标准模式" width="120" fixed>
            <template slot-scope="scope">
              {{ getFirstTypeFunctionNameById(addForm.shopFuntionList[scope.$index].standardFunctionId) }}
            </template>
          </el-table-column>
          <el-table-column prop="functionName" label="功能名称" width="120">
            <template slot-scope="scope">
              <el-input v-model="addForm.shopFuntionList[scope.$index].functionName" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="functionDescribe" label="功能描述" width="240">
            <template slot-scope="scope">
              <el-input v-model="addForm.shopFuntionList[scope.$index].functionDescribe" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="needMinutes" label="时间" width="80">
            <template slot-scope="scope">
              <el-input v-model="addForm.shopFuntionList[scope.$index].needMinutes" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="funtionPrice" label="价格" width="80">
            <template slot-scope="scope">
              <el-input v-model="addForm.shopFuntionList[scope.$index].funtionPrice" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="洗衣液用量" width="150" v-if="isShowDetergent">
            <template slot-scope="scope">
              <el-form-item prop="detergentLiquid">
                <el-select v-model="scope.row.detergentLiquid" placeholder="请选择" @change="changeDetergentPrice(scope.$index)" style="width:100%;" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])">
                  <el-option v-for="item in detergentList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="洗衣液价格" width="200" v-if="isShowDetergent">
            <template slot-scope="scope">
              <el-form-item :prop="'shopFuntionList.' + scope.$index + '.detergentPrice'" :rules='secondrules.detergentPrice'>
                <el-input v-model="scope.row.detergentPrice" clearable auto-complete="off" class="input-w" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="name" width="180" :key="key" v-for="(name, key) in company">
            <el-table-column label="脉冲指令" width="80">
              <template slot-scope="scope">
                <el-input v-model="addForm.shopFuntionList[scope.$index].codes[key].functionCode" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="串口指令" width="180">
              <template slot-scope="scope">
                <el-input v-model="addForm.shopFuntionList[scope.$index].codes[key].verFunctionCode" :disabled="!isOpen(addForm.shopFuntionList[scope.$index])"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="functionDescribe" label="模式状态" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleToggleStatus(scope.$index)">{{ isOpen(addForm.shopFuntionList[scope.$index]) ? '禁用' : '启用'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="editSubmit('addForm')">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import { MachineCompany, MachineTypes } from '@/utils/Mapping';
import PagerMixin from '@/mixins/PagerMixin';

export default {
  name: 'page-second-list',
  mixins: [PagerMixin],
  data() {
    // 验证洗衣液价格
    var checkdetergentPrice = (rule, value, callback) => {
      let reg = /^(\d|[1-9]\d|99)(\.\d{1,2})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (!reg.test(value)) {
        return callback(new Error('金额0-99，最多允许两位小数'));
      } else {
        callback();
      }
    };
    return {
      company: MachineCompany,

      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        machineTypeName: null,
        parentTypeId: null,
        communicationType: null,
        startTime: null,
        endTime: null,
        time: null
      },

      detailData: {
        communicationType: null,
        id: null,
        machineTypeName: null,
        parentTypeId: null,
        shopFuntions: [],
        codes: []
      },

      addForm: {
        // 新增
        id: null,
        machineTypeName: null,
        communicationType: 0,
        parentTypeId: null,
        shopFuntions: [],
        shopFuntionList: [],
        codes: []
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
      isShowDetergent: false,
      // 编辑和新增dialog
      dialogTableVisible: false,
      // 详细页dialog
      secondVisible: false,

      // 新增验证
      secondrules: {
        machineTypeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        parentTypeId: [{ required: true, message: '请选择一级类型', trigger: 'change' }],
        detergentPrice: [{ validator: checkdetergentPrice, trigger: 'blur' }]
        // firstTypeFunction:[
        // 	{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
      }
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:machineTypeSeconds:list')) {
      this.getTypeList(0);
      this.getMachineSeconds();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //获取二级类型配置列表
    getMachineSeconds() {
      this.apiUrl = Api.MACHINETYPE_SECONDS;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    //根据搜索条件查询列表信息
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
        } else {
          return false;
        }
      });
    },

    // 打开详细页dialog
    async openMachineTypeSecondDetailDialog(id) {
      if (this.getPerm('dal:machineTypeSeconds:details')) {
        await this.getSubTypeDetail(id).then(_ => (this.secondVisible = true));
        console.log(this.subTypeDetail);
        let machineType = MachineTypes[this.subTypeDetail.parentTypeId];
        if (machineType == 1 || machineType == 3) {
          this.isShowDetergent = true;
        } else {
          this.isShowDetergent = false;
        }
      }
    },

    // 打开编辑dialog
    async openMachineTypeSecondEditDialog(id) {
      this.isShowDetergent = false;
      this.addForm = {
        communicationType: 0,
        id: null,
        parentTypeId: null,
        shopFuntions: [],
        shopFuntionList: [],
        codes: []
      };
      this.getSubTypeDetail(null);
      this.getFirstTypeFunctionList(null);
      if (id) {
        // 获取型号数据
        await this.getSubTypeDetail(id);
        // 获取大类对应的基本功能
        await this.getFirstTypeFunctionList(this.subTypeDetail.parentTypeId);

        // 绑定表达提交数据
        this.addForm.id = this.subTypeDetail.id;
        this.addForm.machineTypeName = this.subTypeDetail.machineTypeName;
        this.addForm.parentTypeId = this.subTypeDetail.parentTypeId;
        this.addForm.communicationType = this.subTypeDetail.communicationType;
        let machineType = MachineTypes[this.subTypeDetail.parentTypeId];
        if (machineType == 1 || machineType == 3) {
          this.isShowDetergent = true;
        } else {
          this.isShowDetergent = false;
        }
        this.addForm.shopFuntionList = this.subTypeDetail.shopFuntions.map(item => {
          // 组装的数据
          let data = {
            id: item.id,
            standardFunctionId: item.standardFunctionId,
            machineTypeId: item.machineTypeId,
            functionName: item.functionName,
            functionDescribe: item.functionDescribe,
            needMinutes: item.needMinutes,
            funtionPrice: item.funtionPrice,
            ifOpen: item.ifOpen,
            codes: {},
            detergentLiquid: item.detergentLiquid,
            detergentPrice: item.detergentPrice
          };
          for (let company in this.company) {
            let code = this.getCodeVer(data.standardFunctionId, company, this.subTypeDetail.communicationType);
            data.codes[company] = {
              id: code ? code.id : null,
              functionCode: code ? code.functionCode : null,
              verFunctionCode: code ? code.verFunctionCode : null
            };
          }
          return data;
        });
      }
      this.dialogTableVisible = true;
    },

    // 编辑或者新增取消
    handleCancel() {
      this.dialogTableVisible = false;
      this.$refs.addForm.resetFields();
    },

    // 是否是关闭的功能
    isOpen(data) {
      return data.ifOpen == 0;
    },
    // 是否选中
    isFirstTypeCheck(id) {
      if (this.addForm) {
        return (
          this.addForm.shopFuntionList.filter(x => {
            return id === x.standardFunctionId;
          }).length > 0
        );
      }
      return false;
    },
    isFirstTypeDisabled(id) {
      if (this.subTypeDetail) {
        return (
          this.subTypeDetail.shopFuntions.filter(x => {
            return id === x.standardFunctionId;
          }).length > 0
        );
      }
      return false;
    },

    handleSelectFirstType(typeId) {
      let machien_type = MachineTypes[typeId];
      if (machien_type == 1 || machien_type == 3) {
        this.isShowDetergent = true;
      } else {
        this.isShowDetergent = false;
      }
      this.addForm.shopFuntionList = [];
      this.getFirstTypeFunctionList(typeId);
    },

    // 修改类型功能
    handleChangeFirstType(id, flag) {
      console.log('flag' + flag);
      if (flag) {
        // 新增
        // 获取标准数据
        let fun = this.firstTypeFunction.find(item => item.id === id);
        let addFun = {
          id: null,
          standardFunctionId: id,
          machineTypeId: fun.machineTypeId,
          functionName: fun.functionName,
          functionDescribe: fun.functionDescribe,
          needMinutes: fun.needMinutes,
          funtionPrice: fun.funtionPrice,
          ifOpen: 0,
          detergentLiquid: fun.detergentLiquid,
          detergentPrice: fun.detergentPrice,
          codes: {}
        };
        for (let company in this.company) {
          addFun.codes[company] = {
            id: null,
            functionCode: null,
            verFunctionCode: null
          };
        }
        this.addForm.shopFuntionList.push(addFun);
      } else {
        // 删除
        let index = this.addForm.shopFuntionList.findIndex(item => item.standardFunctionId === id);
        index !== -1 && this.addForm.shopFuntionList.splice(index, 1);
      }
    },
    handleToggleStatus(index) {
      this.$set(this.addForm.shopFuntionList[index], 'ifOpen', this.addForm.shopFuntionList[index].ifOpen == 0 ? 1 : 0);
    },
    getCodeVer(standardFunctionId, company, communicationType, key = null) {
      let result = this.subTypeDetail.codes.find(item => {
        return item.company === company && item.standardFunctionId === standardFunctionId && item.communicationType === communicationType;
      });
      if (!result) return null;
      else return key === null ? result : result[key];
    },
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addForm);
          let apiUrl = data.id ? Api.MACHINETYPE_EDIT : Api.MACHINETYPE_ADD;

          // shopFunctionList转codes ,functionIds
          let codes = [],
            shopFuntions = [];
          for (let item of data.shopFuntionList) {
            // code 处理
            for (let company in MachineCompany) {
              // 没有code数据，不做处理
              if (item.codes[company].functionCode === null && item.codes[company].verFunctionCode === null) continue;
              codes.push({
                id: item.codes[company].id,
                standardFunctionId: item.standardFunctionId,
                company: company,
                functionCode: item.codes[company].functionCode,
                functionName: item.functionName,
                VerFunctionCode: item.codes[company].verFunctionCode
              });
            }
            item.codes = null;
            shopFuntions.push(item);
          }

          // data.codes = codes
          shopFuntions.forEach((item, i) => {
            for (let key in item) {
              data[`shopFuntions[${i}].${key}`] = item[key];
            }
          });
          codes.forEach((item, i) => {
            for (let key in item) {
              data[`codes[${i}].${key}`] = item[key];
            }
          });
          // data.shopFuntions = shopFuntions
          data.shopFuntionList = null;
          this.$axios.post(apiUrl, data).then(resp => {
            this.getMachineSeconds();
            this.dialogTableVisible = false;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          });

          return;
        }
      });
    },
    // 删除店铺
    handleDelete(id) {
      this.$confirm('您确定要删除该二级类型吗，如果该类型下有绑定机器无法删除哦', '删除确认').then(_ => {
        this.$axios
          .post(Api.MACHINETYPE_DELETE, {
            id: id
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '二级类型已删除成功！',
              type: 'success'
            });
            this.getMachineSeconds();
          });
      });
    },

    // 改变洗衣液用量
    changeDetergentPrice(index) {
      if (this.addForm.shopFuntionList[index].detergentLiquid == 0) {
        this.addForm.shopFuntionList[index].detergentPrice = '0';
      } else if (this.addForm.shopFuntionList[index].detergentLiquid == 8) {
        this.addForm.shopFuntionList[index].detergentPrice = '0.8';
      } else if (this.addForm.shopFuntionList[index].detergentLiquid == 10) {
        this.addForm.shopFuntionList[index].detergentPrice = '1';
      } else if (this.addForm.shopFuntionList[index].detergentLiquid == 12) {
        this.addForm.shopFuntionList[index].detergentPrice = '1.2';
      }
    },
    ...mapActions('machine', ['getTypeList', 'getSubTypeDetail', 'getFirstTypeFunctionList'])
  },
  computed: {
    functionNameList() {
      let arr = this.subTypeDetail.shopFuntions.map(item => {
        return item.functionName;
      });
      return arr.join(',');
    },
    ...mapState('machine', {
      // 一级类列表
      firstType: state => state.firstType,
      // 一级类绑定的功能列表
      firstTypeFunction: state => state.firstTypeFunction,
      // 二级类详细数据
      subTypeDetail: state => state.subTypeDetail
    }),
    ...mapGetters('machine', ['getFirstTypeFunctionNameById']),
    ...mapGetters('user', ['getPerm'])
  },
  components: {
  }
};
</script>

<style lang="less">
.seconde-wrapper {
  .el-dialog {
    width: 750px;
  }
  .dialog-type {
    .el-form-item {
      width: 50%;
      float: left;
    }
  }
}
.add-function-form {
  .el-form-item__label {
    width: 94px !important;
  }
  .el-form-item__content {
    margin-left: 96px;
  }
  // .my-table table td{
  //   padding: 15px 0;
  // }
  .add-function-table {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item {
      //margin-bottom: 0!important;
      margin-top: 22px !important;
    }
  }
}
</style>
