
<template>
  <section v-if="getPerm('statis:listAddUser')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="日期：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" :picker-options="pickerOptions" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <div class="chart-warp">
            <h2>新增用户数据</h2>
            <h3>（新增用户即新注册的用户）</h3>
            <line-chart :id="newuser" style="width:100%;" :legendData="lgendData" :xAxis="xAxis" :yAxis="yAxis" :series="series"></line-chart>
            <!--表格-->
            <h2 class="table-title">新增用户数据明细<el-button type="primary" class="export-xsl" @click="exportTable()">导出</el-button>
            </h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="409">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
              <el-table-column prop="userAddCount" label="新增用户数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.userAddCount | numFormat}}</span>
                </template>
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
      newuser: "newuser",
      lgendData: [{ name: "新增用户", icon: "rect" }],
      xAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "新增用户",
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
        }
      ]
    };
  },
  created () {
    if (this.getPerm("statis:listAddUser")) {
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
      this.series[0].data = [];
      this.$axios.post(Api.USER_NEW_USER_STATIS, query).then(res => {
        res.items = res.items.sort(ortId);
        res.items.forEach(item => {
          this.xAxis.data.push(item.date);
          this.series[0].data.push(item.userAddCount);
        });
      });
    },
    //明细列表
    _getList () {
      let query = Object.assign({}, this.searchData);
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      this.$axios.post(Api.USER_NEW_USER_STATIS, query).then(res => {
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
          query.excel = true;
          exportExcel(
            Api.USER_NEW_USER_STATIS,
            `新增用户数据明细${query.startDate}-${query.endDate}.xlsx`,
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
