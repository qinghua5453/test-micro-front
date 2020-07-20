<template>
  <!--iot日志-->
  <el-dialog class="dialog-cmd" title="调试指令" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="80%">
    <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon="true"
    ></el-alert>
    <el-form v-if="module" :rules="cmdRules" :model="addForm" ref="addForm">
      <el-form-item label="网关编号(IMEI)" prop="imei">
        <el-input :value="addForm.imei" readonly="" />
      </el-form-item>

      <el-form-item label="RRPC">
        <el-radio-group v-model="rrpc">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1" :disabled="!module.supportRRPC">是</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="rrpc == 0" label="topic" prop="topic">
        <el-input clearable v-model="addForm.topic" />
      </el-form-item>
      <el-form-item label="指令内容：" prop="data">
        <el-input clearable v-model="addForm.data" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="返回结果：">
        <p>{{ this.result || '无' }}</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click.native="editSubmit">发送</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '@/utils/Api';
import Qs from 'qs';

export default {
  name: 'component-device-cmd',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imei: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
        errorMsg: null,
        module: null,
        addForm: {
            imei: this.imei,
            topic: '',
            data: '{"Cmd":"###","Value":{}}',
        },
        rrpc: 0,
        result: null,
        cmdRules: {}
    };
  },
  created() {
    this.getDetail(this.imei);
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetail(imei) {
      this.$axios.get(Api.CLOUD_MODULE_DETAIL + imei).then(resp => {
        if (!resp) {
            this.errorMsg = '模块异常，无法获取模块数据'
            return;
        }

        if (resp.status != 1) {
            // 离线
            this.errorMsg = '模块状态异常，如离线/未激活/禁用等'
        }
        this.addForm.topic = '/' + resp.productKey + '/' + this.imei + '/' + 'Cmd'
        this.module = resp;
      });
    },
    editSubmit() {
        if (this.rrpc) {
            this.addForm.topic = null
        }
        this.$axios.post(Api.CLOUD_MODULE_CMD + '?' + Qs.stringify(this.addForm)).then(resp => {
            this.result = resp;
        })
    }
  }
};
</script>

<style lang="less" scoped>
.red {
  color: #f54949;
}
.green {
  color: #3ea93e;
}
.dialog-shop {
  /deep/ .el-dialog__body{
    overflow: hidden;
  }
}
</style>
