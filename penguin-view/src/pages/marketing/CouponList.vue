<template>
	<section v-if="getPerm('dal:voucheruser:list')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['营销管理', '优惠券记录']" />
				<!--表单-->
				<el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
					<el-form-item label="面额：">
						<el-input size="small" clearable v-model="searchData.price" style="width: 140px;"></el-input>
					</el-form-item>
					<el-form-item label="用户账号：">
						<el-input size="small" clearable v-model="searchData.phone" style="width: 140px;"></el-input>
					</el-form-item>
					<el-form-item label="设备类型：">
						<el-select size="small" v-model="searchData.usePosition" style="width: 140px;" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="通用" value="0"></el-option>
							<el-option label="洗衣机" value="1"></el-option>
							<el-option label="烘干机" value="2"></el-option>
							<el-option label="洗鞋机" value="3"></el-option>
							<el-option label="吹风机" value="4"></el-option>
							<el-option label="充电桩" value="5"></el-option>
							<el-option label="饮水机" value="6"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态：">
						<el-select size="small" v-model="searchData.status" placeholder="请选择" style="width: 140px;margin-left:12px;">
							<el-option label="全部" value=""></el-option>
							<el-option label="未使用" value="0"></el-option>
							<el-option label="已使用" value="1"></el-option>
							<el-option label="已过期" value="2"></el-option>
							<el-option label="冻结" value="3"></el-option>
						</el-select>
					</el-form-item>
            <el-form-item label="属性：">
						<el-select size="small" v-model="searchData.isHidden" placeholder="请选择" style="width: 140px;margin-left:12px;">
							<el-option label="全部" value=""></el-option>
							<el-option label="正常" value="0"></el-option>
							<el-option label="删除" value="1"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item label="活动名称：">
						<el-input size="small" clearable v-model="searchData.eventName" style="width: 140px;"></el-input>
					</el-form-item>
          <el-form-item label="创建时间：">
						<el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
					</el-form-item>
					<el-form-item v-if="getPerm('dal:voucheruser:excel')">
						<a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
					</el-form-item>
				</el-form>
				<div class="tab-s">
					<!--表格-->
					<el-table border :data="list" style="width: 100%" height="648" class="my-table">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
						</el-table-column>
             <el-table-column show-overflow-tooltip prop="phone" label="活动名称">
               <template slot-scope="scope">
                 <span :style="{'color':scope.row.source == 1 ? '#ea1e1e':scope.row.source == 2?'#00a0e8':'#333' }">{{scope.row.name}}</span>
               </template>
             </el-table-column>
             <el-table-column show-overflow-tooltip prop="phone" label="活动来源">
               <template slot-scope="scope">
                 <span v-if="scope.row.source == 1">后台</span>
                 <span v-if="scope.row.source == 2">奖励</span>
                 <span v-if="scope.row.source == 3">商家补偿</span>
               </template>
             </el-table-column>
						<el-table-column label="面额/折扣"  width="100" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.type === 1">{{scope.row.faceValue + '元'}}</span>
								<span v-if="scope.row.type === 2">{{'免费体验券'}}</span>
								<span v-if="scope.row.type === 3">{{scope.row.faceValue * 10 + '折'}}</span>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label="条件" width="120">
							<template slot-scope="scope">
								<span v-if="scope.row.type === 1">{{'满' + scope.row.minGcoins + '元可用'}}</span>
								<span v-if="scope.row.type === 2">{{'无'}}</span>
								<span v-if="scope.row.type === 3">{{'减免上限' + scope.row.minGcoins + '元'}}</span>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="phone" label="用户账号">
						</el-table-column>
            
            <el-table-column show-overflow-tooltip prop="voucherPrice" label="优惠金额"></el-table-column>
            <el-table-column show-overflow-tooltip prop="payPrice" label="实际支付金额" width="120"></el-table-column>
						<el-table-column show-overflow-tooltip prop="usePositionList" label="设备类型" width="100" :formatter="formatterStatus">
						</el-table-column>
						<el-table-column show-overflow-tooltip label="适用范围" width="100">
							<template slot-scope="scope">
								<span>{{scope.row.useScope == 0 ? '通用店铺' : scope.row.shopName}}</span>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label="有效期" width="180">
							<template slot-scope="scope">
								<span>{{scope.row.startDate}}至{{scope.row.endDate}}</span>
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip label="有效时段" width="120">
							<template slot-scope="scope">
								<span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="createTime" show-overflow-tooltip label="创建时间" width="180">
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="status" label="状态" width="100" :formatter="formatterCouponStatus">
						</el-table-column>
						<el-table-column prop="isHidden" label="属性" width="180">
							<template slot-scope="scope">
								<span>{{scope.row.isHidden === 0 ? '正常' : '删除'}}</span>
							</template>
						</el-table-column>
						<el-table-column fixed="right" label="操作" width="110">
							<template slot-scope="scope" v-if="scope.row.status === 0 && scope.row.isHidden === 0">
								<el-tooltip v-if="getPerm('dal:voucheruser:delete')" content="删除" placement="top" effect="dark">
                                    <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row.id)">
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
	</section>
