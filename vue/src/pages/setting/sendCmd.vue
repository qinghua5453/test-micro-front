<template>
  <div class="cmd-page">
    <el-form :model="machineModuleForm" :rules="machineModuleFormRules" ref="machineModuleForm" label-position="top" label-width="120px" class="to-send-cmd-Form">
      <el-form-item label="第一步：输入IMEI号" prop="imei">
        <el-input v-model.trim="machineModuleForm.imei" placeholder="输入IMEI号"></el-input>
      </el-form-item>
      <el-form-item class="module-detail" v-if="ismoduleDetail">
        <div v-if="moduleDetail">
          <span>模块状态：<i :class="{danger:moduleDetail.status===2}">{{moduleDetail.status | modelImeiStatus}}</i></span>
          <span>计算后状态：<i :class="{danger:moduleDetail.computeStatus===2||moduleDetail.computeStatus===3}">{{moduleDetail.computeStatus | modelComputeStatus}}</i></span>
          <span>信号值：{{moduleDetail.signals}}</span>
          <span>第三方状态：{{moduleDetail.thirdStatus | modelThirdStatus}}</span>
          <span>绑定状态：{{moduleDetail.bindStatus |modelBindStatus}}</span>
          <span>是否支持蓝牙：{{moduleDetail.supportBle | modelSupportStatus}}</span>
          <span>是否支持洗衣液：{{moduleDetail.supportDetergent | modelSupportStatus}}</span>
          <span>箱号：{{moduleDetail.caseNo}}</span>
          <span>CCID：{{moduleDetail.ccid}}</span>
          <span>所属公司：{{moduleDetail.company | MachineCompany}}</span>
          <span>坐标：{{moduleDetail.coord}}</span>
          <span>固件版本号：{{moduleDetail.firmwareVersion}}</span>
          <span>硬件版本号：{{moduleDetail.hardwareVersion}}</span>
          <span>上报IP：{{moduleDetail.ip}}</span>
          <span>电压：{{moduleDetail.voltage}}</span>
          <span>注册时间：{{moduleDetail.regTime}}</span>
          <span>绑定时间：{{moduleDetail.bindTime}}</span>
          <span>创建时间：{{moduleDetail.createTime}}</span>
          <span>最后在线时间：{{moduleDetail.onlineTime}}</span>
          <span>修改时间：{{moduleDetail.updateTime}}</span>
          <div>
            <el-button type="primary" @click="getCcidModuleInfo(moduleDetail.imei)">模块网卡</el-button>
            <div v-if="CcidDetail.success">
              <div v-if="xwCardInfo">
                <span>ICCID号：{{xwCardInfo.iccid}}</span>
                <span>状态：{{xwCardInfo.userStatus |userStatus}}</span>
                <span>套餐名称：{{xwCardInfo.pkgName}}</span>
                <span>已用流量(MB)：{{xwCardInfo.usedFlow}}</span>
                <span>激活日期：{{xwCardInfo.activeTime}}</span>
                <span>到期日期：{{xwCardInfo.expireDate}}</span>
                <span>套餐流量(MB)：{{xwCardInfo.limitFlow}}</span>
                <span>IMSI号：{{xwCardInfo.imsi}}</span>
                <span>13位卡号：{{xwCardInfo.msisdn}}</span>
              </div>
              <div v-if="ctCardInfo">
                <span>套餐名称：{{ctCardInfo.curSetMeal}}</span>
                <span>到期日期：{{ctCardInfo.expireDate}}</span>
                <span>激活日期：{{ctCardInfo.activeDate}}</span>
                <span>ICCID号：{{ctCardInfo.iccid}}</span>
                <span>imsi号：{{ctCardInfo.imsi}}</span>
                <span>sim号：{{ctCardInfo.simCard}}</span>
                <span>剩余流量(MB)：{{ctCardInfo.remainFlow}}</span>
                <span>已用流量(MB)：{{ctCardInfo.usedFlow}}</span>
                <span>状态：{{ctCardInfo.status |ctCardInfoStatus}}</span>
                <span>是否需要实名认证：{{ctCardInfo.needAuthenticate |Authenticate}}</span>
                <span>是否强制实名认证：{{ctCardInfo.forceAuthenticate |Authenticate}}</span>
                <span>是否已经实名认证：{{ctCardInfo.isAuthenticated}}</span>
              </div>
              <div v-if="hthCardInfo">
                <span>套餐名称：{{hthCardInfo.pack}}</span>
                <span>套餐开始日期：{{hthCardInfo.dateActive}}</span>
                <span>套餐结束日期：{{hthCardInfo.dateInActive}}</span>
                <span>当月已用流量(MB)：{{hthCardInfo.trafficMonth}}</span>
                <span>当月总流量(MB)：{{hthCardInfo.monthValid}}</span>
                <span>套餐已用流量(MB)：{{hthCardInfo.packUsed}}</span>
                <span>套餐总流量(MB)：{{hthCardInfo.trafficTotal}}</span>
                <span>当前套餐距离结束日期剩余天数：{{hthCardInfo.dateAvailable}}</span>
                <span>状态：{{hthCardInfo.status}}</span>
              </div>
            </div>
            <div v-else>{{CcidDetail.error}}</div>
          </div>
        </div>
        <div v-else>暂无相关模块信息</div>
      </el-form-item>
      <el-form-item label="第二步：选择机器型号" prop="machineIds">
        <el-cascader :options="machineList" v-model="machineModuleForm.machineIds" :props="{value: 'categoryCode',label: 'categoryName',children: 'children'}" @active-item-change="handleItemChange"></el-cascader>
      </el-form-item>
      <el-form-item label="第三步：选择功能" prop="functionId">
        <el-select v-model="machineModuleForm.functionId" placeholder="请选择功能" @change="changeFunction">
          <el-option v-for="(item,index) in functionList" :key="index" :label="item.functionName + `【${item.modelCode}${item.functionCode}】`" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div class="extra-data" v-if="machineModuleForm.params.length>0">
        <p class="remark" v-if="remark">说明：{{remark}}</p>
        <el-form-item v-for="(item, index) in machineModuleForm.params" label=" " :key="index" :prop="'params.' + index + '.value'" :rules="machineModuleFormRules.value">
          <el-input v-model.trim="item.value" :placeholder="'参数'+(index+1)"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitMachineModuleForm('machineModuleForm')">发送指令</el-button>
        <el-button @click="resetForm('machineModuleForm')">重置</el-button>
      </el-form-item>
      <p v-if="successResult">返回值：{{successResult}}</p>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import { MachineCompany, modelBindStatus, modelComputeStatus, modelImeiStatus, modelSupportStatus, modelThirdStatus } from '@/utils/Mapping';
