<template>
  <el-dialog title="更换所在店铺" :visible="visible" :before-close="modalClose" :close="modalClose" width="600px">
      <el-form class="edit-machine demo-ruleForm" :model="editData" :rules="rules" label-width="100px" ref="ruleForm">
        <el-form-item label="店铺名称" prop="orgId">
          <el-select
              size="small"
              v-model="editData.orgId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键字搜索"
              @change="changeCompany"
              :remote-method="remoteMethod"
              style="width:100%;"
              >
              <el-option
                v-for="(item,index) in filterOptions"
                :key="index"
                :label="item.name"
                :value="item.orgId">
              </el-option>
            </el-select>
          <!-- <el-input clearable v-model.trim="searchData.goodsName" size="small"></el-input> -->
        </el-form-item>
        <el-form-item label="浴室名称" prop="positionId">
          <el-select
              size="small"
              v-model="editData.positionId"
              placeholder="请选择浴室"
              style="width:100%;"
              :disabled="!editData.orgId"
              >
              <el-option
                v-for="(item,index) in positionOptions"
                :key="index"
                :label="item.positionName"
                :value="item.positionId">
              </el-option>
            </el-select>
          <!-- <el-input clearable v-model.trim="searchData.goodsName" size="small"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="submitForm('ruleForm')">确认</el-button>
        <el-button @click.native="modalClose">取消</el-button>
      </div>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import {
  shopsListFun,
  posListFun
} from "../goods";

export default {
  props: ['visible','orgName','orgId'],
  components: {
  },
  data() {
    return {
      positionOptions: [],
      erpNames: [],
      filterOptions: [],
      //编辑设备信息
      editData: {
        orgId: '',
        positionId: '',
      },
      rules: {
        // 编辑的表单验证
        orgId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        positionId: [
          {
            required: true,
            message: '请选择浴室',
            trigger: 'blur'
          }
        ],
      }
    };
  },
  created() {
    if (this.orgId) {
      this.getAllShopData();
      this.editData.orgId = this.orgId;
      this.getErpData(this.orgName);
      this.getPositionData();
    } else {
      this.getAllErpData();
    }
  },
  methods: {
    async getPositionData() {
      let par = {
        orgId: this.editData.orgId,
        positionName: "",
      }
      let res = await posListFun(par);
      this.positionOptions = res.items;
    },
    async getAllErpData() {
      let par = {
        name: "",
      }
      let res = await shopsListFun(par);
      this.erpNames = res;
      this.filterOptions = res;
    },
    async getAllShopData() {
      let par = {
        name: "",
      }
      let res = await shopsListFun(par);
      this.erpNames = res;
    },
    async getErpData(word) {
      var par = {
        name: word
      }
      let res = await shopsListFun(par);
      this.filterOptions = res;
    },
    changeCompany() {
      if (!this.editData.orgId) {
        this.filterOptions = JSON.parse(JSON.stringify(this.erpNames));
      }else {
        this.getPositionData();
      }
    },
    remoteMethod(query) {
      if (query) {
        this.getErpData(query);
      } else {
        this.filterOptions = JSON.parse(JSON.stringify(this.erpNames));
      }
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.editData);
          this.$emit("submitChange",payload)
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
