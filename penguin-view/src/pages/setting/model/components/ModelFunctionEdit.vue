<template>
  <!-- 新增型号功能dialog -->
  <el-dialog title="新增/修改型号功能" width="80%" :visible.sync="openDialog" @close="openDialog = false">
    <el-form :rules="modelFunctionRules" :model="addForm" ref="addForm">
      <el-form-item label="绑定老功能：" prop="code">
        <el-select v-model="addForm.code" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in oldFunctionList" :key="item.id" :label="item.functionName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能编号（4位HEX，Cmd后四位）：" prop="functionCode">
        <el-input clearable v-model="addForm.functionCode" auto-complete="off" />
      </el-form-item>
      <el-form-item label="功能名称：" prop="functionName">
        <el-input clearable v-model="addForm.functionName" auto-complete="off" />
      </el-form-item>
      <el-form-item label="企鹅指令：" prop="functionQiekjCode">
        <el-input clearable v-model="addForm.functionQiekjCode" type="textarea" :rows="4" auto-complete="off" />
      </el-form-item>
      <el-form-item label="有方指令：" prop="functionYoufangCode">
        <el-input clearable v-model="addForm.functionYoufangCode" type="textarea" :rows="4" auto-complete="off" />
      </el-form-item>
      <el-form-item label="指令类型：" prop="type">
        <el-select v-model="addForm.type" placeholder="请选择" style="width: 100%">
          <el-option v-for="(item, key) in modelFunctionType" :key="key" :label="key + '. '  + item" :value="key*1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基础指令编号：" prop="baseFunctionCode">
        <el-input clearable v-model="addForm.baseFunctionCode" auto-complete="off" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="addForm.status">
          <el-radio :label="0">停用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工作时长：" prop="workTime">
        <el-input clearable v-model.number="addForm.workTime" auto-complete="off" />
      </el-form-item>
      <el-form-item label="单价：" prop="price">
        <el-input clearable v-model.number="addForm.price" auto-complete="off" />
      </el-form-item>
      <el-form-item label="特殊参数：" prop="extraAttr">
        <el-input clearable v-model="addForm.extraAttr" type="textarea" :rows="4" auto-complete="off" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input clearable v-model="addForm.remark" type="textarea" :rows="4" auto-complete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click.native="editSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import DataUtils from "@/utils/Data";
import Api from '@/utils/Api';
import { cloudStatusTypes, modelFunctionType } from '@/utils/Mapping';

export default {
  name: 'model-function-edit',
  props: {
    // 型号
    model: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openDialog: false,
      oldFunctionList: [],
      modelFunctionRules: {
        functionCode: [{ required: true, message: '请输入功能编码', trigger: 'blur' }],
        functionName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择功能类型', trigger: 'blur' }],
        workTime: [{ required: true, type: 'integer', message: '请输入正确的工作时长', trigger: 'blur'}],
        price: [{ required: true, type: 'number', message: '请输入正确的单价', trigger: 'blur'}]
      },
      type: 3,
      addForm: {
        // 新增
        id: null,
        code: null,
        modelCode: null,
        functionCode: null,
        functionQiekjCode: null,
        functionYoufangCode: null,
        functionName: null,
        type: null,
        baseFunctionCode: null,
        status: 0,
        workTime: 0,
        price: 0,
        extraAttr: null,
        remark: null
      },
      modelFunctionType,
      cloudStatusTypes
    }
  },
  created() {
    this.addForm.modelCode = this.model.modelCode
    this.getOldFunctionList()
  },
  computed: {
  },
  methods: {
    handleOpenDialog(id) {
      if (id > 0) {
        this.$axios.post(Api.CLOUD_MODEL_FUNCTION_DETAIL + id).then(resp => {
          this.addForm = DataUtils.convertObject(this.addForm, resp);
          this.openDialog = true
        });
      } else {
        this.openDialog = true
      }
    },
    getOldFunctionList() {
      this.$axios.post(Api.MACHINETYPE_SECONDSDETAILS, { id: this.model.code }).then(resp => {
        if (resp.shopFuntions) {
          this.oldFunctionList = resp.shopFuntions;
        }
      })
    },
    // 新增二级类型
    editSubmit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addForm);

          const finish = () => {
            this.$emit('save');
            this.openDialog = false;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          }

          if (data.id) {
            // 编辑
            this.$confirm('此操作会影响线上配置的指令，可能会导致设备不可用，是否继续？', '警告').then(() => {
              this.$axios.post(Api.CLOUD_MODEL_FUNCTION_EDIT, data).then(resp => {
                finish();
              });
            })
          } else {
            // 新增
            this.$axios.post(Api.CLOUD_MODEL_FUNCTION_ADD, data).then(resp => {
              finish(); 
            });
          }
        }
      });
    },
  }
};
</script>