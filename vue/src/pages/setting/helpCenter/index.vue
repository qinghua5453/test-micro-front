<template>
  <section v-if="getPerm('dal:help:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['设置', '帮助中心']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="标题：">
            <el-input size="small" clearable v-model="searchData.title" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="分类：">
            <el-select size="small" v-model="searchData.type" style="width: 140px;" placeholder="全部">
              <el-option value="" label="全部">全部</el-option>
              <el-option v-for="(name, id) in HelpType" :key="id" :label="name" :value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('dal:help:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddHelpDialog()">新增内容</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="690" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip> </el-table-column>
            <el-table-column fixed prop="type" label="分类" :formatter="formatterStatus" width="80"> </el-table-column>
            <el-table-column prop="questionTitle" label="标题" width="240"> </el-table-column>
            <el-table-column label="内容">
              <template slot-scope="scope">
                <div v-html="scope.row.answerContent"></div>
              </template>
            </el-table-column>
            <el-table-column prop="tagName" label="标签" width="80"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150"> </el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:help:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddHelpDialog(scope.row)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>

                <el-tooltip v-if="getPerm('dal:help:delete')" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleHelpDelete(scope.row.id)">
                    <use xlink:href="#icon-trashcopy"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" :query="query" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!--内容-->
    <add-content v-if="addContentVisible" :visible.sync="addContentVisible" :helpId="helpId" :contentRow="contentRow" @getHelpList="getHelpList" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel, DateFormat } from '@/utils/tool';
import { HelpType } from '@/utils/Mapping';
import addContent from './addContent';
export default {
  name: 'page-help-list',
  components: {
    QBreadcrumb,
    addContent
  },
  mixins: [PagerMixin],
  data() {
    return {
      // 额外参数
      query: { contentType: 1 },
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        title: this.$route.query.title,
        type: this.$route.query.type
      },
      addContentVisible: false,
      helpId: '',
      contentRow: {}
    };
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    HelpType() {
      return HelpType;
    }
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:help:list')) {
      this.getHelpList();
    }
  },
  methods: {
    //获取用户列表信息
    getHelpList() {
      this.apiUrl = Api.HELP_LIST;
      let query = Object.assign({}, this.$route.query, this.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    formatterStatus(row, column) {
      return HelpType[row.type];
    },
    //根据搜索条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          let query = DataUtils.filter(this.searchData);
          query['contentType'] = 1; //帮助中心
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    openAddHelpDialog(row = {}) {
      this.helpId = '';
      if (row.id) {
        this.helpId = row.id;
        this.contentRow = row;
      }
      this.addContentVisible = true;
    },
    // 删除内容
    handleHelpDelete(id) {
      this.$confirm('您确定要删除该内容', '删除确认').then(() => {
        this.$axios
          .post(Api.HELP_DELETE, {
            id: id
          })
          .then(res => {
            this.$message({
              showClose: true,
              message: '内容已删除成功！',
              type: 'success'
            });
            this.getHelpList();
          });
      });
    }
  }
};
</script>

<style lang="less">
.draw-textarea {
  .el-textarea__inner {
    line-height: 3.5 !important;
  }
}
textarea {
  resize: none;
}
</style>
