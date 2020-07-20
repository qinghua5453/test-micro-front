<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="640px" top="50px">
    <div class="bd-con">
      <el-form :model="nqtForm" :rules="nqtFormRules" ref="nqtForm" label-position="right" label-width="110px">
        <el-form-item label="公司：" prop="company">
          <el-radio-group v-model="nqtForm.company" :disabled="editdisabled">
            <el-radio label="youfang">有方</el-radio>
            <el-radio label="qiekj">企鹅</el-radio>
            <el-radio label="hezhou">合宙</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通信类型：" prop="type">
          <el-radio-group v-model="nqtForm.type" :disabled="editdisabled">
            <el-radio :label="0">脉冲</el-radio>
            <el-radio :label="1">串口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="刷脸屏：" prop="bfs">
          <el-radio-group v-model="nqtForm.bfs" :disabled="editdisabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="VER：" prop="ver">
          <el-radio-group v-model="nqtForm.ver" :disabled="editdisabled">
            <el-radio :label="3">2G</el-radio>
            <el-radio :label="4">4G</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量:" prop="count">
          <el-input v-model="nqtForm.count" placeholder="请输入数量" @input="changeGenerate" :disabled="editdisabled" style="width:300px"></el-input>
        </el-form-item>
        <div v-if="isShowGenerate">
          <el-form-item label="生成二维码：" prop="generate">
            <el-radio-group v-model="nqtForm.generate" @change="changeQrcode" :disabled="editdisabled">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="isShowqrcode">
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
            <el-form-item label="含logo：" prop="isLogo">
              <el-radio-group v-model="nqtForm.isLogo">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
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
        company: "youfang",
        type: 0,
        ver: 3,
        generate: 0,
        isLogo: 0,
        count: "",
        bfs: 0
      },
      nqtFormRules: {
        company: [{ required: true, message: "请选择公司", trigger: "change" }],
        type: [
          { required: true, message: "请选择通信类型", trigger: "change" }
        ],
        ver: [{ required: true, message: "请选择VER", trigger: "change" }],
        count: [{ required: true, validator: checkCount, trigger: "blur" }],
        generate: [
          { required: true, message: "请选择是否生成二维码", trigger: "change" }
        ],
        bfs: [
          { required: true, message: "请选择是否刷脸屏", trigger: "change" }
        ],
        size: [
          { required: true, message: "请选择二维码尺寸", trigger: "change" }
        ],
        isLogo: [
          { required: true, message: "请选择是否含有logo", trigger: "change" }
        ]
      },
      editdisabled: false,
      isShowGenerate: true,
      isShowqrcode: true
    };
  },
  filters: {},
  created () {
    if(this.qrcodId){
      this.nqtForm = Object.assign({ generate: 0, isLogo: 0 }, this.editFrom);
      this.nqtForm.ver = this.editFrom.ver === 4 ? 4 : 3;
      this.editdisabled = true;
      this.isShowqrcode = true;
      this.isShowGenerate = true;
    };
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    changeGenerate(value) {
      Number(value) > 300
        ? (this.isShowGenerate = false)
        : (this.isShowGenerate = true);
    },
    changeQrcode(value) {
      Number(value) === 0
        ? (this.isShowqrcode = true)
        : (this.isShowqrcode = false);
    },
    generateNqt(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.nqtForm);
          if (payload.count <= 300) {
            if (payload.generate === 0) {
              let temp = payload.size.split("*");
              payload.column = temp[0];
              payload.row = temp[1];
            }
            delete payload.size;
          }
          let url = this.qrcodId ? Api.QRCODE_GENERATE : Api.ADD_NQT;
          this.$axios
            .post(url, payload, {
              responseType: "arraybuffer", //文件类型
              timeout: 60000 //请求超时
            })
            .then(res => {
              this.modalClose();
              this.$listeners.getQrcodeList && this.$listeners.getQrcodeList();
              if (payload.count <= 300) {
                if (payload.generate === 0) {
                  let blob = (blob = new Blob([res.data], {
                    type: "application/octet-stream"
                  }));
                  if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, "二维码压缩包.zip");
                  } else {
                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "二维码压缩包.zip";
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                  }
                }
              }
            })
            .catch(error => {});
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped></style>