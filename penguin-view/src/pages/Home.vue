<template>
  <section class="homepage-wrap">
    <q-breadcrumb :data="['实时核心数据一览']" />
    <section class="home-board demo-form-inline">
      <div class="boder-wrap">
        <p class="order-title">
          <svg class="icon" aria-hidden="true" style="color:#00A0E8">
            <use xlink:href="#icon-icon"></use>
          </svg>
          <span>订单数据</span>
        </p>
        <ul class="border-list">
          <li>
            <p class="title">
              今日订单数
              <el-tooltip content="今天发生的除未支付和已失效之外的订单，也即有效订单（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.order).includes('--')">{{totaldata.order | numFormat}}</span>
              <span v-if="!String(totaldata.orderIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.orderIncreaseRate).includes('+'),'reduce-num':String(totaldata.orderIncreaseRate).includes('-')}]">
                {{totaldata.orderIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.orderIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.orderIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              总订单数
              <el-tooltip content="历史发生的所有有效订单数（含今日）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.order).includes('--')">{{totaldata.totalOrder | numFormat}}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="boder-wrap user-data">
        <p class="order-title">
          <svg class="icon" aria-hidden="true" style="color:#FFBA00">
            <use xlink:href="#icon-icon"></use>
          </svg>
          <span>用户数据</span>
        </p>
        <ul class="border-list">
          <li>
            <p class="title">
              今日新增用户数
              <el-tooltip content="今日新注册用户数（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.addUser).includes('--')">{{totaldata.addUser | numFormat}}</span>
              <span v-if="!String(totaldata.addUserIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.addUserIncreaseRate).includes('+'),'reduce-num':String(totaldata.addUserIncreaseRate).includes('-')}]">
                {{totaldata.addUserIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.addUserIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.addUserIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              今日活跃用户数
              <el-tooltip content="今日有订单发生的所有去重用户数（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.activeUser).includes('--')">{{totaldata.activeUser | numFormat}}</span>
              <span v-if="!String(totaldata.activeUserIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.activeUserIncreaseRate).includes('+'),'reduce-num':String(totaldata.activeUserIncreaseRate).includes('-')}]">
                {{totaldata.activeUserIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.activeUserIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.activeUserIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              总用户数
              <el-tooltip content="总注册用户数（含今日）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.totalUser).includes('--')">{{totaldata.totalUser | numFormat}}</span>
            </p>
          </li>
          <li>
            <p class="title">
              用户频次
              <el-tooltip content="用户频次=有效订单数/去重下单用户数（近7日）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.orderWeekPerUser).includes('--')">{{totaldata.orderWeekPerUser}}</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
    <section class="home-board demo-form-inline">
      <div class="boder-wrap">
        <p class="order-title">
          <svg class="icon" aria-hidden="true" style="color:#FA834E">
            <use xlink:href="#icon-icon"></use>
          </svg>
          <span>销售额</span>
        </p>
        <ul class="border-list">
          <li>
            <p class="title">
              今日销售额
              <el-tooltip content="今日所有有效订单实付金额之和（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.money).includes('--')">{{totaldata.money | numFormat}}</span>
            </p>
            <p v-if="!String(totaldata.moneyIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.moneyIncreaseRate).includes('+'),'reduce-num':String(totaldata.moneyIncreaseRate).includes('-')}]">
              {{totaldata.moneyIncreaseRate}}
              <svg class="icon up-down" aria-hidden="true">
                <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.moneyIncreaseRate).includes('+')"></use>
                <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.moneyIncreaseRate).includes('-')"></use>
              </svg>
            </p>
          </li>
        </ul>
      </div>
      <div class="boder-wrap user-data">
        <p class="order-title">
          <svg class="icon" aria-hidden="true" style="color:#43C885">
            <use xlink:href="#icon-icon"></use>
          </svg>
          <span>设备数据</span>
        </p>
        <ul class="border-list">
          <li>
            <p class="title">
              今日新增设备数
              <el-tooltip content="今日新添加的设备数，按IMEI统计（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.addMachine).includes('--')">{{totaldata.addMachine | numFormat}}</span>
              <span v-if="!String(totaldata.addMachineIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.addMachineIncreaseRate).includes('+'),'reduce-num':String(totaldata.addMachineIncreaseRate).includes('-')}]">
                {{totaldata.addMachineIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.addMachineIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.addMachineIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              今日活跃设备数
              <el-tooltip content="今日产生有效订单的设备数（实时）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.activeMachine).includes('--')">{{totaldata.activeMachine | numFormat}}</span>
              <span v-if="!String(totaldata.activeMachineIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.activeMachineIncreaseRate).includes('+'),'reduce-num':String(totaldata.activeMachineIncreaseRate).includes('-')}]">
                {{totaldata.activeMachineIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.activeMachineIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.activeMachineIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              今日台均次数
              <el-tooltip content="台均次数=当日有效订单数/当日有效设备数" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.orderPerMachine).includes('--')">{{totaldata.orderPerMachine}}</span>
              <span v-if="!String(totaldata.orderPerMachineIncreaseRate).includes('--')" :class="['pencent',{'add-num':String(totaldata.orderPerMachineIncreaseRate).includes('+'),'reduce-num':String(totaldata.orderPerMachineIncreaseRate).includes('-')}]">
                {{totaldata.orderPerMachineIncreaseRate}}
                <svg class="icon up-down" aria-hidden="true">
                  <use xlink:href="#icon-yly_shangzhang" v-if="String(totaldata.orderPerMachineIncreaseRate).includes('+')"></use>
                  <use xlink:href="#icon-yly_xiajiang" v-if="String(totaldata.orderPerMachineIncreaseRate).includes('-')"></use>
                </svg>
              </span>
            </p>
          </li>
          <li>
            <p class="title">
              总设备数
              <el-tooltip content="除已删除的所有设备数（含今日）" placement="top">
                <svg class="icon tipcion" aria-hidden="true">
                  <use xlink:href="#icon-iconfontquestion"></use>
                </svg>
              </el-tooltip>
            </p>
            <p>
              <span class="num" v-if="!String(totaldata.totalMachine).includes('--')">{{totaldata.totalMachine | numFormat}}</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
    <section class="home-wrap">
      <h2 class="home-title">核心数据曲线</h2>
      <el-row>
        <el-col :span="12">
          <div class="chart-wrap">
            <h2>订单数据</h2>
            <div class="date-wrap">
              <span :class="['datachoose', {current: orderSearchIndex === index}]" v-for="(item,index) in SearchTime" :key="index" @click="orderTimeSearch(index)">{{item.lable}}</span>
            </div>
            <line-chart :legendData="orederlegendData" :grid="othergrid" :xAxis="orederxAxis" :yAxis="orderyAxis" :series="orederseries"></line-chart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrap">
            <h2>用户数据</h2>
            <div class="date-wrap">
              <span :class="['datachoose', {current: userSearchIndex === index}]" v-for="(item,index) in SearchTime" :key="index" @click="userTimeSearch(index)">{{item.lable}}</span>
            </div>
            <line-chart :legendData="userlegendData" :grid="othergrid" :xAxis="userxAxis" :yAxis="useryAxis" :series="userseries"></line-chart>
          </div>
        </el-col>
      </el-row>
      <el-row class="chart-margin">
        <el-col :span="12">
          <div class="chart-wrap">
            <h2>设备数据</h2>
            <div class="date-wrap">
              <span :class="['datachoose', {current: machineSearchIndex === index}]" v-for="(item,index) in SearchTime" :key="index" @click="machineTimeSearch(index)">{{item.lable}}</span>
            </div>
            <line-chart :legendData="machinelgendData" :grid="machinegrid" :xAxis="machinexAxis" :yAxis="machineyAxis" :series="machineseries"></line-chart>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-wrap">
            <h2>销售额</h2>
            <div class="date-wrap">
              <span :class="['datachoose', {current: saleSearchIndex === index}]" v-for="(item,index) in SearchTime" :key="index" @click="saleTimeSearch(index)">{{item.lable}}</span>
            </div>
            <line-chart :legendData="selalegendData" :grid="othergrid" :xAxis="selaxAxis" :yAxis="selayAxis" :series="selaseries"></line-chart>
          </div>
        </el-col>
      </el-row>
    </section>
  </section>
</template>

<script>
import { mapState } from "vuex";
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import lineChart from "@/components/LineChart";
import { calMax, calMin, exportExcel, ortId } from "@/utils/tool";
export default {
  components: {
    lineChart,
    QBreadcrumb
  },
  name: "page-home",
  data() {
    return {
      SearchTime: [
        { value: 7, lable: "7天" },
        { value: 30, lable: "30天" },
        { value: 60, lable: "60天" }
      ],
      totaldata: {
        order: "",
        totalOrder: "",
        addUser: "",
        activeUser: "",
        totalUser: "",
        money: "",
        addMachine: "",
        activeMachine: "",
        totalMachine: ""
      },
      orderSearchIndex: 0,
      userSearchIndex: 0,
      machineSearchIndex: 0,
      saleSearchIndex: 0,
      othergrid: {
        left: "10%", //默认是80px
        right: "2%", //默认是60px
        top: "8%", //默认80px
        bottom: "18%" //默认60px
      },
      orederlegendData: [
        { name: "日订单", icon: "rect" },
        { name: "新用户订单", icon: "rect" }
      ],
      orederxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      orderyAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#e6e6e6",
              type: "soild"
            }
          }
        }
      ],
      orederseries: [
        {
          name: "日订单",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
          name: "新用户订单",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
        }
      ],
      userxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      useryAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#e6e6e6",
              type: "soild"
            }
          }
        }
      ],
      userlegendData: [
        { name: "活跃用户", icon: "rect" },
        { name: "新增用户", icon: "rect" }
      ],
      userseries: [
        {
          name: "活跃用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
          name: "新增用户",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
      machinelgendData: [
        { name: "总设备数", icon: "rect" },
        { name: "活跃设备数", icon: "rect" },
        { name: "设备活跃率", icon: "rect" }
      ],
      machinegrid: {
        left: "10%", //默认是80px
        right: "8%", //默认是60px
        top: "8%", //默认80px
        bottom: "18%" //默认60px
      },
      machinexAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      machineyAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: { color: "#666" }
          },
          axisLine: {
            show: false
          },
          axisTick: { length: 0 },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#e6e6e6",
              type: "soild"
            }
          }
        },
        {
          type: "value",
          min: 0,
          max: 100,
          axisLabel: {
            textStyle: { color: "#666" },
            formatter: function(value) {
              return value + "%";
            }
          },
          axisLine: {
            show: false
          },
          axisTick: { length: 0 },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#e6e6e6",
              type: "soild"
            }
          }
        }
      ],
      machineseries: [
        {
          name: "总设备数",
          type: "line",
          data: [],
          yAxisIndex: 0,
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
          name: "活跃设备数",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
          name: "设备活跃率",
          type: "line",
          data: [],
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: function(params) {
                return params.value + "%";
              }
            }
          },
          tooltip: {
            trigger: "axis",
            formatter: function(data) {
              console.log(data);
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
      selalegendData: [{ name: "收入金额", icon: "rect" }],
      selaxAxis: {
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      },
      selayAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#e6e6e6",
              type: "soild"
            }
          }
        }
      ],
      selaseries: [
        {
          name: "收入金额",
          type: "line",
          data: [],
          label: {
            normal: {
              show: true,
              position: "top",
              formatter: params => {
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
      ]
    };
  },
  mounted() {},
  created() {
    this.getTotal();
    this.getOrderChart();
    this.getUserChart();
    this.getMachineChart();
    this.getSaleChart();
  },
  methods: {
    getTotal() {
      this.$axios.post(Api.HOME_TOTAL).then(res => {
        this.totaldata = res;
      });
    },
    getOrderChart(days = 7) {
      this.orederxAxis.data = [];
      this.orederseries[0].data = [];
      this.orederseries[1].data = [];
      this.$axios.post(Api.HOME_ORDER, { days: days }).then(res => {
        res.forEach(item => {
          this.orederxAxis.data.push(item.date);
          this.orederseries[0].data.push(item.orderValidCount);
          this.orederseries[1].data.push(item.orderNewCount);
        });
        let concatData = [
          ...this.orederseries[0].data,
          ...this.orederseries[1].data
        ];
        let Max = calMax(concatData) > 0 ? calMax(concatData) : 1;
        let Min = calMin(concatData);
        this.$set(this.orderyAxis[0], "max", Max);
        this.$set(this.orderyAxis[0], "min", Min);
        this.$set(this.orderyAxis[0], "interval", (Max - Min) / 5);
      });
    },
    orderTimeSearch(index) {
      let type = this.SearchTime[index].value;
      this.orderSearchIndex = index;
      this.getOrderChart(type);
    },
    getUserChart(days = 7) {
      this.userxAxis.data = [];
      this.userseries[0].data = [];
      this.userseries[1].data = [];
      this.$axios.post(Api.HOME_USER, { days: days }).then(res => {
        res.forEach(item => {
          this.userxAxis.data.push(item.date);
          this.userseries[0].data.push(item.userActiveCount);
          this.userseries[1].data.push(item.userAddCount);
        });
        let concatData = [
          ...this.userseries[0].data,
          ...this.userseries[1].data
        ];
        let Max = calMax(concatData) > 0 ? calMax(concatData) : 1; //订单Y轴最大值
        let Min = calMin(concatData);
        this.$set(this.useryAxis[0], "max", Max);
        this.$set(this.useryAxis[0], "min", Min);
        this.$set(this.useryAxis[0], "interval", (Max - Min) / 5);
      });
    },
    userTimeSearch(index) {
      let type = this.SearchTime[index].value;
      this.userSearchIndex = index;
      this.getUserChart(type);
    },
    getMachineChart(days = 7) {
      this.machinexAxis.data = [];
      this.machineseries[0].data = [];
      this.machineseries[1].data = [];
      this.machineseries[2].data = [];
      this.$axios.post(Api.HOME_DEVICE, { days: days }).then(res => {
        res.forEach(item => {
          this.machinexAxis.data.push(item.date);
          this.machineseries[0].data.push(item.deviceCount);
          this.machineseries[1].data.push(item.deviceActiveCount);
          let temp = (
            (item.deviceActiveCount / item.deviceCount) *
            100
          ).toFixed(2);
          this.machineseries[2].data.push(temp);
        });
        let concatData = [
          ...this.machineseries[0].data,
          ...this.machineseries[1].data
        ];
        let machineMax = calMax(concatData) > 0 ? calMax(concatData) : 1;
        let machineMin = calMin(concatData);

        this.$set(this.machineyAxis[0], "max", machineMax);
        this.$set(this.machineyAxis[0], "min", machineMin);
        this.$set(
          this.machineyAxis[0],
          "interval",
          (machineMax - machineMin) / 5
        );
      });
    },
    machineTimeSearch(index) {
      let type = this.SearchTime[index].value;
      this.machineSearchIndex = index;
      this.getMachineChart(type);
    },
    getSaleChart(days = 7) {
      this.selaxAxis.data = [];
      this.selaseries[0].data = [];
      this.$axios.post(Api.HOME_ORDER, { days: days }).then(res => {
        res.forEach(item => {
          this.selaxAxis.data.push(item.date);
          this.selaseries[0].data.push(item.moneyCount);
        });
        let Max =
          calMax(this.selaseries[0].data) > 0
            ? calMax(this.selaseries[0].data)
            : 1;
        let Min = calMin(this.selaseries[0].data);

        this.$set(this.selayAxis[0], "max", Max);
        this.$set(this.selayAxis[0], "min", Min);
        this.$set(this.selayAxis[0], "interval", (Max - Min) / 5);
      });
    },
    saleTimeSearch(index) {
      let type = this.SearchTime[index].value;
      this.saleSearchIndex = index;
      this.getSaleChart(type);
    }
  },
  computed: {}
};
</script>

<style scoped lang="less">
.homepage-wrap {
  .home-board {
    background: #fff;
    padding-left: 22px;
    width: 100%;
    overflow: hidden;
    .boder-wrap {
      width: 33%;
      padding-top: 10px;
      padding-bottom: 10px;
      float: left;
      box-sizing: border-box;
    }
    .user-data {
      width: 67%;
    }
    .order-title {
      padding-bottom: 6px;
      border-bottom: 1px solid#E1E1E1;
      span {
        font-size: 12px;
        color: #666;
      }
    }
    .border-list {
      width: 100%;
      overflow: hidden;
      padding-top: 14px;
      li {
        float: left;
        margin-right: 20px;
        width: 144px;
        height: 64px;
        padding-left: 14px;
        padding-top: 15px;
        height: 64px;
        padding-left: 15px;
        padding-top: 15px;
        background: #fff;
        border: 1px solid #e1e1e1;
        border-radius: 10px;
      }
      li:hover {
        background: #f7f7f7;
      }
      .title {
        font-size: 13px;
        color: #969696;
        padding-bottom: 8px;
      }
      .num {
        font-size: 18px;
        color: #00a0e8;
      }
      .pencent {
        font-size: 10px;
        color: #999;
      }
      .add-num {
        color: #ff1300;
        font-size: 10px;
        .icon {
          font-size: 12px;
          margin: 0;
        }
      }
      .reduce-num {
        font-size: 12px;
        color: #00be1f;
        .icon {
          font-size: 10px;
          margin: 0;
        }
      }
    }
  }
  .home-title {
    font-size: 16px;
    border-bottom: 1px solid#ececec;
    margin-bottom: 20px;
    padding: 10px 0;
  }
  .home-wrap {
    background: #fff;
    padding: 10px;
    .chart-wrap {
      width: 95%;
      overflow: hidden;
      padding-bottom: 20px;
      border: 1px solid#f3f3f3;
      position: relative;
      h2 {
        height: 80px;
        line-height: 70px;
        text-align: center;
        font-size: 14px;
      }
      .date-wrap {
        position: absolute;
        right: 20px;
        top: 50px;
        .datachoose {
          width: 37px;
          height: 24px;
          line-height: 24px;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          color: #666;
          margin-right: 10px;
        }
        .current {
          background: #00a0e8;
          color: #fff;
        }
      }
    }
    .chart-margin {
      margin-top: 40px;
    }
  }
}
@media screen and (max-width: 1336px) {
  .date-wrap {
    top: 45px !important;
    .datachoose {
      width: 45px !important;
      height: 24px !important;
      line-height: 24px !important;
      border-radius: 3px !important;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
