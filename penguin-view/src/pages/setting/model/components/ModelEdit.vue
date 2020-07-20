<template>
  <!-- 新增型号dialog -->
  <el-dialog title="新增/修改型号" width="80%" :visible.sync="openModelDialog" @close="openModelDialog = false">
    <el-form :rules="modelRules" :model="addForm" ref="addForm">
      <el-form-item label="老二级类型" prop="code">
        <el-select v-model="addForm.code" filterable placeholder="请选择" style="width: 100%">
          <el-option v-for="item in secondType" :key="item.id" :label="item.machineTypeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号编码：" prop="modelCode">
        <el-input clearable v-model="addForm.modelCode" auto-complete="off" />
      </el-form-item>
      <el-form-item label="名称：" prop="modelName">
        <el-input clearable v-model="addForm.modelName" auto-complete="off" />
      </el-form-item>
      <el-form-item label="型号：" prop="modelType">
        <el-input clearable v-model="addForm.modelType" auto-complete="off" />
      </el-form-item>
      <el-form-item label="分类：" class="form-item-m" prop="categoryCode">
        <el-select v-model="addForm.categoryCode" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryCode + item.categoryName" :value="item.categoryCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="addForm.status">
          <el-radio :label="0">停用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="特殊参数：" prop="extraAttr">
        <el-input clearable v-model="addForm.extraAttr" type="textarea" :rows="4" auto-complete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click.native="editSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import DataUtils from "@/utils/Data";
import Api from '@/utils/Api';

export default {
  name: 'model-edit',
  data() {
    return {
      openModelDialog: false,
      secondType: [],
      modelRules: {
        modelCode: [{ required: true, message: '请输入型号编码', trigger: 'blur' }],
        code: [{ required: true, message: '请选择老二级类型', trigger: 'blur' }],
        modelName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        modelType: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        categoryCode: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      addForm: {
        // 新增
        id: null,
        code: null,
        modelCode: null,
        modelName: null,
        modelType: null,
        categoryCode: null,
        status: 0,
        extraAttr: null
      }
    }
  },
  created() {
    this.getSecondType();
  },
  computed: {
    ...mapState('model', {
      categoryList: state => state.categoryList,
    })
  },
  methods: {
    handleOpenDialog(modelCode) {
      if (modelCode) {
        this.$axios.post(Api.CLOUD_SUB_CATEGORY_DETAIL + modelCode).then(resp => {
          this.addForm = resp;
          this.openModelDialog = true
        });
      } else {
        this.openModelDialog = true
      }
    },
    //获取老二级类型配置列表
    getSecondType() {
      this.$axios.post(Api.MACHINETYPE_SECONDS, { page: 1, pageSize: 500 }).then(resp => {
        this.secondType = resp.items;
      });
    },
    // 新增二级类型
    editSubmit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addForm);

          const finish = () => {
            this.$emit('save');
            this.openModelDialog = false;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          }

          if (data.id) {
            // 编辑
            this.$confirm('此操作会影响线上配置的指令，可能会导致设备不可用，是否继续？', '警告').then(() => {
              this.$axios.post(Api.CLOUD_SUB_CATEGORY_EDIT, data).then(resp => {
                finish();
              });
            })
          } else {
            // 新增
            this.$axios.post(Api.CLOUD_SUB_CATEGORY_ADD, data).then(resp => {
              finish(); 
            });
          }
        }
      });
    },
  }
};
</script>