import { delay } from '@/utils/tool';
export default {
  data() {
    return {
      machineModuleForm: {
        imei: '',
        machineIds: [],
        functionId: '',
        params: [],
        send: true
      },
      moduleDetail: {}, //模块详情
      CcidDetail: {}, //网卡详情
      ctCardInfo: null,
      hthCardInfo: null,
      xwCardInfo: null,
      ismoduleDetail: false,
      machineList: [], //机器
      functionList: [], //功能
      remark: '',
      successResult: null,
      machineModuleFormRules: {
        imei: [{ required: true, message: '输入IMEI号', trigger: 'blur' }], //{ pattern: /^[1-9]+\d*$/, message: 'IMEI号必须为数字', trigger: 'blur' }
        machineIds: [{ type: 'array', required: true, message: '选择机器型号', trigger: 'change' }],
        functionId: [{ required: true, message: '选择功能', trigger: 'blur' }],
        value: [{ required: true, message: '参数不能为空', trigger: 'blur' }]
      }
    };
  },
  components: {},
  filters: {
    MachineCompany(val) {
      return MachineCompany[val];
    },
    modelBindStatus(val) {
      return modelBindStatus[val];
    },
    modelComputeStatus(val) {
      return modelComputeStatus[val];
    },
    modelImeiStatus(val) {
      return modelImeiStatus[val];
    },
    modelSupportStatus(val) {
      return modelSupportStatus[val];
    },
    modelThirdStatus(val) {
      return modelThirdStatus[val];
    },
    userStatus(val) {
      let map = {
        3: '待激活',
        4: '正常',
        7: '已停用'
      };
      return map[val];
    },
    ctCardInfoStatus(val) {
      let map = {
        0: '关机',
        1: '开机'
      };
      return map[val];
    },
    Authenticate(val) {
      let map = {
        false: '不需要',
        true: '需要'
      };
      return map[val];
    }
  },
  created() {
    this.getParentMachineTypeList();
  },
  methods: {
    //获取一级类型配置列表
    getParentMachineTypeList() {
      this.$axios.post(Api.CLOUD_CATEGORY).then(res => {
        this.machineList = res || [];
        this.machineList.forEach(item => this.$set(item, 'children', []));
      });
    },
    submitMachineModuleForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.moduleDetail) {
            this.$message({
              showClose: true,
              message: '暂无相关模块信息，无法发送指令',
              type: 'error'
            });
            return;
          }
          let payload = Object.assign({}, this.machineModuleForm);
          payload.params = payload.params.map(k => k.value).join(',');
          this.$axios.post(Api.CLOUD_MACHINE_START, payload).then(res => {
            this.successResult = res;
          });
        }
      });
    },

    resetForm(formName) {
      this.remark = '';
      this.successResult = null;
      this.$refs[formName].resetFields();
      this.machineModuleForm.params = [];
    },
    handleItemChange(val) {
      if (val.length > 0 && val.length <= 1) {
        let payload = { categoryCode: val[0] || '' };
        this.$axios.post(Api.CLOUD_SUB_CATEGORY, payload).then(res => {
          let sublist = res.map(k => {
            return { categoryCode: k.modelCode, categoryName: k.modelName, children: null };
          });
          this.machineList.forEach(item => {
            if (item.categoryCode === val[0]) item.children = sublist || [];
          });
        });
      }
    },
    useImeiGetMachineDetail() {
      if (this.machineModuleForm.imei) {
        this.$axios.post(Api.CLOUD_MODEL_DETAIL + this.machineModuleForm.imei).then(res => {
          this.moduleDetail = res || {};
        });
      }
    },

    getCcidModuleInfo(imei) {
      if (this.machineModuleForm.imei) {
        this.$axios.post(Api.CLOUD_MODULE_CCID, { imei: this.machineModuleForm.imei }).then(res => {
          this.CcidDetail = res || {};
          let { ctCardInfo, hthCardInfo, xwCardInfo } = res && res.content ? res.content : {};
          this.ctCardInfo = res ? res.ctCardInfo : ctCardInfo;
          this.hthCardInfo = res ? res.hthCardInfo : hthCardInfo;
          this.xwCardInfo = res ? res.xwCardInfo : xwCardInfo;
        });
      }
    },
    getModelFunctionList() {
      if (this.machineModuleForm.machineIds.length >= 2) {
        this.machineModuleForm.functionId = '';
        this.remark = '';
        let payload = { modelCode: this.machineModuleForm.machineIds[1] };
        this.$axios.post(Api.CLOUD_MODEL_FUNCTION_LIST, payload).then(res => {
          this.functionList = res || [];
          this.functionList = this.functionList.filter(item => {
            let company = this.getCompanyFunction(item);
            if (item[company]) return item;
          });
        });
      }
    },
    getCompanyFunction(funcion) {
      let company = this.moduleDetail ? this.moduleDetail.company : '';
      let keysList = Object.keys(funcion) || [];
      let conmpnyKeyList =
        keysList.filter(item => {
          if (item.toLocaleLowerCase().includes(company)) return item;
        }) || [];
      let conmpnyKey = conmpnyKeyList[0] || company;
      return conmpnyKey;
    },
    changeFunction(val) {
      let currentFuntion = this.functionList.find(item => item.id === val);
      if (currentFuntion) {
        let company = this.getCompanyFunction(currentFuntion);
        let reg = /%s/g;
        let arr = currentFuntion[company].match(reg) || [];
        this.machineModuleForm.params = arr.map(k => {
          return { value: '' };
        });
        this.remark = currentFuntion.remark;
      }
    }
  },
  watch: {
    'machineModuleForm.machineIds': {
      // 通过设置deep的值可以监听到
      handler(newVal) {
        if (newVal) {
          this.getModelFunctionList();
        }
      },
      deep: true
    },
    'machineModuleForm.imei': function(newVal) {
      if (newVal) {
        delay(() => {
          this.useImeiGetMachineDetail();
        }, 200);
        this.ismoduleDetail = true;
      } else {
        this.useImeiGetMachineDetail();
        this.ismoduleDetail = false;
      }
    }
  }
};
</script>
<style lang="less">
.to-send-cmd-Form {
  .el-cascader {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .extra-data .el-form-item .el-form-item__content {
    display: inline-block;
    width: 97%;
  }
}
</style>

<style rel="stylesheet/css" lang="less" scoped>
.to-send-cmd-Form {
  width: 800px;
  .module-detail {
    span {
      display: inline-block;
      min-width: 250px;
    }
    i {
      font-style: normal;
    }
  }
  .extra-data {
    overflow: hidden;
    > div {
      float: left;
      width: 49%;
      margin-right: 1%;
    }
  }
  .remark {
    font-size: 12px;
    padding-bottom: 12px;
  }
  .danger {
    color: #f00;
  }
}
</style>
