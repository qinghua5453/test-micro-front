<template>
  <el-dialog
    :title="isEdit ? '编辑存货' : '新增存货'"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="500px"
  >
    <el-form class="addTypeForm" :rules="rules" :model="addType" ref="setModuleTrafficForm" label-width="130px">
      <el-form-item label="存货分类：" v-if="isEdit">
        <el-input clearable v-model="curTypeName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="存货分类：" prop="paType" v-else>
        <el-cascader
        style="width:100%;"
        @change="changeGoodsCode"
        v-model="addType.paType"
        :props="defaultProps"
        :options="parentsData"
        filterable
        clearable></el-cascader>
      </el-form-item>
      <el-form-item label="存货编码：" prop="goodsCode">
        <el-input clearable v-model.trim="addType.goodsCode" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="存货名称：" prop="goodsName">
        <el-input clearable v-model.trim="addType.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="设备编码：" prop="deviceCode" v-if="assetType == 10">
        <el-input clearable v-model.trim="addType.deviceCode" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="供应商：" prop="companyId" v-if="assetType == 10">
        <el-select style="width:100%;" v-model="addType.companyId" placeholder="请选择供应商" :disabled="isEdit">
          <el-option v-for="(item, index) in companyList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ERP存货编码：" prop="erpCode">
        <el-input clearable v-model.trim="addType.erpCode"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：" prop="unit">
        <el-select style="width:100%;" v-model="addType.unit" placeholder="请选择计量单位" :disabled="isEdit">
          <el-option label="台" value="1"></el-option>
          <el-option label="桶" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="doSetingRate">确定</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import {
  addStockFun,
  editTypeFun,
  companyListFun,
  getStockCodeFun,
  addAssetFun,
  editAssetFun
} from "../stock";
import User from '@/utils/User';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    assetType: {
      default: 20
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    parentsData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    typeArrs: {
      type: Array,
      default: () => {
        return [];
      }
    },
    curparentData: {
      type: Array,
      default: () => {
        return [0,1,3];
      }
    },
  },
  data() {
    return {
      companyList: [],
      defaultProps: {
          children: 'childNodes',
          label: 'showCodeName',
          value: 'id',
      },
      curTypeName: "",
      addType: {
        paType: [],
        "companyId": "",
        "deviceCode": "",
        "erpCode": "",
        "goodsAttribute": "",
        "goodsCategoryId": "",
        "goodsCode": "",
        "goodsName": "",
        "unit": "",
        "userId": "",
        "id": "",
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入存货名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        paType: [
          { required: true, message: '请选择存货分类', trigger: 'change' }
        ],
        goodsCode: [
          { required: false, message: '请输入存货编码', trigger: 'change' }
        ],
        companyId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        deviceCode: [
          { required: true, message: '请输入设备编码', trigger: 'change' }
        ],
        erpCode: [
          { required: true, message: '请输入ERP存货编码', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '请选择计量单位', trigger: 'change' }
        ],
      }
    };
  },
  created() {
    this.getCompanyList();
    if (this.isEdit) {
      this.addType = Object.assign({}, this.editData);
      this.checkTypeName(this.addType.goodsCategoryId)
    }else{
      this.getGoodCode();
    }
  },
  methods: {
    async getCompanyList() {
      let par = {
        keywords: "",
        status: this.isEdit ? null : true,
        type: "10",
      }
      let res = await companyListFun(par);
      this.companyList = res;
    },
    async getGoodCode() {
      let par = {
      }
      let res = await getStockCodeFun(par);
      this.uniqueCode = res;
      this.checkGoodsCode();
    },
    getLastType(type) {
      let typeArrs = this.typeArrs;
      let checkedType = type;
      let checkedArrs = this.curparentData;
      let canAdd = false;
      // tree 铺平方法
      const setKeyFromTree = function(father){
        checkedType = father;
        if(canAdd) {
          checkedArrs.push(father.id);
        } else {
          canAdd = true;
        }
        
        if (father.childNodes && father.childNodes.length > 0) {
          setKeyFromTree(father.childNodes[0]);
        }
      }
      setKeyFromTree(type)

      this.addType.goodsCode = checkedType.showCode + this.uniqueCode;
      this.addType.paType = checkedArrs;
    },
    checkGoodsCode() {;
      if (this.curparentData && this.curparentData.length == 3) {
        this.addType.goodsCode = "";
        let checkType = this.curparentData[this.curparentData.length - 1];
        
        for (let j = 0; j < this.typeArrs.length; j++) {
          const ele = this.typeArrs[j];
          if (ele.id == checkType) {
            this.getLastType(ele);
          }
        }
      }
    },
    changeGoodsCode() {
      console.log(this.addType.paType);
      if (this.addType.paType && this.addType.paType.length == 3) {
        this.addType.goodsCode = "";
        let checkType = this.addType.paType[this.addType.paType.length - 1];
        
        for (let j = 0; j < this.typeArrs.length; j++) {
          const ele = this.typeArrs[j];
          if (ele.id == checkType) {
            console.log(ele);
            this.addType.goodsCode = ele.showCode + this.uniqueCode;
          }
        }
      }else {
        this.addType.paType = [];
        this.addType.goodsCode = "";
        this.$message.warning("请选择三级存货分类");
      }
    },
    checkTypeName(id) {
      for (let j = 0; j < this.typeArrs.length; j++) {
        const ele = this.typeArrs[j];
        if (ele.id == id) {
          this.curTypeName = ele.showCodeName;
        }
      }
    },
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    doSetingRate() {
      this.$refs.setModuleTrafficForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let par = {
              "erpCode": this.addType.erpCode,
              "goodsId": this.addType.id,
              "goodsName": this.addType.goodsName,
              "userId": User.getData("userId"),
            }
            editAssetFun(par).then(resp => {
              this.$message.success("操作成功");
              this.modalClose();
              this.$emit('childFn');
            });
          } else {
            let par = {
              "companyId": this.addType.companyId,
              "deviceCode": this.addType.deviceCode,
              "erpCode": this.addType.erpCode,
              "goodsAttribute": this.assetType,
              "goodsCategoryId": this.addType.paType[this.addType.paType.length-1],
              "goodsCode": this.addType.goodsCode,
              "goodsName": this.addType.goodsName,
              "unit": this.addType.unit,
              "userId": User.getData("userId")
            }
            if (this.assetType == 10) {
              addAssetFun(par).then(resp => {
                this.$message.success("操作成功");
                this.modalClose();
                this.$emit('childFn');
              });
            } else {
              addStockFun(par).then(resp => {
                this.$message.success("操作成功");
                this.modalClose();
                this.$emit('childFn');
              });
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
