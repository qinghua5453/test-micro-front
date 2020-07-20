<template>
  <div class="app-version-page">
    <el-form :model="appVersionForm" :rules="appVersionFormRules" ref="appVersionForm" label-width="100px" class="app-version-Form">
      <el-form-item label="app类型" prop="type">
        <el-select v-model="appVersionForm.type" placeholder="请选择app类型">
          <el-option label="运维" value="1"></el-option>
          <el-option label="商家" value="2"></el-option>
          <el-option label="用户" value="3"></el-option>
          <el-option label="企鹅刷脸APP" value="4"></el-option>
          <el-option label="支付宝刷脸APK" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统" prop="appType">
        <el-select v-model="appVersionForm.appType" placeholder="请选择系统">
          <el-option label="ios" value="1"></el-option>
          <el-option label="android" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input v-model.trim="appVersionForm.name"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="versionCode">
        <el-input v-model.trim="appVersionForm.versionCode"></el-input>
      </el-form-item>
      <el-form-item label="版本名称" prop="versionName">
        <el-input v-model.trim="appVersionForm.versionName"></el-input>
      </el-form-item>
      <el-form-item label="最低版本号" prop="versionMin">
        <el-input v-model.trim="appVersionForm.versionMin"></el-input>
      </el-form-item>
      <el-form-item label="下载地址" prop="updateUrl">
        <el-input v-model.trim="appVersionForm.updateUrl"></el-input>
      </el-form-item>
      <el-form-item label="更新日志" prop="updateLog">
        <el-input type="textarea" v-model="appVersionForm.updateLog"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('appVersionForm')">立即创建</el-button>
        <el-button @click="resetForm('appVersionForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
export default {
  data() {
    return {
      appVersionForm: {
        type: '',
        appType: '',
        name: '',
        versionCode: '',
        versionName: '',
        versionMin: '',
        updateUrl: '',
        updateLog: ''
      },
      appVersionFormRules: {
        type: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        appType: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        versionCode: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        versionName: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        versionMin: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        updateUrl: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        updateLog: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      }
    };
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.appVersionForm);
          this.$axios.post(Api.UPDATE_APP, payload).then(_ => {
            this.$message.success('创建成功！');
            this.$refs[formName].resetFields();
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.app-version-page {
  background: #fff;
}
.app-version-Form {
  padding: 20px 20px;
  width: 400px;
}
</style>
