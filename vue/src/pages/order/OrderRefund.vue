<template>
	<section v-if="getPerm('dal:order:refundList')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['订单管理', '退款记录']" />
				<!--表单-->
				<el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
					<el-form-item label="订单编号：">
						<el-input size="small" clearable v-model="searchData.orderNo"></el-input>
					</el-form-item>
					<el-form-item label="用户账号：">
						<el-input size="small" clearable v-model="searchData.phone"></el-input>
					</el-form-item>
					<!-- <el-form-item label="操作人：">
						<el-input size="small" clearable v-model="searchData.operationName"></el-input>
					</el-form-item> -->
					<el-form-item label="操作时间：">
						<el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
					</el-form-item>
					<el-form-item v-if="getPerm('dal:order:refundExcel')">
						<a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
					</el-form-item>
				</el-form>
				<div class="tab-s">
					<!--表格-->
					<el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="740">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
						</el-table-column>
						<el-table-column fixed prop="orderNo" width="200" label="订单编号" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="phone" label="用户账号" width="120" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="退款金额" width="100">
							<template slot-scope="scope">
								<div class="name-active" @click="openOrderDetailDialog(scope.row.id)">{{scope.row.price}}</div>
							</template>
						</el-table-column>
						<!-- <el-table-column prop="operationName" label="操作人" show-overflow-tooltip>
						</el-table-column> -->
						<el-table-column prop="createTime" label="创建时间" width="170">
						</el-table-column>
						<el-table-column prop="fault" label="故障描述" show-overflow-tooltip>
						</el-table-column>
					</el-table>
					<!--分页-->
					<el-col :span="24" class="toolbar">
						<div class="block">
							<q-pager :total="total" />
						</div>
					</el-col>
					<!--退款详情-->
					<el-dialog class="dialog-shop" title="退款详情" :visible.sync="isShowRefundDetailDialog" @close="isShowRefundDetailDialog = false">
						<el-form :model="refundDetail" label-width="96px">
							<el-form-item label="订单编号：" class="form-item-m">
								<span>{{refundDetail.orderNo}}</span>
							</el-form-item>
							<el-form-item label="退款金额：" class="form-item-m">
								<span>{{refundDetail.price}}</span>
							</el-form-item>
							<el-form-item label="故障描述：" class="form-item-m">
								<span>{{refundDetail.fault}}</span>
							</el-form-item>
							<el-form-item label="故障图片：" class="form-item-m">
								<img v-if="refundDetail.imageUrl" v-for="(item,index) in refundDetail.imageUrl" :key="index" :src="item" width="146" height="146" @click="showImg(item)">
							</el-form-item>
						</el-form>
					</el-dialog>
					<!-- 查看大图 -->
					<el-dialog class="big-img" :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import DataUtils from "@/utils/Data";
import QUpload from "@/components/Upload";
import PagerMixin from "@/mixins/PagerMixin";
import { exportExcel } from "@/utils/tool";

export default {
  name: "page-refund-list",
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      // 头部搜索
      searchData: {
        time: null
      },

      isShowRefundDetailDialog: false,
      refundDetail: {
        perno: 123241345464564566,
        money: 300.0,
        desc: "支付启动不了"
      },

      // 显示原图
      dialogImageUrl: null,
      dialogVisible: false
    };
  },
  created() {
    if (this.getPerm("dal:order:refundList")) {
      this.getOrderRefundList();
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
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    //订单列表
    getOrderRefundList() {
      this.apiUrl = Api.REFUND_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    //根据条件查询店铺列表信息
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
    //查看订单详情
    getOrderDetails(id) {
      return this.$axios
        .post(Api.REFUND_DETAILS, {
          id: id
        })
        .then(res => {
          this.refundDetail = res;
        });
    },
    openOrderDetailDialog(id) {
      if (this.getPerm("dal:order:refunDetails")) {
        this.getOrderDetails(id).then(
          () => (this.isShowRefundDetailDialog = true)
        );
      }
    },
    // 查看原图
    showImg(imgUrl) {
      if (imgUrl != null) {
        this.dialogImageUrl = imgUrl;
        this.dialogVisible = true;
      }
    },
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.REFUND_EXPORT, "退款记录总览.xlsx", query);
        }
      });
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
.order-detail {
  .el-collapse {
    border-top: none;
  }
  .el-dialog {
    width: 60%;
  }
}

.refuse-dialog {
  .el-textarea__inner {
    line-height: 3.5;
  }
}

.border-b {
  border-bottom: 1px solid #e3e1e1;
  margin-bottom: 10px;
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    i {
      margin-right: 8px;
    }
  }
}

.carrier-detail {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
