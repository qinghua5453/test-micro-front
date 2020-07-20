<template>
  <el-dialog title="下载链接" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="640px">
    <div class="bd-con">
      <el-form label-width="96px" :model="downloadForm" :rules="downloadFormRules" ref="downloadFormForm" class="examine-visible">
        <el-form-item label="文件名" prop="doc">
          <el-input class="el-input" v-model="downloadForm.doc" clearable auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click.native="confirmDownload('downloadFormForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import { exportExcel } from "@/utils/tool";
import {
  excelCodesApi,
} from "./qrcode";
export default {
  props: ['visible','qrcodId'],
  data() {
    return {
       downloadForm: {},
      downloadFormRules: {
        doc: [{ required: true, message: '请输入文件名', trigger: 'blur' }]
      },
    };
  },
  filters: {

  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    confirmDownload(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { id: this.qrcodId || '' };
          exportExcel(excelCodesApi, `${this.downloadForm.doc}.xlsx`, params);
          this.modalClose();
        }
      });
    },
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
