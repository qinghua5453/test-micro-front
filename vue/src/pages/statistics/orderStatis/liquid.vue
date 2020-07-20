<template>
  <section v-if="getPerm('statis:listPayTypeOrder')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="日期：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" :picker-options="pickerOptions" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="区域：">
            <q-area v-model="searchData.areaIds" size="small" default-option="不限" />
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="searchData.shopType" size="small" placeholder="不限">
              <el-option label="不限" :value="null" />
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in shopTypeList" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <div class="chart-warp">
            <h2>洗衣液订单数</h2>
            <bar-chart :legendData="countlegend" :xAxis="countxAxis" :yAxis="countyAxis" :series="countseries"></bar-chart>
            <h2>洗衣液销售额</h2>
            <line-chart :legendData="moneylegend" :xAxis="moneyxAxis" :yAxis="moneyyAxis" :series="moneyseries"></line-chart>
            <!--表格-->
            <h2 class="table-title">
              订单支付方式数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button>
            </h2>
            <el-table :data="list" ref="list" :summary-method="getSummaries" show-summary border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="statsDate" label="日期" show-overflow-tooltip></el-table-column>
              <el-table-column prop="orderNum" label="有效订单数" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderAmount" label="订单金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderAmount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="refundAmount" label="退款金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.refundAmount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="settlementAmount" label="分账金额" show-overflow-tooltip></el-table-column>
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
import barChart from "@/components/barChart";
import lineChart from "@/components/LineChart";
import QArea from "@/components/Area";
import Api from "@/utils/Api";
import modlePageMixin from "@/mixins/modlePageMixin";
import moment from "moment";
import DataUtils from "@/utils/Data";
import { calMax, calMin, exportExcel, dateId } from "@/utils/tool";
export default {
  name: "firm-order",
  components: {
    barChart,
    lineChart,
    QArea
  },
  mixins: [modlePageMixin],
  data () {
    return {
      totalData: {},
      pageSizeOpts: [10, 30, 60],
      searchData: {
        pageSize: 10, // 分页大小
        shopType: "",
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
          let three = 366 * 24 * 3600 * 1000;
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
      shopTypeList: [], // 店铺类型
      countlegend: [
        { name: "洗衣液订单数", icon: "rect" },
      ],
      countxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      countyAxis: [
        {
          type: "value"
        }
      ],
      countseries: [
        {
          name: "洗衣液订单数",
          type: "bar",
          data: [],
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: (params) => {
                //如果值大于0 正常显示，否则不显示
                if (params.value > 0) {
                  return this.numFormat(params.value);
                } else {
                  return "";
                }
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#1890ff",
              lineStyle: {
                color: "#1890ff"
              }
            }
          }
        },
      ],
      moneylegend: [
        { name: "销售额", icon: "rect" },
        { name: "分账金额", icon: "rect" },
      ],
      moneyxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      moneyyAxis: [
        {
          type: "value"
        }
      ],
      moneyseries: [
        {
          name: "销售额",
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
          name: "分账金额",
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
              color: "#1890ff",
              lineStyle: {
                color: "#1890ff"
              }
            }
          }
        },
      ]
    };
  },
  created () {
    if (this.getPerm("statis:listPayTypeOrder")) {
      this.getShopType();
      this.getchartList();
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 2) {
          sums[index] = this.totalData.orderNum;
          return;
        }
        if (index === 3) {
          sums[index] = this.totalData.orderAmount;
          return;
        }
        if (index === 4) {
          sums[index] = this.totalData.refundAmount;
          return;
        }
        if (index === 5) {
          sums[index] = this.totalData.settlementAmount;
          return;
        }
        sums[index] = '';
      });
      this.$nextTick(() => {
        this.$refs.list.doLayout();
      });
      return sums;
    },
    // 获取店铺类型
    getShopType () {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
      });
    },
    //图表列表
    getchartList () {
      let query = Object.assign({}, this.searchData);
      query.startTime = query.time ? query.time[0] : null;
      query.endTime = query.time ? query.time[1] : null;
      query.time = null;

      let days = moment(query.endTime).diff(moment(query.startTime), 'days') ;
      if (days > 31) {
        this.searchData.time =[
          moment()
            .subtract("days", 7)
            .format("YYYY-MM-DD"),
          moment()
            .subtract("days", 1)
            .format("YYYY-MM-DD")
        ];
        this.$message.warning('时间跨度不能大于1个月');
        return false;
      }

      // 地区转换
      query.provinceCode = query.areaIds ? query.areaIds[0] : null;
      query.cityCode = query.areaIds ? query.areaIds[1] : null;
      query.districtCode = query.areaIds ? query.areaIds[2] : null;
      query.areaIds = null;
      query.page = 1;
      query.pageSize = 100;
      this.countxAxis.data = [];
      this.countseries[0].data = [];
      this.moneyxAxis.data = [];
      this.moneyseries[0].data = [];
      this.moneyseries[1].data = [];
      this.$axios.post(Api.LIQUID_PAY_STATIS, query).then(res => {
        this.total = res.total;
        this.list = res.items;
        this.totalData = res.extra;
        res.items = res.items.sort(dateId);
        res.items.forEach(item => {
          this.countxAxis.data.push(item.statsDate);
          this.countseries[0].data.push(item.orderNum);

          this.moneyxAxis.data.push(item.statsDate);
          this.moneyseries[0].data.push(item.orderAmount);
          this.moneyseries[1].data.push(item.settlementAmount);
        });
      });
    },
    //根据条件查询
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
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
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          let days = moment(query.endTime).diff(moment(query.startTime), 'days') ;
          if (days > 31) {
            this.searchData.time =[
              moment()
                .subtract("days", 7)
                .format("YYYY-MM-DD"),
              moment()
                .subtract("days", 1)
                .format("YYYY-MM-DD")
            ];
            this.$message.warning('时间跨度不能大于1个月');
            return false;
          }

          // 地区转换
          query.provinceCode = query.areaIds ? query.areaIds[0] : null;
          query.cityCode = query.areaIds ? query.areaIds[1] : null;
          query.districtCode = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          query.excel = true;
          exportExcel(Api.LIQUID_EXPORT_STATIS, `洗衣液订单统计明细.xlsx`, query);
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
