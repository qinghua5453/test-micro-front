<template>
  <div>
    <el-dialog title="新增发货单" :visible="visible" :before-close="modalClose" :close="modalClose" :close-on-click-modal="false" width="680px" top="10vh">
      <el-form :model="shipForm" :rules="shipFormRules" ref="shipForm" label-width="120px" label-position="right" class="demo-shipForm">
        <el-form-item label="钉钉审批编号" prop="dingtalkProcessId">
          <el-input v-model="shipForm.dingtalkProcessId" placeholder="请输入钉钉审批编号"></el-input>
        </el-form-item>
        <el-form-item label="ERP发货单号" prop="erpShipNo">
          <el-input v-model="shipForm.erpShipNo" placeholder="请输入ERP发货单号"></el-input>
        </el-form-item>
        <el-form-item label="商业属性" prop="businessAttribute">
          <el-select v-model="shipForm.businessAttribute">
            <el-option v-for="(name, id) in businessType" v-if="id !== 1" :key="id" :label="name" :value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块类型" prop="moduleType">
          <el-input v-model="shipForm.moduleType" placeholder="请输入模块类型"></el-input>
        </el-form-item>
        <el-form-item label="BD：" class="form-item-m" prop="bdId">
          <el-select style="width:100%;" v-model="shipForm.bdId" filterable remote clearable :loading="loading" @change="changeMember" :remote-method="getMemberList" placeholder="请选择">
            <el-option v-for="item in memberList" :key="item.userId" :label="item.fullName" :value="item.code" :ref="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商：" class="form-item-m" prop="operatorId">
          <el-select style="width:100%;" v-model="shipForm.operatorId" filterable remote clearable :loading="loading" @change="changeOperator" :remote-method="getOperatorList" placeholder="请选择">
            <el-option v-for="item in operatorList" :key="item.id" :label="item.userName" :value="item.id" :data-operator="item.userName" :ref="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="shipForm.receiver" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="发货数量" prop="quantity">
          <el-input v-model="shipForm.quantity" placeholder="请输入发货数量"></el-input>
          <p style="line-height:20px;font-size:12px;">温馨提示：发货数量最大5000</p>
        </el-form-item>
        <el-form-item label="IMEI号" prop="imeiList">
          <el-input type="textarea" :rows="6" v-model="shipForm.imeiList"></el-input>
          <span class="imei_count">{{ computedImeiCount }}</span>
        </el-form-item>
        <el-form-item label="发货时间" prop="shipTime">
          <el-date-picker v-model="shipForm.shipTime" type="date" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="shipForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('shipForm')">确定</el-button>
          <el-button @click="modalClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="isSuccessInfoVisible" width="30%">
      <p class="tip-list">{{ isSuccessInfo.msg }}</p>
      <ul class="tip-list">
        <li v-for="(item, index) in isSuccessInfo.data" :key="index">{{ item }}</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isSuccessInfoVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import { businessType } from '@/utils/Mapping';
import { getOperatorList, addShip, getMemberList } from '../invoiceList';
export default {
  props: ['id', 'visible', 'appSolt'],
  data() {
    const validateImeiList = (rule, value, callback) => {
      if (!value) {
        callback(new Error('IMEI号不可为空'));
      } else {
        let list = value.split(/\n/g);
        let isRepeat = false;
        let repeatImei = '';
        var newlist = list.sort();
        for (var i = 0; i < newlist.length; i++) {
          if (newlist[i] && newlist[i] === newlist[i + 1]) {
            isRepeat = true;
            repeatImei = newlist[i];
          }
        }
        if (isRepeat) {
          callback(new Error(`IMEI号：${repeatImei}存在重复，请重新输入`));
        } else {
          callback();
        }
      }
    };
    return {
      shipForm: {
        dingtalkProcessId: '',
        erpShipNo: '',
        shipTime: moment().format('YYYY-MM-DD'),
        bdId: '',
        bdName: '',
        operatorId: '',
        receiver: '',
        quantity: '',
        imeiList: '',
        remark: '',
        businessAttribute: '',
        moduleType: '',
        operatorName: ''
      },
      shipFormRules: {
        dingtalkProcessId: [{ required: true, message: '请填写钉钉审批编号', trigger: 'blur' }],
        erpShipNo: [{ required: true, message: '请填写ERP发货单号', trigger: 'blur' }],
        businessAttribute: [{ required: true, message: '请选择商业属性', trigger: 'change' }],
        shipTime: [{ required: true, message: '请选择发货时间', trigger: 'change' }],
        bdId: [{ required: true, message: '请选择BD', trigger: 'change' }],
        operatorId: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        receiver: [{ required: true, message: '请填写收货人', trigger: 'blur' }],
        quantity: [{ required: true, message: '请填写发货数量', trigger: 'blur' }, { pattern: /^[1-9]+\d*$/, message: '输入大于0的整数', trigger: 'blur' }],
        imeiList: [{ required: true, trigger: 'blur', validator: validateImeiList }],
        moduleType: [{ required: true, message: '请填写模块类型', trigger: 'blur' }]
      },
      operatorList: [],
      memberList: [],
      loading: false,
      isSuccessInfo: {},
      isSuccessInfoVisible: false
    };
  },
  computed: {
    businessType() {
      return businessType;
    },
    computedImeiCount() {
      let list = this.handleImeiList();
      return list.length;
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getOperatorList(keywords) {
      if (keywords === '') {
        let resp = await getOperatorList();
      } else {
        this.loading = true;
        let resp = await getOperatorList({ name: keywords });
        this.operatorList = resp || [];
        this.loading = false;
      }
    },
    async getMemberList(keywords) {
      if (keywords === '') {
        let resp = await getMemberList();
      } else {
        this.loading = true;
        let resp = await getMemberList({ fullName: keywords });
        this.memberList = resp.items || [];
        this.loading = false;
      }
    },
    changeMember(value) {
      this.shipForm.bdName = this.$refs[value][0].label || '';
    },
    changeOperator(value) {
      this.shipForm.operatorName = this.$refs[value][0].label || '';
    },
    validImeiList() {
      let newList = new Set(this.handleImeiList());
      if (Number(this.shipForm.quantity) !== newList.size) {
        this.$alert(`计划发货数量与实际上传数量不一致，请检查修改`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
        return false;
      } else {
        return true;
      }
    },
    handleImeiList() {
      let list = this.shipForm.imeiList.split(/\n/g);
      list = list.filter(item => {
        //去掉最后有可能的空换行
        if (item) return item;
      });
      return list;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid && this.validImeiList()) {
          let payload = Object.assign({}, this.shipForm);
          let imei = this.handleImeiList();
          payload.imeiList = imei.join(',');
          addShip(payload).then((res) => {
            if (Number(res.code) === 30003) {
              this.isSuccessInfo = res;
              this.isSuccessInfoVisible = true;
            } else {
              this.$listeners.getInvoiceListData && this.$listeners.getInvoiceListData();
              this.$message.success('操作成功！');
              this.modalClose();
            }

          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.imei {
  position: relative;
}
.imei_count {
  position: absolute;
  bottom: -3%;
  right: 2%;
}
.tip-list {
  text-align: center;
  line-height: 34px;
}
</style>
