<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="560px">
    <div class="bd-con">
      <el-form :model="nqtForm" :rules="nqtFormRules" ref="nqtForm" label-position="right" label-width="110px">
        <el-form-item label="数量:" prop="quantity">
          <el-input v-model="nqtForm.quantity" placeholder="请输入数量" :disabled="editdisabled" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="尺寸:" prop="size">
          <el-select v-model="nqtForm.size" placeholder="请选择活动尺寸" style="width:300px">
            <el-option value="3*2" label="9.0cm*9.0cm"></el-option>
            <el-option value="4*3" label="5.7cm*5.7cm"></el-option>
            <el-option value="5*4" label="4.7cm*4.7cm"></el-option>
            <el-option value="6*4" label="4.1cm*4.1cm"></el-option>
            <el-option value="7*5" label="3.5cm*3.5cm"></el-option>
            <el-option value="9*6" label="2.8cm*2.8cm"></el-option>
            <el-option value="10*8" label="2.0cm*2.0cm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="含logo：" prop="withLogo">
          <el-radio-group v-model="nqtForm.withLogo">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click="generateNqt('nqtForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import { log } from 'util';
import {
  addCodesFun,
} from "./qrcode";
export default {
  props: ['visible','qrcodId','editFrom'],
  data() {
    let checkCount = (rule, value, callback) => {
      let reg = /^[0-9]*$/;
      if (!value) {
        return callback(new Error("请输入数量"));
      } else if (value < 1 || value > 10000 || !reg.test(value)) {
        return callback(new Error("数量请输入1-10000之间的整数!"));
      } else {
        callback();
      }
    };
    return {
      title: "生成二维码",
      nqtForm: {
        withLogo: 0,
        quantity: "",
        size: "3*2",
      },
      nqtFormRules: {
        quantity: [{ required: true, validator: checkCount, trigger: "blur" }],
        size: [
          { required: true, message: "请选择二维码尺寸", trigger: "change" }
        ],
        withLogo: [
          { required: true, message: "请选择是否含有logo", trigger: "change" }
        ]
      },
      editdisabled: false,
    };
  },
  filters: {},
  created () {
    if(this.qrcodId){
      this.nqtForm = Object.assign({ withLogo: 0 }, this.editFrom);
      this.editdisabled = true;
    };
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    generateNqt(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.nqtForm);
          
          let temp = payload.size.split("*");
          payload.columnCount = temp[0];
          payload.rowCount = temp[1];
          delete payload.size;

          addCodesFun(payload).then(resp => {
            this.$message.success('二维码已生成!');
            this.modalClose();
            this.$emit("getQrcodeList");
          });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped></style>