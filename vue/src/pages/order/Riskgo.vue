<template>
	<section v-if="getPerm('dal:order:aliriskList')">
		<el-row>
			<el-col :span="24">
				<!-- 面包屑导航 -->
				<q-breadcrumb :data="['订单管理', '支付宝投诉订单']" />
				<!--表单-->
				<el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
					<el-form-item label="处理状态：">
						<el-select size="small" v-model="searchData.handleStatus" style="width: 140px;" placeholder="全部">
							<el-option label="全部" value=""></el-option>
							<el-option :label="name" :value="id" :key="id" v-for="(name, id) in riskStatus"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="用户投诉时间：" prop="date">
						<el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
						</el-date-picker>
					</el-form-item>
                    <el-form-item label="用户账号：">
						<el-input size="small" clearable v-model="searchData.userPhone" style="width: 140px;"></el-input>
					</el-form-item>
                      <el-form-item label="订单编号：">
						<el-input size="small" clearable v-model="searchData.orderNo" style="width: 140px;"></el-input>
					</el-form-item>
                      <el-form-item label="运营商：">
						<el-input size="small" clearable v-model="searchData.operatorPhone" style="width: 140px;"></el-input>
					</el-form-item>
				    <el-form-item>
						<a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
					</el-form-item>
					<el-form-item v-if="getPerm('dal:order:aliriskExcel')">
						<a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
					</el-form-item>
				</el-form>
				<div class="tab-s">
					<!--表格-->
					<el-table border :data="list" style="width: 100%" ref="table" height="690" class="my-table">
						<el-table-column label="序号" width="60" type="index" :index="indexMethod"></el-table-column>
						<el-table-column prop="orderNo" label="订单编号" width="220" show-overflow-tooltip></el-table-column>
						<el-table-column prop="userPhone" label="用户手机号码" width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="riskType" label="风险类型" width="100" show-overflow-tooltip></el-table-column>
						<el-table-column prop="riskLevel" label="风险情况描述" width="120" show-overflow-tooltip></el-table-column>
						<el-table-column prop="complainText" label="用户投诉内容" width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="shopName" label="店铺" width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="operatorPhone" label="运营商"  width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="tradeNo" label="支付宝交易号"  width="220" show-overflow-tooltip></el-table-column>
						<el-table-column prop="complainTime" label="投诉时间"  width="150" show-overflow-tooltip></el-table-column>
						<el-table-column prop="handleStatus" label="处理状态">
								<template slot-scope="scope">
								<span style="color:#409EFF">{{scope.row.handleStatus | riskStatus}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="handleUserName" label="处理人" width="100"></el-table-column>
						<el-table-column prop="handleResult" label="处理结果"  width="160" :formatter="formatterResult"></el-table-column>
						<el-table-column prop="handleTime" label="处理时间"  width="150"></el-table-column>
						<el-table-column label="操作" width="110" fixed="right">
							<template slot-scope="scope">
                                <el-tooltip content="处理" v-if="getPerm('dal:order:aliriskHandle')" placement="top" effect="dark">
                                    <svg class="icon" aria-hidden="true" v-if="scope.row.handleStatus == 0"  @click="openRiskDialog(scope.row)">
                                        <use xlink:href="#icon-document-edit"></use>
                                    </svg>
                                </el-tooltip>
					        </template>
						</el-table-column>
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

        <!--处理-->
		<el-dialog title="处理" :visible.sync="isShowRiskgoModle" @close="isShowRiskgoModle = false" width="450px">
			<el-form class="riskgoForm" :rules="riskgoRules" :model="riskgoForm" ref="riskgoForm" label-width="125px" v-if="isShowRiskgoModle">
				<el-form-item label="选择处理结果：" class="form-item-m" prop="result">
					<el-select v-model="riskgoForm.result" placeholder="请选择" style="width: 100%;">
                        <el-option :label="name" :value="id" :key="id" v-for="(name, id) in riskResultStatus"></el-option>
                    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer btn-footer">
				<el-button type="primary" @click="handleRisk('riskgoForm')">提交</el-button>
			</div>
		</el-dialog>
	
	</section>
</template>

<script>
	import moment from 'moment';
	import { mapGetters } from 'vuex';
	import store from '@/store';
	import QBreadcrumb from '@/components/Breadcrumb';
	import Api from '@/utils/Api';
	import DataUtils from '@/utils/Data';
	import PagerMixin from '@/mixins/PagerMixin';
	import { exportExcel, DateFormat } from '@/utils/tool';
	import { riskStatus, riskTypeStatus, riskResultStatus } from '@/utils/Mapping';

	export default {
		name: 'page-help-list',
		mixins: [PagerMixin],
		data() {
			return {
				list: [], // 数据
				total: 0,
				page: 0,
                pageSize: 0,
                searchData:{},
				isShowRiskgoModle: false,
				riskid:null,
                riskgoForm:{},
                riskgoRules:{
					result: [
                        { required: true, message: '请选择处理结果', trigger: 'change' },
                    ],
				},
			};
		},
		created() {
			// 判断该用户是否有查看权限
			if(this.getPerm('dal:order:aliriskList')){
				// 时间转换
				this.searchData = Object.assign(this.searchData, this.$route.query);
				if(this.searchData.complainStartTime && this.searchData.complainEndTime) {
					this.searchData.time = [
						this.searchData.complainStartTime,
						this.searchData.complainEndTime
					];
				}
				this.getRiskList();
			}
		},
		methods: {
			//获取用户列表信息
			getRiskList() {
				let query = Object.assign({},this.$route.query);
				this.setApiParams(query);
				this.apiUrl = Api.RISK_LIST;
				this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
					this.total = resp.total;
					this.list = resp.items;
				});
			},
			formatterResult(row, column) {
				return riskResultStatus[row.handleResult];
			},
			formatterRriskStatus(row, column) {
				return riskStatus[row.handleStatus];
			},
			//根据搜索条件查询
			goSearch() {
				this.$refs.searchData.validate((valid) => {
					if(valid) {
                        let query = DataUtils.filter(this.searchData);
                        query.complainStartTime = query.time ? query.time[0] : null;
						query.complainEndTime = query.time ? query.time[1] : null;
						query.time = null;
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
            openRiskDialog(row){
				this.isShowRiskgoModle = true;
				this.riskid = row.id;
            },
			handleRisk(formName){
				this.$refs[formName].validate((valid) => {
					 if (valid) {
						let params = Object.assign({},this.riskgoForm);
						params.id = this.riskid;
                        this.$axios.post(Api.RISK_HANDLE, params).then(res => {
							this.$message({
								showClose: true,
								message: '操作成功！',
								type: 'success'
							});
							this.getRiskList();
							this.isShowRiskgoModle = false;
						});
                    }
				});
            },
            exportTable(){
				this.$refs.searchData.validate((valid) => {
					if(valid) {
						let query = DataUtils.clone(this.searchData);
						query.complainStartTime = query.time ? query.time[0] : null;
						query.complainEndTime = query.time ? query.time[1] : null;
						query.time = null;
						let start = moment(query.complainStartTime).format('YYYY/MM/DD');
						let end = moment(query.complainEndTime).format('YYYY/MM/DD');
						exportExcel(Api.RISK_EXCEL, `支付宝投诉订单.xlsx`, query);
					}
				});
			},
		},
		filters:{
            riskStatus(value){
                return riskStatus[value];
			},
        },
		computed: {
			riskStatus() {
				return riskStatus;
			},
			riskResultStatus() {
				return riskResultStatus;
			},
			...mapGetters('user', ['getPerm'])
		},
		components: {
            QBreadcrumb,
		}
	};
</script>

<style lang="less">
	.draw-textarea {
		.el-textarea__inner {
			line-height: 3.5 !important;
		}
	}
	textarea{ resize:none;}
</style>