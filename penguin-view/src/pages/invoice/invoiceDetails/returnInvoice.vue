<template>
  <div>
    <el-dialog title="退货单" :visible="visible" :before-close="modalClose" :close="modalClose" :close-on-click-modal="false" width="680px" top="10vh">
      <el-form :model="shipForm" :rules="shipFormRules" ref="shipForm" label-width="120px" label-position="right" class="demo-shipForm">
        <el-form-item label="退货时间" prop="returnTime">
          <el-date-picker v-model="shipForm.returnTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择入库时间"> </el-date-picker>
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input v-model="shipForm.quantity" placeholder="请输入退货数量"></el-input>
        </el-form-item>
        <el-form-item label="IMEI号" prop="imeiList" class="imei">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="shipForm.imeiList"></el-input>
          <span class="imei_count">{{ computedImeiCount }}</span>
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
import { addShipReturn } from '../invoiceList';
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
        returnTime: moment().format('YYYY-MM-DD'),
        quantity: '',
        imeiList: '',
      },
      shipFormRules: {
        returnTime: [{ required: true, message: '请选择退货时间', trigger: 'change' }],
        quantity: [{ required: true, message: '请填写退货数量', trigger: 'blur' }, { pattern: /^[1-9]+\d*$/, message: '输入大于0的整数', trigger: 'blur' }],
        imeiList: [{ required: true, trigger: 'blur', validator: validateImeiList }]
      },
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
    validImeiList() {
      let newList = new Set(this.handleImeiList());
      if (Number(this.shipForm.quantity) !== newList.size) {
        this.$alert(`计划退货数量与实际上传数量不一致，请检查修改`, '提示', {
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
          addShipReturn(payload).then(res => {
            if (Number(res.code) === 30004) {
              this.isSuccessInfo = res;
              this.isSuccessInfoVisible = true;
            } else {
              this.$listeners.getInvoiceDetailsList && this.$listeners.getInvoiceDetailsList();
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
