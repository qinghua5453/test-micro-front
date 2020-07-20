
<template>
  <section v-if="getPerm('statis:listActiveUser')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="日期：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" :picker-options="pickerOptions" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="统计周期:">
            <el-select size="small" v-model="searchData.period" style="width: 140px;" placeholder="不限">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="当日"></el-option>
              <el-option value="7" label="7天内"></el-option>
              <el-option value="15" label="15天内"></el-option>
              <el-option value="30" label="30天内"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <div class="chart-warp">
            <h2>活跃用户数据</h2>
            <h3>（活跃用户是指有订单产生的用户）</h3>
            <line-chart :legendData="lgendData" :grid="grid" :xAxis="xAxis" :yAxis="yAxis" :series="series"></line-chart>
            <!--表格-->
            <h2 class="table-title">活跃用户数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button>
            </h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="Number(showtable)!==7&&Number(showtable)!==15&&Number(showtable)!==30" prop="userActiveCount" label="当日活跃用户" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.userActiveCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="Number(showtable)!==7&&Number(showtable)!==15&&Number(showtable)!==30" prop="userActiveRatio" label="当日活跃率" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==15&&Number(showtable)!==30" prop="userActive7Count" label="7日活跃用户" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.userActive7Count | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==15&&Number(showtable)!==30" prop="userActive7Ratio" label="7日活跃率" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==7&&Number(showtable)!==30" prop="userActive15Count" label="15日活跃用户" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.userActive15Count | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==7&&Number(showtable)!==30" prop="userActive15Ratio" label="15日活跃率" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==7&&Number(showtable)!==15" prop="userActive30Count" label="30日活跃用户" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.userActive30Count | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="Number(showtable)!==1&&Number(showtable)!==7&&Number(showtable)!==15" prop="userActive30Ratio" label="30日活跃率" show-overflow-tooltip></el-table-column>
            </el-table>
            <!--分页-->
            <el-col :span="24" class="toolbar">
              <div class="block">
                <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </div>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
