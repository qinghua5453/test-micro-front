<template>
  <div>
    <el-dialog class="addActivity-dialog" title="活动发放" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="640px">
      <el-form :model="addEvent" label-width="94px" :rules="addEventRules" ref="couponGrant">
        <el-form-item label="发放用户：" class="form-item-m" prop="userType">
          <el-radio-group v-model="addEvent.userType" @change="changeUserType">
            <el-radio :label="0">批量导入</el-radio>
            <el-radio :label="1">单个输入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-item-m" v-if="addEvent.userType == 0">
          <input type="file" @change="tirggerFile($event)" />
          <a href="https://static.qiekj.com/images/template/user.xlsx">
            <el-button type="primary">下载模板</el-button>
          </a>
        </el-form-item>
        <el-form-item class="form-item-m" prop="phone" ref="phoneRef" v-if="addEvent.userType == 1">
          <el-input clearable v-model="addEvent.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleAdd('couponGrant')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/utils/Api';

export default {
  props: ['promotionId', 'visible'],
  data() {
    return {
      // 新增活动
      addEvent: {
        userType: null,
        file: null,
        phone: ''
      },
      addEventRules: {
        userType: [{ required: true, message: '请选择发放用户', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ]
      },
      isShowoneFile: false
    };
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    changeUserType(val) {
      this.$refs.couponGrant.clearValidate(['phone']);
      if (val === 0) {
        this.addEvent.phone = '';
      }
    },
    // 导入excel文件
    tirggerFile(event) {
      var file = event.target.files;
      this.addEvent.file = file[0];
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          // 批量文件上传
          if (this.addEvent.userType === 0) {
            if (!this.addEvent.file) {
              this.$message.error('文件不能为空，请重新上传');
            } else {
              formData.append('file', this.addEvent.file);
            }
          }
          formData.append('promotionId', this.promotionId);
          formData.append('phone', this.addEvent.phone);
          this.$axios.post(Api.NEW_COUPON_SEND, formData).then(_ => {
            this.modalClose();
            this.$message.success('发放成功！');
            this.$listeners.getEventList && this.$listeners.getEventList();
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.condition {
  display: flex;
  /deep/ .el-input {
    width: 80%;
    padding: 0 10px;
  }
}
</style>
