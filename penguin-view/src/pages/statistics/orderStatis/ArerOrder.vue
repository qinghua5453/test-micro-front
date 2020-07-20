
<template>
  <section v-if="getPerm('statis:listAreaValidOrder')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="日期：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" :picker-options="pickerOptions" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择区域查询方式:">
            <el-select size="small" v-model="searchData.type" @change="changeway" style="width: 140px;" placeholder="不限">
              <el-option value="1" label="按省排行"></el-option>
              <el-option value="2" label="按市排行"></el-option>
              <el-option value="3" label="查询具体省市"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：" v-if="isshowCity">
            <el-select size="small" v-model="searchData.province" @change="changearea($event, 0)" placeholder="不限" style="width: 140px;">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in provincelist" :key="item.id" :label="item.areaName" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="small" v-model="searchData.city" @change="changecity($event, 0)" placeholder="不限" style="width: 140px;">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in citylist" :key="item.id" :label="item.areaName" :value="item.id">
              </el-option>
            </el-select>
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
              <el-option value="" label="全部">全部</el-option>
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
            <h2><span>{{title}}</span></h2>
            <bar-chart :grid="grid" :xAxis="areaxAxis" :yAxis="areayAxis" :series="areaseries"></bar-chart>
            <!--表格-->
            <h2 class="table-title">
              <span>{{detailTitle}}</span>
              <el-button type="primary" class="export-xsl" @click="exportTable">导出</el-button>
            </h2>
            <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="648">
              <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="name" label="区域" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="count" label="订单数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.count | numFormat}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
import barChart from "@/components/barChart";
import Api from "@/utils/Api";
import moment from "moment";
import DataUtils from "@/utils/Data";
import { calMax, calMin, exportExcel } from "@/utils/tool";
export default {
  name: "firm-order",
  components: {
    barChart
  },
  data () {
    return {
      list: [], // 数据
      isshowCity: false,
      title: "省订单数排行",
      detailTitle: "省订单数明细",
      searchData: {
        type: "1",
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
      provincelist: [],
      citylist: [],
      grid: {
        left: "8%", //默认是80px
        right: "0%", //默认是60px
        top: "8%", //默认80px
        bottom: "25%" //默认60px
      },
      areaxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: 40
        }
      },
      areayAxis: [
        {
          type: "value"
        }
      ],
      areaseries: [
        {
          name: "新用户订单",
          type: "bar",
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
    if (this.getPerm("statis:listAreaValidOrder")) {
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
      this.$axios.post(Api.MACHINE_GETTYPELIST, { parentId: 0 }).then(resp => {
        this.firstTypes = resp;
      });
    },
    //获取二级类型
    getArea () {
      this.$axios.post(Api.AREA_LIST, { parentId: 0 }).then(resp => {
        this.provincelist = resp;
      });
    },
    //图表列表
    getchartList () {
      let query = DataUtils.clone(this.searchData);
      // 时间转换
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      this.areaxAxis.data = [];
      this.areaseries[0].data = [];
      this.$axios.post(Api.ORDER_AREA_STATIS, query).then(res => {
        res.forEach(item => {
          this.areaxAxis.data.push(item.name);
          this.areaseries[0].data.push(item.count);
        });
      });
    },
    //列表
    _getList () {
      let query = DataUtils.clone(this.searchData);
      // 时间转换
      query.startDate = query.time ? query.time[0] : null;
      query.endDate = query.time ? query.time[1] : null;
      query.time = null;
      this.$axios.post(Api.ORDER_AREA_STATIS, query).then(res => {
        this.list = res;
      });
    },
    //根据条件查询店铺列表信息
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          if (Number(this.searchData.type) === 1) {
            this.title = "省订单数排行";
            this.detailTitle = "省订单数明细";
          }
          if (Number(this.searchData.type) === 2) {
            this.title = "城市订单数排行";
            this.detailTitle = "城市订单数明细";
          }
          if (Number(this.searchData.type) === 3) {
            if (!this.searchData.province) {
              this.$message({ message: "请选择省", type: "warning" });
              return false;
            } else {
              if (this.searchData.province && this.searchData.city) {
                this.title = `${this.searchData.provinceName}-${
                  this.searchData.cityName
                  }订单排行`;
                this.detailTitle = `${this.searchData.provinceName}-${
                  this.searchData.cityName
                  }订单数明细`;
              } else {
                this.title = `${this.searchData.provinceName}订单排行`;
                this.detailTitle = `${this.searchData.provinceName}订单数明细`;
              }
            }
          }
          this._getList();
          this.getchartList();
        }
      });
    },
    changeway (val) {
      Number(val) === 3 ? (this.isshowCity = true) : (this.isshowCity = false);
      if (Number(val) === 3) {
        this.getArea();
      } else {
        this.$set(this.searchData, "province", null);
        this.$set(this.searchData, "provinceName", null);
        this.$set(this.searchData, "city", null);
        this.$set(this.searchData, "cityName", null);
      }
    },
    changearea () {
      this.$set(this.searchData, "city", null);
      if (this.searchData.province) {
        this.$axios
          .post(Api.AREA_LIST, { parentId: this.searchData.province })
          .then(resp => {
            this.citylist = resp;
          });
        this.searchData.provinceName = event.target.innerText;
      }
    },
    changecity () {
      this.searchData.cityName = event.target.innerText;
    },
    exportTable () {
      //导出
      this.$refs.searchData.validate(valid => {
        if (valid) {
          let query = DataUtils.clone(this.searchData);
          // 时间转换
          query.startDate = query.time ? query.time[0] : null;
          query.endDate = query.time ? query.time[1] : null;
          query.time = null;
          query.excel = true;
          exportExcel(
            Api.ORDER_AREA_STATIS,
            `${this.detailTitle}${query.startDate}-${query.endDate}.xlsx`,
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
