<template slot-scope="scope">
  <section v-if="getPerm('dal:machineTypeStairs:list')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="类型名称：">
            <el-input size="small" clearable v-model="searchData.machineTypeName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <el-button v-if="getPerm('dal:machineTypeStairs:save')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddMachineTypeFirstDialog('')">新增一级类型</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="695" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="machineTypeName" label="类型名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sequence" label="排序" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createUserName" label="创建人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="250" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:machineTypeStairs:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddMachineTypeFirstDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:machineTypeStairs:delete')" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleRemove(scope.row.id)">
                    <use xlink:href="#icon-trashcopy"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <!--////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->

    <!-- 新增或编辑一级类型 -->
    <el-dialog class="machine-dialog" :visible.sync="isShowAddMachineTypeFirstDialog" @close="isShowAddMachineTypeFirstDialog = false">
      <div slot="title">
        <span>{{machineTypeTitle}}</span>
      </div>
      <el-form :model="addForm" :rules="addrules" ref="addForm" label-width="94px" v-if="isShowAddMachineTypeFirstDialog">
        <el-form-item label="类型名称：" prop="machineTypeName">
          <el-input clearable v-model="addForm.machineTypeName"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sequence">
          <el-input clearable v-model="addForm.sequence" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="addSave('addForm')">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';

export default {
  name: 'page-first-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,

      searchData: {
        // 头部搜索
        machineTypeName: null,
        startTime: null,
        endTime: null
      },

      //新增或者编辑
      addrules: {
        machineTypeName: [
          {
            required: true,
            type: 'string',
            message: '请填写类型名称',
            trigger: 'blur'
          }
        ],
        sequence: [{ required: true, message: '排序不能为空', trigger: 'blur' }, { pattern: '^\\d*?$', message: '排序只能输入数字', trigger: 'change' }],
        image: [{ required: true, message: '请填写图片地址', trigger: 'blur' }]
      },
      addForm: {
        id: '',
        machineTypeName: '',
        image: '',
        sequence: ''
      },
      isShowAddMachineTypeFirstDialog: false,

      // 新增或者编辑一级类型标题
      machineTypeTitle: '新增一级类型',
      dateTime: ''
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:machineTypeStairs:list')) {
      this.getMachineStairs();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //获取一级类型配置列表
    getMachineStairs() {
      this.apiUrl = Api.MACHINETYPE_STAIRS;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    //根据搜索条件查询列表信息
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          // 地区转换
          query.provinceId = query.areaIds ? query.areaIds[0] : null;
          query.cityId = query.areaIds ? query.areaIds[1] : null;
          query.districtId = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;

          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    // 获取一级类型配置详情
    getMachineTypeDetail(id) {
      this.machineTypeTitle = '编辑一级类型';
      return this.$axios
        .post(Api.MACHINETYPE_DETAILS, {
          id: id
        })
        .then(resp => {
          this.addForm.id = resp.id;
          this.addForm.machineTypeName = String(resp.machineTypeName);
          this.addForm.sequence = String(resp.sequence);
        });
    },
    // 添加一级类型弹出框
    async openAddMachineTypeFirstDialog(id) {
      (this.machineTypeTitle = '新增一级类型'),
        (this.addForm = {
          namemachineTypeName: '',
          sequence: null,
          id: null
        });
      if (id != '') {
        await this.getMachineTypeDetail(id);
      }
      this.isShowAddMachineTypeFirstDialog = true;
    },
    // 添加或者编辑信息提交
    addSave() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let apiUrl = this.addForm.id != null ? Api.MACHINETYPE_STAIRS_EDIT : Api.MACHINETYPE_STAIRS_ADD;
          this.$axios.post(apiUrl, this.addForm).then(_ => {
            this.getMachineStairs();
            this.isShowAddMachineTypeFirstDialog = false;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          });
        }
      });
    },
    // 删除
    handleRemove(id) {
      this.$confirm('您确定要删除该类型吗？', '警告').then(_ => {
        this.$axios
          .post(Api.MACHINETYPE_DELETE, {
            id: id
          })
          .then(_ => {
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功！',
              type: 'success'
            });
            this.getMachineStairs();
          });
      });
    },
    //导出
    download() {
      this.$alert('暂不支持');
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {}
};
</script>
<style lang="less">
.machine-dialog {
  .el-dialog {
    width: 500px;
  }
}
</style>
