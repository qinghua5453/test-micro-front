<template>
  <el-dialog
    title="生成激活码"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="540px"
  >
    <div class="bd-con">
      <el-form
        :model="codeForm"
        :rules="codeFormRules"
        ref="codeForm"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="数量:" prop="count">
          <el-input v-model.number="codeForm.count" placeholder="请输入数量"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click="handleCode('codeForm')">提交</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QUpload from "@/components/Upload";
import { generateCodeFun } from "../detergent";

export default {
  components: {
    QUpload
  },
  props: ["visible", "brandId"],
  data() {
    return {
      codeForm: {
        count: ""
      },
      codeFormRules: {
        count: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            type: "number",
            min: 0,
            max: 10000,
            message: "请输入1-10000之间的整数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  filters: {},
  created() {},
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    handleCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({ brandId: this.brandId }, this.codeForm);
          generateCodeFun(payload).then(res => {
            if(this.codeForm.count>0){
              let disposition = res.headers['content-disposition']
                ? String(res.headers['content-disposition'])
                : '';
              let name = null;
              if (disposition) {
                let header = disposition.indexOf('=');
                name =
                  header !== -1
                    ? decodeURIComponent(disposition.substring(header).replace('=', ''))
                    : fileName;
              } else {
                name = fileName;
              }
              let blob = (blob = new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  }));
                  if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, name);
                  } else {
                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = name;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                  }
            }
            this.$listeners.getDetergentList &&
            this.$listeners.getDetergentList();
            this.$message.success("操作成功！");
            this.modalClose();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
