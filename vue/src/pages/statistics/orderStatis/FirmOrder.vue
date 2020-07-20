
<template>
  <section v-if="getPerm('statis:listValidOrder')">
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
          <el-form-item label="通信类型：">
            <el-select size="small" v-model="searchData.communicateType" style="width: 140px;" placeholder="不限">
              <el-option label="不限" :value="null" />
              <el-option value="0" label="脉冲"></el-option>
              <el-option value="1" label="串口"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <div class="chart-warp">
            <h2>有效订单数据</h2>
            <h3>（有效订单是指订单状态≠未支付或已失效的全部订单）</h3>
            <line-chart :legendData="lgendData" :grid="grid" :xAxis="xAxis" :yAxis="yAxis" :series="srseries"></line-chart>
            <!--表格-->
            <h2 class="table-title">有效订单数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button>
            </h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" :index="indexMethod" width="60" type="index" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="date" label="日期" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderCount" label="日总订单" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderValidCount" label="日有效订单" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderValidCount | numFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="有效订单占比" show-overflow-tooltip>
              </el-table-column>
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
  name: "firm-order",
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
      shopTypeList: [], // 店铺类型
      firstTypes: [], // 一级类型
      lgendData: [
        { name: "日总订单", icon: "rect" },
        { name: "日有效订单", icon: "rect" },
        { name: "有效订单占比", icon: "rect" }
      ],
      grid: {
        left: "8%", //默认是80px
        right: "5%", //默认是60px
        top: "8%", //默认80px
        bottom: "18%" //默认60px
      },
      xAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: [
        {
          type: "value",
          splitNumber: 5
        },
        {
          type: "value",
          min: 0,
          max: 100,
          splitNumber: 5,
          axisLabel: {
            textStyle: { color: "#666" },
            formatter: function (value) {
              return value + "%";
            }
          }
        }
      ],
      srseries: [
        {
          name: "日总订单",
          type: "line",
          data: [],
          yAxisIndex: 0,
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
          name: "日有效订单",
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
              color: "#FACC14",
              lineStyle: {
                color: "#FACC14"
              }
            }
          }
        },
        {
          name: "有效订单占比",
          type: "line",
          data: [],
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value + "%";
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
      ]
    };
  },
  created () {
    if (this.getPerm("statis:listValidOrder")) {
      this.getShopType();
      this.getfirmorderType();
      this._getList();
      this.getchartList();
    }
  },
  methods: {
    // 获取店铺类型
    getShopType () {
      this.$axios.post(Api.GET_SHOP_TYPE).then(res => {
        this.shopTypeList = res;
      });
    },
    //获取一级类型
    getfirmorderType () {
      return this.$axios
        .post(Api.MACHINE_GETTYPELIST, { parentId: 0 })
        .then(res => {
          this.firstTypes = res;
        });
    },
    // 给table添加序号
    indexMethod (index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
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
      this.xAxis.data = [];
      this.srseries[0].data = [];
      this.srseries[1].data = [];
      this.srseries[2].data = [];
      this.$axios.post(Api.ORDER_STATIS_LIST, query).then(res => {
        res.items = res.items.sort(ortId);
        res.items.forEach(item => {
          this.xAxis.data.push(item.date);
          this.srseries[0].data.push(item.orderCount);
          this.srseries[1].data.push(item.orderValidCount);
          // let temp = ((item.orderValidCount/item.orderCount)*100).toFixed(2)
          // temp = isNaN(temp)?0:temp
          let temp = item.percent.replace("%", "");
          this.srseries[2].data.push(temp);
        });
        let concatData = [...this.srseries[0].data, ...this.srseries[1].data];
        let newOrderMax = calMax(concatData) > 0 ? calMax(concatData) : 1; //订单Y轴最大值
        let newOrderMin = calMin(concatData);
        this.$set(this.yAxis[0], "max", newOrderMax);
        this.$set(this.yAxis[0], "min", newOrderMin);
        this.$set(this.yAxis[0], "interval", (newOrderMax - newOrderMin) / 5);
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
      this.$axios.post(Api.ORDER_STATIS_LIST, query).then(res => {
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
          exportExcel(
            Api.ORDER_STATIS_LIST,
            `有效订单数据明细${query.startDate}-${query.endDate}.xlsx`,
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
