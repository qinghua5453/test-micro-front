<template>
  <div :id="randomId" :style="{height:height,width:width}"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "280px"
    },
    legendData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    grid: {
      type: Object,
      default: function () {
        return {
          left: "8%", //默认是80px
          right: "0%", //默认是60px
          top: "8%", //默认80px
          bottom: "18%" //默认60px
        };
      }
    },
    xAxis: {
      type: Object,
      default: function () {
        return {
          type: "category",
          offset: 8,
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: { color: "#999" }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#e6e6e6",
              type: "solid"
            }
          }
        };
      }
    },
    yAxis: {
      type: Array,
      default: function () {
        return [
          {
            type: "value",
            offset: 10,
            axisLine: {
              show: false,
              lineStyle: {
                color: "#e6e6e6"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: { color: "#666" }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e6e6e6",
                type: "soild"
              }
            }
          }
        ];
      }
    },
    series: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  name: "line-chart",
  data () {
    return {
      randomId: "editor_" + Math.random() * 100000000000000000,
      Chart: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      // this.initChart();
    });
  },
  created () { },
  methods: {
    initChart () {
      this.Chart = echarts.init(document.getElementById("" + this.randomId));
      this.Chart.setOption(this.ChartOPtion, true);
      let _this = this;
      window.addEventListener("resize", function () {
        _this.Chart.resize();
      });
    }
  },
  watch: {
    series: {
      handler (newValue, oldValue) {
        //想着通过修改数组来动态更新图表，但是没变化，后来发觉是因为图表数据会和之前的合并,
        //阻止合并，从而实现更新图表setOption(option,true)
        this.Chart.setOption(this.ChartOPtion, true);
      },
      deep: true
    }
  },
  computed: {
    ChartOPtion () {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          },
          extraCssText: "text-align: left",
          formatter: (data) => {
            let tip = "";
            tip += `${data[0].name}<br/>`;
            data.forEach(item => {
              if (item.seriesName.includes("率") || item.seriesName.includes("占比")) {
                let temp = String(item.value).includes("N/A") ? item.value : `${item.value}%`;
                tip += `${item.marker}${item.seriesName}：${temp}<br/>`;
              } else {
                tip += `${item.marker}${item.seriesName}：${this.numFormat(item.value)}<br/>`;
              }
            });
            return tip ? tip : "Loading";
          }
        },
        legend: {
          itemWidth: 40,
          itemHeight: 3,
          itemGap: 20,
          data: this.legendData, //分别修改legend格式
          bottom: 0,
          textStyle: {
            fontSize: 14,
            color: "#666"
          }
        },
        grid: this.grid,
        dataZoom: [
          {
            type: "inside"
          }
        ],
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series
      };
      return option;
    }
  },
  beforeDestroy () {
    if (this.Chart) {
      this.Chart.clear();
    }
  }
};
</script>

<style scoped lang="less">
</style>
