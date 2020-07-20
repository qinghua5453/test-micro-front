<template>
  <section v-if="getPerm('statis:listFrequencyUser')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="日期：">
            <el-date-picker
              size="small"
              v-model="searchData.time"
              type="daterange"
              align="right"
              :picker-options="pickerOptions"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="一级类型：" prop="firstTypeId">
            <el-select size="small" v-model="searchData.parentType" @change="changeType($event, 1)" placeholder="不限">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in firstTypes" :key="item.id" :label="item.machineTypeName" :data-name="item.machineTypeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <div class="chart-warp">
            <h2>用户频次数据</h2>
            <h3>（用户频次是指每个用户使用设备的平均次数，按近7天有效订单数/近7天内下单用户数进行统计（按设备类型））</h3>
            <line-chart :legendData="lgendData" :xAxis="xAxis" :yAxis="yAxis" :series="series"></line-chart>
            <!--表格-->
            <h2 class="table-title">用户频次数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button></h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
              <el-table-column prop="total" label="总体" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '洗衣机'" prop="clothes" label="洗衣机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '吹风机'" prop="wind" label="吹风机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '充电桩'" prop="charge" label="充电桩" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '烘干机'" prop="dryer" label="烘干机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '洗鞋机'" prop="shoe" label="洗鞋机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '咖啡机'" prop="cafe" label="咖啡机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '饮水机'" prop="water" label="饮水机" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="showtable === '不限' || showtable === '空调'" prop="air" label="空调" show-overflow-tooltip></el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
              <div class="block">
                <el-pagination
                  v-show="pageShow"
                  @size-change="pageSizeChange"
                  @current-change="currentChange"
                  :current-page="searchData.page"
                  :page-sizes="pageSizeOpts"
                  :page-size="searchData.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex';
