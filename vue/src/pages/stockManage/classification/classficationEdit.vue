<template>
  <el-dialog
    :title="isEdit ? '编辑存货分类' : '新增存货分类'"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="500px"
  >
    <el-form class="addTypeForm" :rules="rules" :model="addType" ref="setModuleTrafficForm" label-width="100px">
      <el-form-item label="上级分类：" prop="paType">
        <el-cascader
        ref="refHandle"
        style="width:100%;"
        v-model="addType.paType"
        :disabled="isEdit"
        :props="defaultProps"
        :options="parentsData"
        @change="changeType"
        clearable></el-cascader>
      </el-form-item>
      <el-form-item label="分类编码：" prop="goodsCategoryCode">
        <el-input clearable ref="coderef" v-model.trim="addType.goodsCategoryCode" :disabled="isEdit" placeholder="请输入两位数字编号"></el-input>
      </el-form-item>
      <el-form-item label="分类名称：" prop="goodsCategoryName">
        <el-input clearable v-model.trim="addType.goodsCategoryName" placeholder="请输入分类名称"></el-input>
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
  addTypeFun,
  editTypeFun,
} from "../stock";
import User from '@/utils/User';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
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
    curparentData: {
      type: Array,
      default: () => {
        return [0,1,3];
      }
    },
  },
  data() {
    return {
      defaultProps: {
          children: 'childNodes',
          label: 'showCodeName',
          value: 'id',
          checkStrictly: true 
      },
      addType: {
        paType: [0],
        "goodsCategoryCode": "",
        "goodsCategoryName": "",
        "id": "",
        "parentId": 0,
        "userId": ""
      },
      rules: {
        goodsCategoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        paType: [
          { required: true, message: '请选择上级分类', trigger: 'change' }
        ],
        goodsCategoryCode: [
          { required: true, message: '请输入分类编码', trigger: 'change' },
          { min: 2, max: 2, message: '请输入两位数字编号', trigger: 'blur' },
          {
            pattern:/[0-9]{2}$/,
            message: "请输入两位数字编号",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.addType = Object.assign({}, this.editData);
    }
    this.addType.paType = this.curparentData;
  },
  methods: {
    changeType() {
      if (this.$refs.refHandle) {
        this.$refs.refHandle.dropDownVisible = false; //监听值发生变化就关闭它
      }
    },
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    doSetingRate() {
      this.$refs.setModuleTrafficForm.validate((valid) => {
        if (valid) { 
          let par = {
            "goodsCategoryCode": this.addType.goodsCategoryCode,
            "goodsCategoryName": this.addType.goodsCategoryName,
            "id": null,
            "parentId": this.addType.paType[this.addType.paType.length-1],
            "userId": User.getData("userId")
          }
          if (this.isEdit) {
            par.id = this.addType.id;
            editTypeFun(par).then(resp => {
              this.$message.success("操作成功");
              this.modalClose();
              this.$emit('childFn',par.parentId);
            });
          } else {
            addTypeFun(par).then(resp => {
              this.$message.success("操作成功");
              this.modalClose();
              this.$emit('childFn',par.parentId);
            });
          }
        }
      });
      
      
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
