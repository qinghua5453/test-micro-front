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
          <el-form-item label="一级类型：" prop="firstTypeId">
            <el-select size="small" v-model="searchData.parentType" placeholder="不限">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in firstTypes" :key="item.id" :label="item.machineTypeName" :value="item.id">
              </el-option>
            </el-select>
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
            <h2>按支付笔数</h2>
            <bar-chart :legendData="countlegend" :xAxis="countxAxis" :yAxis="countyAxis" :series="countseries"></bar-chart>
            <h2>按支付金额</h2>
            <line-chart :legendData="moneylegend" :xAxis="moneyxAxis" :yAxis="moneyyAxis" :series="moneyseries"></line-chart>
            <!--表格-->
            <h2 class="table-title">
              订单支付方式数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button>
            </h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
              <el-table-column prop="orderValidCount" label="有效订单数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderValidCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyCount" label="销售额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.moneyCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderZhifubaoValidCount" label="支付宝笔数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderZhifubaoValidCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyZhifubaoCount" label="支付宝金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.moneyZhifubaoCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderWeixinValidCount" label="微信笔数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderWeixinValidCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyWeixinCount" label="微信金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.moneyWeixinCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderYueValidCount" label="余额笔数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderYueValidCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyYueCount" label="余额金额" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.moneyYueCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="moneyPerOrder" label="客单价" show-overflow-tooltip></el-table-column>
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
import { calMax, calMin, exportExcel, ortId } from "@/utils/tool";
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
      shopTypeList: [], // 店铺类型
      firstTypes: [], // 一级类型
      countlegend: [
        { name: "支付宝支付数", icon: "rect" },
        { name: "微信支付数", icon: "rect" },
        { name: "余额支付数", icon: "rect" }
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
          name: "支付宝支付数",
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
        {
          name: "微信支付数",
          type: "bar",
          data: [],
          stack: "总量",
          label: {
            normal: {
              show: false,
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
              color: "#3CB035",
              lineStyle: {
                color: "#3CB035"
              }
            }
          }
        },
        {
          name: "余额支付数",
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
              color: "#FA834E",
              lineStyle: {
                color: "#FA834E"
              }
            }
          }
        }
      ],
      moneylegend: [
        { name: "销售额", icon: "rect" },
        { name: "支付宝收入", icon: "rect" },
        { name: "微信收入", icon: "rect" }
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
          name: "支付宝收入",
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
        {
          name: "微信收入",
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
              color: "#3CB035",
              lineStyle: {
                color: "#3CB035"
              }
            }
          }
        }
      ]
    };
  },
  created () {
    if (this.getPerm("statis:listPayTypeOrder")) {
      this.getShopType();
      this.getMachineType();
      this._getList();
      this.getchartList();
    }
  },
  methods: {
    // 获取店铺类型
    getShopType () {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
      });
    },
    //获取二级类型
    getMachineType () {
      return this.$axios
        .post(Api.MACHINE_GETTYPELIST, { parentId: 0 })
        .then(resp => {
          this.firstTypes = resp;
        });
    },
    //图表列表
    getchartList () {
      let query = Object.assign({}, this.searchData);
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      // 地区转换
      query.province = query.areaIds ? query.areaIds[0] : null;
      query.city = query.areaIds ? query.areaIds[1] : null;
      query.district = query.areaIds ? query.areaIds[2] : null;
      query.areaIds = null;
      query.page = 1;
      query.pageSize = 100;
      this.countxAxis.data = [];
      this.countseries[0].data = [];
      this.countseries[1].data = [];
      this.countseries[2].data = [];
      this.moneyxAxis.data = [];
      this.moneyseries[0].data = [];
      this.moneyseries[1].data = [];
      this.moneyseries[2].data = [];
      this.$axios.post(Api.ORDER_PAY_STATIS, query).then(res => {
        res.items = res.items.sort(ortId);
        res.items.forEach(item => {
          this.countxAxis.data.push(item.date);
          this.countseries[0].data.push(item.orderZhifubaoValidCount);
          this.countseries[1].data.push(item.orderWeixinValidCount);
          this.countseries[2].data.push(item.orderYueValidCount);

          this.moneyxAxis.data.push(item.date);
          this.moneyseries[0].data.push(item.moneyCount);
          this.moneyseries[1].data.push(item.moneyZhifubaoCount);
          this.moneyseries[2].data.push(item.moneyWeixinCount);
        });
      });
    },
    //明细列表
    _getList () {
      let query = Object.assign({}, this.searchData);
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      // 地区转换
      query.province = query.areaIds ? query.areaIds[0] : null;
      query.city = query.areaIds ? query.areaIds[1] : null;
      query.district = query.areaIds ? query.areaIds[2] : null;
      query.areaIds = null;
      this.$axios.post(Api.ORDER_PAY_STATIS, query).then(res => {
        this.total = res.total;
        this.list = res.items;
      });
    },
    //根据条件查询
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          this._getList();
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
          // 地区转换
          query.province = query.areaIds ? query.areaIds[0] : null;
          query.city = query.areaIds ? query.areaIds[1] : null;
          query.district = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          query.excel = true;
          exportExcel(Api.ORDER_PAY_STATIS, `订单支付方式数据明细.xlsx`, query);
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
