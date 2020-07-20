<template>
  <div>
    <el-dialog title="资产报废" :visible="visible" :before-close="modalClose" :close="modalClose" :close-on-click-modal="false" width="680px" top="10vh">
      <el-form :model="shipForm" :rules="shipFormRules" ref="shipForm" label-width="130px" label-position="right" class="demo-shipForm">
        <el-form-item label="钉钉审批编号：" prop="dingdingNo">
          <!-- <el-select size="small" v-model="shipForm.dingtalkProcessId" placeholder="不限">
            <el-option label="资产损坏" :value="0"></el-option>
            <el-option label="资产丢失" :value="1"></el-option>
            <el-option label="资产更新换代" :value="2"></el-option>
          </el-select> -->
          <el-input placeholder="请输入钉钉审批编号" v-model.trim="shipForm.dingdingNo" @blur="blurDingDingNo"></el-input>
        </el-form-item>
        <el-form-item label="报废原因：" prop="scrapReason">
          <el-input placeholder="请输入报废原因" v-model="shipForm.scrapReason" :disabled="true"></el-input>
          <!-- <el-select size="small" v-model="shipForm.brandTypeId" placeholder="不限">
            <el-option label="资产损坏" :value="0"></el-option>
            <el-option label="资产丢失" :value="1"></el-option>
            <el-option label="资产更新换代" :value="2"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="shipForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('shipForm')">确定</el-button>
          <el-button @click="modalClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { businessType } from '@/utils/Mapping';
import {
  scrapFun,
  scrapReasonsFun,
  assetReasonsApi
} from "../asset";
import User from '@/utils/User';
export default {
  props: ['assetId', 'visible'],
  data() {
    return {
      shipForm: {
        "assetId": "",
        "dingdingNo": "",
        "remark": "",
        "scrapReason": "",
        "userId": ""
      },
      shipFormRules: {
        dingdingNo: [{ required: true, message: '请选择钉钉审批编号', trigger: 'change' }],
        scrapReason: [{ required: true, message: '请选择报废原因', trigger: 'change' }],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'change' }
        ],
      },
    };
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    blurDingDingNo() {
      this.shipForm.scrapReason = "";
      if (this.shipForm.dingdingNo) {
        let url = assetReasonsApi + this.shipForm.dingdingNo;
        let payload = {
          dingdingNo: this.shipForm.dingdingNo
        }
        scrapReasonsFun(url,payload).then(res => {
          this.shipForm.scrapReason = res.scrapReasons;
        });
      }
      
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = Object.assign({}, this.shipForm);
          payload.assetId = this.assetId;
          payload.userId = User.getData("userId");
          scrapFun(payload).then(res => {
            // this.$listeners.getAssetList && this.$listeners.getAssetList();
            this.$message.success('操作成功！');
            this.modalClose();
            this.$emit("submitSearch");
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
