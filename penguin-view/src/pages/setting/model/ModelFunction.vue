<template slot-scope="scope">
  <section v-if="getPerm('dal:machineTypeSeconds:list')">
    <!-- 面包屑导航 -->
    <q-breadcrumb v-if="model" :data="['设置', '型号功能管理（新二级类型）', '功能设置', model.modelCode + model.modelName + model.modelType]" />
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="类型：">
            <el-select v-model="searchData.type" size="small">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="(item, key) in modelFunctionType" :key="key" :label="key + '. '  + item" :value="key*1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="getModelFunctionList">查询</a>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="handleOpenEditModelDialog('')">新增</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="functionList" style="width: 100%" height="695" class="my-table">
            <el-table-column prop="id" label="id" width="100"></el-table-column>
            <el-table-column prop="functionCode" label="编号" width="60"></el-table-column>
            <el-table-column prop="functionName" label="功能名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="functionQiekjCode" label="企鹅指令" width="180"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="functionYoufangCode" label="有方指令" width="180"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="baseFunctionCode" label="基础" width="60"></el-table-column>
            <el-table-column prop="type" label="类型" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.type | modelFunctionTypeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="60">
              <template slot-scope="scope">
                <span>{{scope.row.status | cloudStatusTypes}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleOpenEditModelDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <model-function-edit v-if="model" ref="modelFunctionEditDialog" :model="model" @save="getModelFunctionList" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Api from '@/utils/Api';
import { cloudStatusTypes, modelFunctionType } from '@/utils/Mapping';
import moment from 'moment';

import QBreadcrumb from '@/components/Breadcrumb';
import ModelFunctionEdit from './components/ModelFunctionEdit';

export default {
  name: 'model-function-page',
  components: {
    QBreadcrumb,
    ModelFunctionEdit
  },
  data() {
    return {
      searchData: {
        // 头部搜索
        modelCode: null,
        type: null
      },
      model: null,
      functionList: [],
      modelFunctionType
    };
  },
  filters: {
    cloudStatusTypes: val => {
      return cloudStatusTypes[val];
    },
    modelFunctionTypeFilter: val => {
      return modelFunctionType[val];
    }
  },
  created() {
    this.searchData.modelCode = this.$route.params.code;
    this.getModel();
    this.getModelFunctionList();
  },
  methods: {
    /**
     * 获取型号数据
     */
    getModel() {
      this.$axios.post(Api.CLOUD_SUB_CATEGORY_DETAIL + this.$route.params.code).then(data => {
        this.model = data;
      });
    },
    getModelFunctionList() {
      this.$axios.post(Api.CLOUD_MODEL_FUNCTION_LIST, this.searchData).then(data => {
        this.functionList = data;
      });
    },
    /**
     * 打开新增/修改型号
     */
    handleOpenEditModelDialog(id) {
      this.$refs.modelFunctionEditDialog.handleOpenDialog(id)
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  }
};
</script>