import lineChart from '@/components/LineChart';
import QArea from '@/components/Area';
import Api from '@/utils/Api';
import modlePageMixin from '@/mixins/modlePageMixin';
import moment from 'moment';
import DataUtils from '@/utils/Data';
import { calMax, calMin, exportExcel, ortId } from '@/utils/tool';
  export default {
    name: 'new-user',
    components:{
        lineChart,
        QArea
    },
    mixins: [modlePageMixin],
    data () {
        return {
            firstTypes: [], // 一级类型
            pageSizeOpts: [10, 30, 60],
            searchData:{
                pageSize: 10,    // 分页大小
                time:[moment().subtract('days',7).format('YYYY-MM-DD'),moment().subtract('days',1).format('YYYY-MM-DD')]
            },
            pickerOptions: {
                disabledDate(time) {
                    let now = new Date();
                    let curDate = new Date().getTime();
                    let three = 91 * 24 * 3600 * 1000;
                    let threeMonths = curDate - three;
                    let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1, 0, 0, 0).getTime();
                    return time.getTime() > yesterday || time.getTime() < threeMonths;
                },
			},
			showtable:'不限',
			changeParentType:'不限',
            lgendData:[],
            alllgendData:[
				{name:'总体',icon:'rect'},
				{name:'洗衣机',icon:'rect'},
				{name:'吹风机',icon:'rect'},
				{name:'充电桩',icon:'rect'},
				{name:'烘干机',icon:'rect'},
				{name:'洗鞋机',icon:'rect'},
				{name:'咖啡机',icon:'rect'},
				{name:'饮水机',icon:'rect'},
				{name:'空调',icon:'rect'},
			],
			xAxis: {
				data: [],
				axisTick: {
                    alignWithLabel: true
                },
			},
			yAxis: [
                {
                    type: 'value',
				},
			],
			allseries: [
				{
					name:'总体',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#f00",
							lineStyle: {
								color: "#f00",
							}
						}
					},
				},
				{
					name:'洗衣机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#6CCAC9",
							lineStyle: {
								color: "#6CCAC9",
							}
						}
					},
				},
				{
					name:'吹风机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#FFBA00",
							lineStyle: {
								color: "#FFBA00",
							}
						}
					},
				},
				{
					name:'充电桩',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#57C8F2",
							lineStyle: {
								color: "#57C8F2",
							}
						}
					},
				},
				{
					name:'烘干机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#FA834E",
							lineStyle: {
								color: "#FA834E",
							}
						}
					},
				},
				{
					name:'洗鞋机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#00BE1F",
							lineStyle: {
								color: "#00BE1F",
							}
						}
					},
				},
				{
					name:'咖啡机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#97B534",
							lineStyle: {
								color: "#97B534",
							}
						}
					},
				},
				{
					name:'饮水机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#8D98B3",
							lineStyle: {
								color: "#8D98B3",
							}
						}
					},
				},
				{
					name:'空调',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#D87C7C",
							lineStyle: {
								color: "#D87C7C",
							}
						}
					},
				},
			],
			series:[
				{
					name:'总体',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#f00",
							lineStyle: {
								color: "#f00",
							}
						}
					},
				},
				{
					name:'洗衣机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#6CCAC9",
							lineStyle: {
								color: "#6CCAC9",
							}
						}
					},
				},
			],
			newseries:[
				{
					name:'总体',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#f00",
							lineStyle: {
								color: "#f00",
							}
						}
					},
				},
				{
					name:'洗衣机',
					type:'line',
					data:[],
					label: {
						normal: {
							show: true,
							position: 'top'
						}
					},
					itemStyle: {
						normal: {
							color: "#6CCAC9",
							lineStyle: {
								color: "#6CCAC9",
							}
						}
					},
				}
			]
        };
    },
    created(){
		if(this.getPerm('statis:listFrequencyUser')){
			this.getMachineType();
			this._getList();
			this.getchartList();
		}
    },
    methods:{
         //获取一级类型
        getMachineType() {
            return this.$axios.post(Api.MACHINE_GETTYPELIST, {parentId: 0}).then(resp => {
                this.firstTypes = resp;
            });
		},
		changeType(ev){
			this.changeParentType = event.target.innerText;
		},
        //图表列表
        getchartList() {
            let query = Object.assign({},this.searchData);
            query.startDate = query.time ? query.time[0] : null;
            query.endDate = query.time ? query.time[1] : null;
            query.time = null;
            query.page = 1;
            query.pageSize = 100;
            this.xAxis.data = [];
			this.series[0].data = [];
			this.series[1].data = [];
            this.$axios.post(Api.USER_FREQUENCY_STATIS,query).then(res => {
				this.showtable = this.changeParentType;
				res.items =  res.items.sort(ortId);
				if(this.changeParentType==='洗衣机'){
                    res.items.forEach(item => {
						this.xAxis.data.push(item.date);
                        this.series[0].data.push(item.total);
                        this.series[1].data.push(item.clothes);
                    });
                }else if(this.changeParentType==='吹风机'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.wind);
					});
                }else if(this.changeParentType==='充电桩'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.charge);
					});
                }else if(this.changeParentType==='烘干机'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.dryer);
					});
                }else if(this.changeParentType==='洗鞋机'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.shoe);
					});
                }else if(this.changeParentType==='咖啡机'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.cafe);
					});
                }else if(this.changeParentType==='饮水机'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.water);
					});
                }else if(this.changeParentType==='空调'){
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.air);
					});
                }else if(this.changeParentType === '不限'||!this.changeParentType){
					this.lgendData = this.alllgendData;
					this.series = this.allseries;
					this.series[0].data = [];
					this.series[1].data = [];
					this.series[2].data = [];
					this.series[3].data = [];
					this.series[4].data = [];
					this.series[5].data = [];
					this.series[6].data = [];
					this.series[7].data = [];
					this.series[8].data = [];
					res.items.forEach(item => {
						this.xAxis.data.push(item.date);
						this.series[0].data.push(item.total);
						this.series[1].data.push(item.clothes);
						this.series[2].data.push(item.wind);
						this.series[3].data.push(item.charge);
						this.series[4].data.push(item.dryer);
						this.series[5].data.push(item.shoe);
						this.series[6].data.push(item.cafe);
						this.series[7].data.push(item.water);
						this.series[8].data.push(item.air);
					});
				}
            });
        },
        //明细列表
        _getList() {
            let query = Object.assign({},this.searchData);
            query.startDate = query.time ? query.time[0] : null;
            query.endDate = query.time ? query.time[1] : null;
            query.time = null;
            this.$axios.post(Api.USER_FREQUENCY_STATIS,query).then(res => {
                this.total = res.total;
				this.list = res.items;
            });
        },
        //根据条件查询
        goSearch() {
            this.$refs.searchData.validate((valid) => {
                if(valid) {
					this._getList();
                    if(this.changeParentType==='洗衣机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'洗衣机',icon:'rect'}];
						this.$set(this.newseries[1],'name','洗衣机');
						let itemStyle = {
							normal: {
								color: "#6CCAC9",
								lineStyle: {
									color: "#6CCAC9",
								}
							}
						};
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='吹风机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'吹风机',icon:'rect'}];
                        this.$set(this.newseries[1],'name','吹风机');
                        let itemStyle = {
							normal: {
								color: "#FFBA00",
								lineStyle: {
									color: "#FFBA00",
								}
							}
						};
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='充电桩'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'充电桩',icon:'rect'}];
                        this.$set(this.newseries[1],'name','充电桩');
                        let itemStyle = {
                            normal: {
                                color: "#57C8F2",
								lineStyle: {
									color: "#57C8F2",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='烘干机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'烘干机',icon:'rect'}];
                        this.$set(this.newseries[1],'name','烘干机');
                        let itemStyle = {
                            normal: {
                                color: "#FA834E",
								lineStyle: {
									color: "#FA834E",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='洗鞋机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'洗鞋机',icon:'rect'}];
                        this.$set(this.newseries[1],'name','洗鞋机');
                        let itemStyle = {
                            normal: {
                                color: "#00BE1F",
								lineStyle: {
									color: "#00BE1F",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
					}else if(this.changeParentType==='咖啡机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'咖啡机',icon:'rect'}];
                        this.$set(this.newseries[1],'name','咖啡机');
                        let itemStyle = {
                            normal: {
                                color: "#97B534",
								lineStyle: {
									color: "#97B534",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='饮水机'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'饮水机',icon:'rect'}];
                        this.$set(this.newseries[1],'name','饮水机');
                        let itemStyle = {
                            normal: {
                                color: "#8D98B3",
								lineStyle: {
									color: "#8D98B3",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
                    }else if(this.changeParentType==='空调'){
                        this.lgendData = [{name:'总体',icon:'rect'}, {name:'空调',icon:'rect'}];
                        this.$set(this.newseries[1],'name','空调');
                        let itemStyle = {
                            normal: {
                                color: "#D87C7C",
								lineStyle: {
									color: "#D87C7C",
								}
                            }
                        };
                        this.$set(this.newseries[1],'itemStyle',itemStyle);
                        this.series = this.newseries;
					}
                    this.getchartList();
                }
            });
        },
        exportTable(){//导出
            this.$refs.searchData.validate((valid) => {
                if(valid) {
                    // 时间转换
                    let query = DataUtils.clone(this.searchData);
                    query.startDate = query.time ? query.time[0] : null;
                    query.endDate = query.time ? query.time[1] : null;
                    query.time = null;
                    query.excel = true;
                    exportExcel(Api.USER_FREQUENCY_STATIS, `用户频次数据明细${query.startDate}-${query.endDate}.xlsx`, query);
                }
            });
        },
	},
	computed: {
        ...mapGetters('user', ['getPerm'])
    },
  };
</script>

<style lang="less" scoped type="text/css">
.chart-warp {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  h2 {
    height: 50px;
    line-height: 50px;
    position: relative;
  }
  h3 {
    font-size: 12px;
    color: #999;
    padding-bottom: 15px;
  }
  .table-title {
    margin-top: 40px;
  }
  .export-xsl {
    position: absolute;
    right: 0;
    top: 6px;
  }
}
@media screen and (max-width: 1336px) {
  .chart-warp {
    width: 90% !important;
  }
}
</style>
