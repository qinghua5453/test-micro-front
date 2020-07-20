<template>
	<section v-if="getPerm('dal:vind:trans:list')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['成员管理', '工单列表']" />
				<!--表单-->
				<el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
                    <el-form-item label="时间：">
                        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="工单类型：">
						<el-select size="small" v-model="searchData.type" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="安装单" value="1"></el-option>
							<el-option label="维修单" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="工单编号：">
						<el-input size="small" clearable v-model="searchData.jobNo"></el-input>
					</el-form-item>
					<el-form-item label="建单人：">
						<el-input size="small" clearable v-model="searchData.createName"></el-input>
					</el-form-item>
					<el-form-item label="工单状态：">
						<el-select size="small" v-model="searchData.status" placeholder="请选择">
							<el-option label="全部" value=""></el-option>
							<el-option label="待备料" value="1"></el-option>
							<el-option label="待派单" value="2"></el-option>
							<el-option label="待接单" value="3"></el-option>
							<el-option label="待处理" value="4"></el-option>
							<el-option label="待结单" value="5"></el-option>
							<el-option label="已结单" value="6"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="地区：" prop="areaIds">
                        <el-select size="small" v-model="searchData.areaIds" placeholder="全部">
                            <el-option label="不限" :value="null"></el-option>
                            <el-option v-for="item in proviceTypes" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item>
						<a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
					</el-form-item>
				</el-form>
				<div class="tab-s">
					<el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="695">
						<el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
						<el-table-column fixed prop="phone" label="工单编号" width="180" show-overflow-tooltip>
                            <template slot-scope="scope">
								<div class="name-active" @click="openDetailDialog(scope.row.jobId)">{{scope.row.jobNo}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="工单类型" :formatter="formatterVindTranType" show-overflow-tooltip></el-table-column>
						<el-table-column prop="status" label="工单状态" :formatter="formatterVindTranStatus" show-overflow-tooltip></el-table-column>
						<el-table-column prop="province" label="省份" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column prop="createName" label="建单人" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column prop="createTime" label="建单时间" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column prop="machineNum" label="设备数量" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column prop="machineInstallNum" label="安装数量" width="180" show-overflow-tooltip></el-table-column>
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
		 <!--详情-->
		<el-dialog class="order-detail" title="安装单详情" size="tiny" :visible.sync="isShowDetailDialog" @close="isShowDetailDialog = false">
			<el-form :inline="true" :model="vindDetail" class="carrier-detail">
				<div class="border-b">
					<h2><i class="header-icon el-icon-goods"></i>基础信息</h2>
					<p class="vindditeil-infor">
						<span>创建人：{{vindDetail.createName}}</span>
						<span>建单时间：{{vindDetail.createTime}}</span>
						<span>工单类型：{{vindDetail.type | VindTranType}}</span>
						<span>工单状态：{{vindDetail.status | VindTranStatus}}</span>
						<span>手机号码：{{vindDetail.createPhone}}</span>
						<span>订单编号：{{vindDetail.jobNo}}</span>
						<span>省份：{{vindDetail.province+vindDetail.city+vindDetail.district}}</span>
						<span style="line-height: 20px;">详细地址：{{vindDetail.address}}</span>
					</p>
				</div>
				<div class="border-b" style="border:none">
					<h2><i class="header-icon el-icon-goods"></i>安装信息</h2>
					<el-form-item label="运营商：">
						<span>{{vindDetail.operatorName}}</span>
					</el-form-item>
					<el-form-item label="手机号码：">
						<span>{{vindDetail.operatorPhone}}</span>
					</el-form-item>
					<el-form-item label="设备数量：">
						<span>{{vindDetail.machineNum}}</span>
					</el-form-item>
					<el-form-item label="安装数量：">
						<span>{{vindDetail.machineInstallNum}}</span>
					</el-form-item>
					<el-table border :data="vindDetail.machines" class="my-table">
						<el-table-column prop="parentName" label="一级类型" show-overflow-tooltip></el-table-column>
						<el-table-column prop="num" label="设备数量" show-overflow-tooltip>	</el-table-column>
						<el-table-column prop="communicationType" label="通信类型" :formatter="formatterCommunicationType" show-overflow-tooltip></el-table-column>
						<el-table-column prop="remouldType" label="改造类型" :formatter="formatterVindremouldType" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="border-b" style="border:none">
					<h2><i class="header-icon el-icon-goods"></i>店铺信息</h2>
					<el-table border :data="vindDetail.machineCounts" class="my-table">
						<el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="parentName" label="一级类型" show-overflow-tooltip></el-table-column>
						<el-table-column prop="installNum" label="安装数量" show-overflow-tooltip>	</el-table-column>
						
					</el-table>
				</div>
				<div class="border-b" style="border:none">
					<h2><i class="header-icon el-icon-goods"></i>业务信息</h2>
					<p class="vindditeil-infor">
						<span>销售人员：{{vindDetail.marketer}}</span>
						<span>对接人员：{{vindDetail.joiner}}</span>
						<span>联系方式：{{vindDetail.phone}}</span>
						<span>备注：{{vindDetail.desc}}</span>
						<span>完成时间：{{vindDetail.completeTime}}</span>
					</p>
				</div>
				<div class="border-b" style="border:none">
					<h2><i class="header-icon el-icon-goods"></i>工单处理流程</h2>
					<p class="vind-flow" v-for="(item,index) in vindDetail.taches" :key="index"><span class="status">{{item.tacheName.substring(1,2)}}</span><span>{{item.receiveUserName}}</span><span>{{item.receiveUserPhone}}</span><span style="color:#999">{{item.sendTime}}</span></p>
				</div>
			</el-form>
		</el-dialog>
	</section>
</template> 

<script>
	import { mapGetters } from 'vuex';
	import store from '@/store';
	import Api from '@/utils/Api';
	import QBreadcrumb from '@/components/Breadcrumb';
	import DataUtils from '@/utils/Data';
	import { VindTranStatus, VindTranType, VindCommunicationType, VindremouldTypeType } from '@/utils/Mapping';
	import PagerMixin from '@/mixins/PagerMixin';

	export default {
		name: 'page-workorder-list',
		mixins: [PagerMixin],
		data() {
			return {
				list: [], // 数据
				total: 0,
				page: 0,
				pageSize: 0,
				searchData: {},
				proviceTypes:[],
				isShowDetailDialog:false,
				vindDetail:{}
			};
		},
		created() {
			// 判断该用户是否有查看权限
			if(this.getPerm('dal:vind:trans:list')){
                this.getCommonProvice();
				this.getVindList();
				this.searchData = Object.assign(this.searchData, this.$route.query);
				// 时间转换
				if(this.searchData.startTime && this.searchData.endTime) {
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
			// 获取列表信息
			getVindList() {
				this.apiUrl = Api.VIND_LIST;
				let query = this.$route.query;
				this.setApiParams(query);
				this.$axios.post(this.apiUrl, this.apiParams).then(res => {
					this.total = res.total;
					this.list = res.items;
				});
			},
			formatterVindTranStatus(row, column) {
				return VindTranStatus[row.status];
			},
			formatterVindTranType(row, column) {
				return VindTranType[row.type];
			},
			formatterCommunicationType(row, column) {
				return VindCommunicationType[row.communicationType];
			},
			formatterVindremouldType(row, column) {
				return VindremouldTypeType[row.remouldType];
			},
            // 获取省份
			getCommonProvice() {
				return this.$axios.post(Api.AREA_LIST, {
					parentId: 0
				}).then(resp => {
					this.proviceTypes = resp;
				});
			},
			//根据条件查询店铺列表信息
			goSearch() {
				this.$refs.searchData.validate((valid) => {
					if(valid) {
						// 时间转换
						let query = DataUtils.clone(this.searchData);
						query.startTime = query.time ? query.time[0] : null;
						query.endTime = query.time ? query.time[1] : null;
						query.time = null;
						query = DataUtils.filter(query);
						query['t'] = +new Date();	
						this.$router.push({
							query: query
						});
					}
				});
			},
			openDetailDialog(id){
				this.isShowDetailDialog = true;
				let payload = {jobId:id};
				this.$axios.post(Api.VIND_DETAILS, payload).then(res => {
					this.vindDetail = res;
				});
			}

		},
		filters:{
            VindTranStatus(value){
                return VindTranStatus[value];
			},
            VindTranType(value){
                return VindTranType[value];
			}
        },
		computed: {
			...mapGetters('user', ['getPerm'])
		},
		components: {
            QBreadcrumb
		}
	};
</script>

<style lang="less" scoped>
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
	.vindditeil-infor {
		span {
			display: inline-block;
			margin: 22px 32px 22px 0;
		}
	}
	.vind-flow {
		span {
			display: inline-block;
			margin: 5px 13px 10px 0;
		}
		.status {
			border: 1px solid #999;
			border-radius: 50%;
			width: 24px;
			height: 24px;
			text-align: center;
			line-height: 24px;
		}
	}
</style>