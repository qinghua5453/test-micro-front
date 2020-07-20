<template>
  <el-dialog title="更换所在浴室" :visible="visible" :before-close="modalClose" :close="modalClose" width="600px">
      <el-form class="edit-machine demo-ruleForm" :model="editData" :rules="rules" label-width="100px" ref="ruleForm">
        <el-form-item label="浴室名称" prop="orgId">
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
  posListFun,
} from "../goods";

export default {
  props: ['goodsId', 'visible'],
  components: {
  },
  data() {
    return {
      erpNames: [],
      filterOptions: [],
      //编辑设备信息
      editData: {
        id: '',
        orgId: '',
      },
      rules: {
        // 编辑的表单验证
        orgId: [
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
    this.getAllErpData();
  },
  methods: {
    async getAllErpData() {
      let par = {
        positionName: "",
      }
      let res = await posListFun(par);
      this.erpNames = res.items;
      this.filterOptions = res.items;
    },
    async getErpData(word) {
      var par = {
        positionName: word
      }
      let res = await posListFun(par);
      this.filterOptions = res.items;
    },
    changeCompany() {
      if (!this.editData.shopName) {
         this.filterOptions = JSON.parse(JSON.stringify(this.erpNames));
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
          this.$emit("submitChange",this.editData.orgId)
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