</template>
<script>
import { mapGetters } from "vuex";
import store from "@/store";
import QBreadcrumb from "@/components/Breadcrumb";
import QIndex from "@/components/Index";
import Api from "@/utils/Api";
import DataUtils from "@/utils/Data";
import PagerMixin from "@/mixins/PagerMixin";
import { exportExcel } from "@/utils/tool";
import { voucherType } from "@/utils/Mapping";
import { CouponType } from "@/utils/Mapping";

export default {
  name: "page-operator-list",
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,

      //头部搜索
      searchData: {
        faceValue: null,
        phone: null,
        usePosition: null,
        status: null,
        isHidden: null,
        startTime: null,
        endTime: null,

        //
        time: null
      },
      price: null
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm("dal:voucheruser:list")) {
      this.getOperatorList();
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
    // 获取优惠券记录列表
    getOperatorList() {
      this.apiUrl = Api.VOUCHERUSER_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 查询优惠券记录
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          if (this.searchData.price == "免费体验券") {
            this.searchData.faceValue = 0;
          } else if (this.searchData.price == "免费") {
            this.searchData.faceValue = 0;
          } else {
            this.searchData.faceValue = this.searchData.price;
          }
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

    // 格式化类型
    formatterStatus(row, column) {
      let status = "";
      if (row.usePositionList != null) {
        let usePosition_List = row.usePositionList.split(",");
        this.status = "";
        usePosition_List.map(item => {
          if (item == 1) {
            status += "洗衣机" + " ";
          } else if (item == 2) {
            status += "烘干机" + " ";
          } else if (item == 3) {
            status += "洗鞋机" + " ";
          } else if (item == 4) {
            status += "吹风机" + " ";
          } else if (item == 5) {
            status += "充电桩" + " ";
          } else if (item == 6) {
            status += "饮水机" + " ";
          } else {
            status = "通用";
          }
        });
      }
      return status;
    },
    // 格式化优惠券状态
    formatterCouponStatus(row, column) {
      return CouponType[row.status];
    },

    // 删除
    handleDelete(id) {
      this.$confirm("您确定要删除该优惠券记录吗？", "警告").then(_ => {
        this.$axios
          .post(Api.VOUCHERUSER_DELETE, {
            id: id
          })
          .then(_ => {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success"
            });
            this.getOperatorList();
          });
      });
    },

    // 导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.VOUCHERUSER_ExCEL, "优惠券记录总览.xlsx", query);
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
.max-dialog {
  .el-dialog {
    width: 1000px;
  }
}

.diaolog-ope {
  .el-dialog {
    width: 700px;
  }
  .carrier-detail {
    .border-b {
      border-bottom: 1px solid #e3e1e1;
      .operator-img {
        img {
          display: inline-block;
          width: 50px;
          height: 50px;
          margin: 0 5px;
        }
        .big-img {
          .el-dialog__header {
            border: none !important;
          }
        }
      }
    }
    h2 {
      margin-bottom: 15px;
      padding-top: 15px;
      i {
        margin-right: 10px;
      }
    }
    .el-form-item {
      width: 45%;
      margin-right: 45px;
    }
    .el-form-item:nth-child(odd) {
      margin-right: 0;
    }
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

.el-input__inner:hover {
  cursor: pointer;
  border-color: #409eff;
}

.name-active:hover {
  cursor: pointer;
}

.el-form-item__label:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
