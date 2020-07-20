<template>
	<section v-if="getPerm('dal:invite:list')" class="invite-wrap">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['设置', '邀请码管理']" />
				<!--表单-->
				<el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
					<el-form-item label="邀请码">
						<el-input size="small" clearable v-model="searchData.code" style="width: 140px;"></el-input>
					</el-form-item>
					<el-form-item label="创建人">
						<el-input size="small" clearable v-model="searchData.name" style="width: 140px;"></el-input>
					</el-form-item>
					<el-form-item label="分类：">
						<el-select size="small" v-model="searchData.status" style="width: 140px;" placeholder="全部">
							<el-option value="" label="全部">全部</el-option>
							<el-option value="0" label="未使用"></el-option>
							<el-option value="1" label="已使用"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间：">
						<el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" :editable="false" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
					</el-form-item>
				</el-form>
				<div class="tab-s">
                    <el-button v-if="getPerm('dal:invite:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openaddHelpDialog({})">生成邀请码</el-button>
					<!--表格-->
					<el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="675" class="my-table">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
						<el-table-column fixed prop="code" label="邀请码" ></el-table-column>
						<el-table-column prop="name" label="创建人" ></el-table-column>
						<el-table-column prop="createTime" label="创建时间" ></el-table-column>
						<el-table-column prop="status" label="状态" :formatter="formatterStatus"></el-table-column>
					</el-table>
					<!--分页-->
					<el-col :span="24" class="toolbar">
						<div class="block">
							<q-pager :total="total"/>
						</div>
					</el-col>
				</div>
			</el-col>
		</el-row>

        <!--新增内容-->
		<el-dialog title="生成邀请码" :visible.sync="isShowAddHelpModle" @close="closeCode()" width="300px">
			<div class="bd-con">
				<p>邀请码已生成</p>
				<p class="invite-num">{{code}}</p>
				<el-button plain v-clipboard:copy="code"  v-clipboard:success="onCopy"  v-clipboard:error="onError">复制邀请码</el-button>
			</div>
		</el-dialog>
	
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import QBreadcrumb from "@/components/Breadcrumb";
import Api from "@/utils/Api";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";
import { BDInviteStatus } from "@/utils/Mapping";
export default {
  name: "page-invite-list",
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        startTime: null,
        endTime: null,
        //
        time: null
      },
      isShowAddHelpModle: false,
      code: "",
      copyBtn: null //存储初始化复制按钮事件
    };
  },
  mounted() {},
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm("dal:invite:list")) {
      this.getInviteList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [
          this.searchData.startTime,
          this.searchData.endTime
        ];
      }
    }
  },
  methods: {
    //获取用户列表信息
    getInviteList() {
      this.apiUrl = Api.BDINVITE_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    formatterStatus(row, column) {
      return BDInviteStatus[row.status];
    },
    //根据搜索条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;

          query = DataUtils.filter(query);
          query["t"] = +new Date();
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
    openaddHelpDialog() {
      this.$axios.post(Api.BDINVITE_ADD).then(res => {
        this.code = res.code;
        this.isShowAddHelpModle = true;
      });
    },
    onCopy: function(e) {
      this.isShowAddHelpModle = false;
      this.$message.success("复制成功");
      this.getInviteList();
    },
    onError: function(e) {
      this.$message.error("复制失败");
    },
    closeCode() {
      this.isShowAddHelpModle = false;
      this.getInviteList();
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.invite-wrap {
  .el-dialog__body {
    padding: 0;
  }
  .bd-con {
    color: #333;
    text-align: center;
    font-size: 16px;
    padding-top: 40px;
    padding-bottom: 20px;
    .invite-num {
      font-size: 32px;
      padding-top: 40px;
      padding-bottom: 20px;
    }
  }
}
</style>
