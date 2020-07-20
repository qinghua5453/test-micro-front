<template>
  <el-dialog title="立即结算" :visible="visible" :before-close="modalClose" :close="modalClose" width="760px">
      <ul class="item-ul">
        <li class="item-li">
          <div class="left-label" title="单据日期">
            账单编号: 
          </div>
          <div class="right-content">
            {{billsData.billNo}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            运营商帐号: 
          </div>
          <div class="right-content">
            {{billsData.operatorUsername}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            洗衣液订单金额(元): 
          </div>
          <div class="right-content">
            {{billsData.orderAmount}}
          </div>
        </li>
        <li class="item-li">
          <div class="left-label">
            订单金额: 
          </div>
          <div class="right-content">
            {{billsData.billAmount}}
          </div>
        </li>
      </ul>
      <el-form class="edit-machine demo-ruleForm" :model="editData" :rules="rules" label-width="140px" ref="ruleForm">
        <el-form-item label="备注：" class="form-item-m" prop="desc">
          <el-input type="textarea" ref="bigtextArea" :rows="10" v-model="editData.desc" class="input-w"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button @click.native="modalClose">取消</el-button>
        <el-button type="primary" @click.native="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import {
  dellBillsFun
} from "../bills";

export default {
  props: ['billsId', 'visible','billsData'],
  components: {
  },
  data() {
    return {
      //编辑设备信息
      editData: {
        billNo: '',
        desc: '',
      },
      rules: {
        // 编辑的表单验证
        desc: [{ required: true, message: '请输入备注', trigger: 'change' },
        { min: 1, max: 200, message: '请输入1-200个字符', trigger: 'change' },
        ],
      }
    };
  },
  created() {
    // this.$nextTick(()=>{
    //     this.$refs.bigtextArea.focus();
    //   })
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.editData);
          payload.billNo = this.billsId;
          dellBillsFun(payload).then(res => {
            this.$message.success('结算成功！');
            this.modalClose();
            this.$emit("submitSearch");
          });
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
.item-ul {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
  .item-li  {
    width: 50%;
    display: flex;
    flex-wrap: nowrap;
    padding: 16px 0;
    font-size: 16px;
    box-sizing: border-box;
    .left-label {
      text-align: right;
      color: #606266;
      padding-right: 20px;
      width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .right-content {
      width: 50%;
      color: #909399;
      border-bottom: 1px solid #909399;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
    }
  }
}
</style>
