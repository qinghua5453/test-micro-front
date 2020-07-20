<template slot-scope="scope">
  <section v-if="getPerm('dal:machineTypeSeconds:list')">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['设置', '型号功能管理（新二级类型）']" />
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="类型名称：">
            <el-input size="small" clearable v-model="searchData.name" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="一级类型：">
            <el-select v-model="searchData.categoryCode" size="small">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryCode + item.categoryName" :value="item.categoryCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="getModelList">查询</a>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="handleOpenEditModelDialog('')">新增</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column prop="id" label="id" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modelCode" label="设备code" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modelName" label="类型名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modelType" label="设备型号" width="150"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryName" label="分类" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" width="60" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.status | cloudStatusTypes}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleOpenEditModelDialog(scope.row.modelCode)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:machineTypeSeconds:update')" content="设置指令" placement="top" effect="dark">
                  <router-link tag="i" class="el-icon-setting icon" style="color:#00A0E8" :to="'/model/function/' + scope.row.modelCode"></router-link>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <model-edit ref="modelEditDialog" @save="getModelList" />
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import { cloudStatusTypes } from '@/utils/Mapping';

import QBreadcrumb from '@/components/Breadcrumb';
import ModelEdit from './components/ModelEdit';

export default {
  name: 'model-list-page',
  components: {
    QBreadcrumb,
    ModelEdit
  },
  data() {
    return {
      searchData: {
        // 头部搜索
        categoryCode: null,
        name: null
      },
      list: []
    };
  },
  filters: {
    cloudStatusTypes: val => {
      return cloudStatusTypes[val];
    }
  },
  created() {
    this.getCategoryList();
    this.getModelList();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getModelList() {
      this.$axios.post(Api.CLOUD_SUB_CATEGORY, this.searchData).then(data => {
        this.list = data;
      });
    },
    /**
     * 打开新增/修改型号
     */
    handleOpenEditModelDialog(code) {
      this.$refs.modelEditDialog.handleOpenDialog(code)
    },
    ...mapActions('model', [
      'getCategoryList'
    ])
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    ...mapState('model', {
      categoryList: state => state.categoryList,
    })
  }
};
</script>
<style lang="less">
</style>
