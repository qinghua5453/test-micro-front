<template>
  <el-dialog :title="title" :visible="visible" :before-close="modalClose" :close="modalClose" width="600px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
      <el-form-item label="类目名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入类目名称"></el-input>
      </el-form-item>
      <el-form-item label="一级类型" prop="categoryCode">
        <el-select v-model="ruleForm.categoryCode" style="width:100%;" placeholder="请选择一级类型" @change="changeCategory" :disabled="typeid ? true : false">
          <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级类型" prop="modelId">
        <el-select v-model="ruleForm.modelId" style="width:100%;" placeholder="请选择二级类型" :disabled="typeid ? true : false">
          <el-option v-for="(item, index) in modelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="NQT" prop="needNqt">
        <el-radio-group v-model="ruleForm.needNqt" :disabled="typeid ? true : false">
          <el-radio :label="1">需要</el-radio>
          <el-radio :label="0">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="icon" class="form-item-m add-img" prop="icon">
        <q-upload v-model="ruleForm.icon" />
      </el-form-item>
      <el-form-item label="使用说明" prop="instructions">
        <el-input type="textarea" v-model="ruleForm.instructions" placeholder="请输入使用说明"></el-input>
      </el-form-item>
      <el-form-item label="示例图片" class="form-item-m add-img" prop="examples">
        <q-upload v-model="ruleForm.examples" />
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
  editGoodsTypeFun,
  addGoodsTypeFun,
  getModelFun,
  getCategoryFun,
  getTypeDetailFun,
} from "../goods";
import QUpload from "@/components/Upload";

export default {
  props: ['typeid', 'visible'],
  components: {
    QUpload
  },
  data() {
    return {
      title: '新增类目',
      ruleForm: {
        categoryCode: '',
        modelId: '',
        needNqt: '',
        name: '',
        instructions: '',
        examples: '',
        icon: '',
        id: '',
      },
      categoryOptions: [],
      modelOptions: [],
      rules: {
        categoryCode: [{ required: true, message: '请选择一级分类', trigger: 'change' }],
        modelId: [{ required: true, message: '请选择二级分类', trigger: 'change' }],
        needNqt: [{ required: true, message: '请选择是否需要NQT', trigger: 'change' }],
        examples: [{ required: true, message: '请选择示例图片', trigger: 'change' }],
        icon: [
          { required: true, message: '请选择icon', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入类目名称', trigger: 'change' }],
        instructions: [{ required: true, message: '请输入使用说明', trigger: 'change' }],
      }
    };
  },
  created() {
    this.getCategory();
    if (this.typeid) {
      this.title = '编辑类目';
      this.getDetali();
    }
  },
  methods: {
    async getCategory() {
      let par = {
      }
      let res = await getCategoryFun(par);
      this.categoryOptions = res;
    },
    async getModel(code) {
      var par = {
        categoryCode: code
      }
      let res = await getModelFun(par);
      this.modelOptions = res;
    },
    changeCategory(index) {
      this.ruleForm.modelId = "";
      if (this.ruleForm.categoryCode) {
        this.getModel(this.ruleForm.categoryCode);
      }
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetali() {
      getTypeDetailFun({ id: this.typeid }).then(res => {
        this.ruleForm = this.getPorpery(this.ruleForm, res);
        this.ruleForm.id = res.id;
        this.getModel(this.ruleForm.categoryCode);
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
          if(this.typeid) {
            editGoodsTypeFun(payload).then(res => {
              this.$message.success('编辑成功！');
              this.modalClose();
              this.$emit("submitSearch");
            });
          }else {
            addGoodsTypeFun(payload).then(res => {
              this.$message.success('新增成功！');
              this.modalClose();
              this.$emit("submitSearch");
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
