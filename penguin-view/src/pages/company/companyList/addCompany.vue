<template>
  <el-dialog :title="title" :visible="visible" :before-close="modalClose" :close="modalClose" width="600px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
      <el-form-item label="供应商编码" prop="code">
        <el-input v-model="ruleForm.code" placeholder="请输入供应商编码"></el-input>
      </el-form-item>
      <el-form-item label="供应商名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入供应商名称" :disabled="companyid"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="ruleForm.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align:center;">
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="modalClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import {
  companyEditFun,
  companyAddFun,
  companyDetailFun,
} from "../company";
import { addvertiseSoltStatus, addvertiseLinkType,slotExhibitionType} from '@/utils/Mapping';
export default {
  props: ['companyid', 'visible'],
  data() {
    return {
      title: '新增供应商',
      ruleForm: {
        code: '',
        contact: '',
        tel: '',
        name: '',
        address: '',
        type: 10,
      },
      rules: {
        code: [{ required: true, message: '请输入供应商编码', trigger: 'change' },
        { min: 2, max: 2, message: '请输入两位数字编码,例如:01,02', trigger: 'change' },
          {
            pattern:/[0-9]{2}$/,
            message: "请输入两位数字编码,例如:01,02",
            trigger: "change"
          }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'change' }],
        tel: [
          { required: true, message: '请输入联系电话', trigger: 'change' }, 
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[357894]\d{9}))$|(^[48]00\d+$)/, message: '请输入正确的联系电话' }
        ],
        name: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
      }
    };
  },
  computed: {
    addvertiseLinkType() {
      return addvertiseLinkType;
    },
    addvertiseSoltStatus() {
      return addvertiseSoltStatus;
    },
    slotExhibitionType() {
      return slotExhibitionType;
    }
  },
  created() {
    if (this.companyid) {
      this.title = '编辑供应商';
      this.getDetali();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetali() {
      companyDetailFun({ id: this.companyid }).then(res => {
        this.ruleForm = this.getPorpery(this.ruleForm, res);
        this.ruleForm.id = res.id;
      });
    },
    getPorpery(obj2, obj1) {
      let a = {};
      Object.keys(obj2).map(function(key) {
        a[key] = obj2[key] = obj1[key];
      });
      return a;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.ruleForm);
          // payload = {
          //   json:JSON.stringify(payload)
          // }
          this.$emit("submitSearch");
          if(this.companyid) {
            companyEditFun(payload).then(res => {
              this.$message.success('新增成功！');
              this.modalClose();
              this.$emit("submitSearch");
              this.$listeners.getAdvertiseSlotList && this.$listeners.getAdvertiseSlotList();
            });
          }else {
            companyAddFun(payload).then(res => {
              this.$message.success('编辑成功！');
              this.modalClose();
              this.$emit("submitSearch");
              this.$listeners.getAdvertiseSlotList && this.$listeners.getAdvertiseSlotList();
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.demo-ruleForm {
  padding-top: 20px;
}
</style>