import lineChart from "@/components/LineChart";
import QArea from "@/components/Area";
import Api from "@/utils/Api";
import modlePageMixin from "@/mixins/modlePageMixin";
import moment from "moment";
import DataUtils from "@/utils/Data";
import { calMax, calMin, exportExcel, ortId } from "@/utils/tool";
export default {
  name: "new-user",
  components: {
    lineChart,
    QArea
  },
  mixins: [modlePageMixin],
  data () {
    return {
      pageSizeOpts: [10, 30, 60],
      searchData: {
        pageSize: 10, // 分页大小
        time: [
          moment()
            .subtract("days", 7)
            .format("YYYY-MM-DD"),
          moment()
            .subtract("days", 1)
            .format("YYYY-MM-DD")
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          let now = new Date();
          let curDate = new Date().getTime();
          let three = 91 * 24 * 3600 * 1000;
          let threeMonths = curDate - three;
          let yesterday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1,
            0,
            0,
            0
          ).getTime();
          return time.getTime() > yesterday || time.getTime() < threeMonths;
        }
      },
      showtable: 0, //显示列
      lgendData: [],
      alllgendData: [
        { name: "当日活跃用户", icon: "rect" },
        { name: "7日活跃用户", icon: "rect" },
        { name: "15日活跃用户", icon: "rect" },
        { name: "30日活跃", icon: "rect" }
      ],
      xAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      grid: {
        left: "8%", //默认是80px
        right: "0%", //默认是60px
        top: "8%", //默认80px
        bottom: "18%" //默认60px
      },
      yAxis: [
        {
          type: "value"
        }
      ],
      allseries: [
        {
          name: "当日活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#6CCAC9",
              lineStyle: {
                color: "#6CCAC9"
              }
            }
          }
        },
        {
          name: "7日活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#FFBA00",
              lineStyle: {
                color: "#FFBA00"
              }
            }
          }
        },
        {
          name: "15日活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#57C8F2",
              lineStyle: {
                color: "#57C8F2"
              }
            }
          }
        },
        {
          name: "30日活跃",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#FA834E",
              lineStyle: {
                color: "#FA834E"
              }
            }
          }
        }
      ],
      series: [
        {
          name: "当日活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#6CCAC9",
              lineStyle: {
                color: "#6CCAC9"
              }
            }
          }
        }
      ],
      newseries: [
        {
          name: "当日活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.numFormat(params.value);
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#6CCAC9",
              lineStyle: {
                color: "#6CCAC9"
              }
            }
          }
        }
      ]
    };
  },
  created () {
    if (this.getPerm("statis:listActiveUser")) {
      this._getList();
      this.getchartList();
    }
  },
  methods: {
    //图表列表
    getchartList () {
      let query = Object.assign({}, this.searchData);
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      query.page = 1;
      query.pageSize = 100;
      this.xAxis.data = [];
      this.$axios.post(Api.USER_ACTIVE_STATIS, query).then(res => {
        this.showtable = query.period;
        res.items = res.items.sort(ortId);
        if (Number(query.period) === 1) {
          this.series[0].data = [];
          res.items.forEach(item => {
            this.xAxis.data.push(item.date);
            this.series[0].data.push(item.userActiveCount);
          });
        } else if (Number(query.period) === 7) {
          this.series[0].data = [];
          res.items.forEach(item => {
            this.xAxis.data.push(item.date);
            this.series[0].data.push(item.userActive7Count);
          });
        } else if (Number(query.period) === 15) {
          this.series[0].data = [];
          res.items.forEach(item => {
            this.xAxis.data.push(item.date);
            this.series[0].data.push(item.userActive15Count);
          });
        } else if (Number(query.period) === 30) {
          this.series[0].data = [];
          res.items.forEach(item => {
            this.xAxis.data.push(item.date);
            this.series[0].data.push(item.userActive30Count);
          });
        } else {
          this.lgendData = this.alllgendData;
          this.series = this.allseries;
          this.series[0].data = [];
          this.series[1].data = [];
          this.series[2].data = [];
          this.series[3].data = [];
          res.items.forEach(item => {
            this.xAxis.data.push(item.date);
            this.series[0].data.push(item.userActiveCount);
            this.series[1].data.push(item.userActive7Count);
            this.series[2].data.push(item.userActive15Count);
            this.series[3].data.push(item.userActive30Count);
          });
        }
      });
    },
    //明细列表
    _getList () {
      let query = Object.assign({}, this.searchData);
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      this.$axios.post(Api.USER_ACTIVE_STATIS, query).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    //根据条件查询
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          this._getList();
          let query = Object.assign({}, this.searchData);
          if (Number(query.period) === 1) {
            this.lgendData = [{ name: "当日活跃用户", icon: "rect" }];
            this.$set(this.series[0], "name", "当日活跃用户");
            this.series = this.newseries;
          } else if (Number(query.period) === 7) {
            this.lgendData = [{ name: "7日活跃用户", icon: "rect" }];
            this.$set(this.newseries[0], "name", "7日活跃用户");
            let itemStyle = {
              normal: {
                color: "#FFBA00",
                lineStyle: {
                  color: "#FFBA00"
                }
              }
            };
            this.$set(this.newseries[0], "itemStyle", itemStyle);
            this.series = this.newseries;
          } else if (Number(query.period) === 15) {
            this.lgendData = [{ name: "15日活跃用户", icon: "rect" }];
            this.$set(this.newseries[0], "name", "15日活跃用户");
            let itemStyle = {
              normal: {
                color: "#57C8F2",
                lineStyle: {
                  color: "#57C8F2"
                }
              }
            };
            this.$set(this.newseries[0], "itemStyle", itemStyle);
            this.series = this.newseries;
          } else if (Number(query.period) === 30) {
            this.lgendData = [{ name: "30日活跃用户", icon: "rect" }];
            this.$set(this.newseries[0], "name", "30日活跃用户");
            let itemStyle = {
              normal: {
                color: "#FA834E",
                lineStyle: {
                  color: "#FA834E"
                }
              }
            };
            this.$set(this.newseries[0], "itemStyle", itemStyle);
            this.series = this.newseries;
          } else {
            this.lgendData = this.alllgendData;
            this.series = this.allseries;
          }
          this.getchartList();
        }
      });
    },
    exportTable () {
      //导出
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startDate = query.time ? query.time[0] : null;
          query.endDate = query.time ? query.time[1] : null;
          query.time = null;
          query.excel = true;
          exportExcel(
            Api.USER_ACTIVE_STATIS,
            `活跃用户数据明细${query.startDate}-${query.endDate}.xlsx`,
            query
          );
        }
      });
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  }
};
</script>

<style lang='less' scoped type='text/css'>
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
</style>
