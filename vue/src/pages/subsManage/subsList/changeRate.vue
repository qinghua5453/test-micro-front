<template>
  <el-dialog title="分账配置" :visible="visible" :before-close="modalClose" :close="modalClose" width="600px">
      <el-form class="edit-machine demo-ruleForm" :model="editData" :rules="rules" label-width="120px" ref="ruleForm">
        <el-form-item label="分账帐号" v-if="account">
          {{account}}
        </el-form-item>
        <el-form-item label="商户分账比例" prop="proportion">
          <el-row :gutter="6">
            <el-col :span="21"><el-input v-model.trim="editData.proportion" size="small"></el-input></el-col>
            <el-col :span="2">%</el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="submitForm('ruleForm')">确定</el-button>
        <el-button @click.native="modalClose">取消</el-button>
      </div>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';

export default {
  props: ['account', 'visible', 'rateNum'],
  components: {
  },
  data() {
    // 验证洗衣液价格
    var checkRate = (rule, value, callback) => {
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (value && !reg.test(value)) {
        return callback(new Error('请输入数字,最多允许两位小数'));
      } else if (value < 0) {
        return callback(new Error('请输入大于或者等于0的数字'));
      } else if (value > 100) {
        return callback(new Error('最大100'));
      } else {
        callback();
      }
    };
    return {
      erpNames: [],
      filterOptions: [],
      //编辑设备信息
      editData: {
        proportion: null,
      },
      rules: {
        // 编辑的表单验证
        proportion: [{ required: true, message: '请填写分账配置', trigger: 'change' }, { validator: checkRate, trigger: 'change' }],
      }
    };
  },
  created() {
    if (this.rateNum) {
      this.editData.proportion = Number(this.rateNum);
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.editData);
          this.$emit("submitChange",this.editData.proportion);
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
