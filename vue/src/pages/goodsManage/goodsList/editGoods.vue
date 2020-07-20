<template>
  <el-dialog title="编辑商品" :visible="visible" :before-close="modalClose" :close="modalClose">
      <el-form class="edit-machine demo-ruleForm" :model="editData" :rules="rules" label-width="140px" ref="ruleForm">
        <el-form-item label="浴位编号：" class="form-item-m" prop="deviceName">
          <el-input v-model="editData.deviceName" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="NQT：" class="form-item-m" prop="nqt" v-if="showNqt">
          <el-input v-model="editData.nqt" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="设备编号：" class="form-item-m" prop="sn">
          <el-input v-model="editData.sn" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="单脉冲流量(ml)：" class="form-item-m" prop="liquidPrePulse">
          <el-input v-model="editData.liquidPrePulse" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="单价(元/L)：" class="form-item-m" prop="price">
          <el-input v-model="editData.price" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import {
  editGoodsFun,
  getGoodsDetailFun,
  getTypeDetailFun
} from "../goods";

export default {
  props: ['goodsId', 'visible'],
  components: {
  },
  data() {
    // 验证洗衣液价格
    var checkdetergentPrice = (rule, value, callback) => {
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,10})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (value && !reg.test(value)) {
        return callback(new Error('请输入数字,最多允许十位小数'));
      } else if (value > 99) {
        return callback(new Error('最大99'));
      }  else if (value < 0) {
        return callback(new Error('价格不能小于0'));
      }  else {
        callback();
      }
    };
    // 验证洗衣液价格
    var checkdetergentLiquid = (rule, value, callback) => {
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,3})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (value && !reg.test(value)) {
        return callback(new Error('请输入数字,最多允许三位小数'));
      } else if (value <= 0) {
        return callback(new Error('请输入大于0的数字'));
      } else if (value > 9999) {
        return callback(new Error('最大9999'));
      } else {
        callback();
      }
    };
    return {
      showNqt: false,
      //编辑设备信息
      editData: {
        goodsId: '',
        deviceName: '',
        liquidPrePulse: '',
        nqt: '',
        price: '',
        sn: '',
      },
      rules: {
        // 编辑的表单验证
        deviceName: [{ required: true, message: '请输入浴位编号', trigger: 'change' },
        { min: 4, max: 4, message: '请输入四位数字编号,例如:0001,0002', trigger: 'change' },
        {
          pattern:/[0-9]{4}$/,
          message: "请输入四位数字编号,例如:0001,0002",
          trigger: "change"
        }],
        goodsId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        sn: [
          {
            required: true,
            message: '请填写设备编号',
            trigger: 'blur'
          }
        ],
        nqt: [
          {
            required: true,
            message: '请填写NQT',
            trigger: 'blur'
          }
        ],
        price: [{ required: true, message: '请填写价格', trigger: 'change' }, { validator: checkdetergentPrice, trigger: 'change' }],
        liquidPrePulse: [{ required: true, message: '请填写单脉冲流量', trigger: 'change' },{ validator: checkdetergentLiquid, trigger: 'change' }]
      }
    };
  },
  created() {
    if (this.goodsId) {
      this.getDetali();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetali() {
      getGoodsDetailFun({ id: this.goodsId }).then(res => {
        this.editData.deviceName = res.name;
        this.editData.goodsId = res.goodsId;
        this.editData.nqt = res.nqt;
        this.editData.price = res.extAttr && res.extAttr.yuan_per_liter;
        this.editData.sn = res.sn;
        this.editData.liquidPrePulse = res.extAttr && res.extAttr.milli_liter_per_pulse;
        this.checkShowNqt(res.categoryId);
      });
    },
    checkShowNqt(categoryId) {
      getTypeDetailFun({ id: categoryId }).then(res => {
        this.showNqt = res.needNqt == 1;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.editData);
          editGoodsFun(payload).then(res => {
            this.$message.success('编辑成功！');
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
</style>
