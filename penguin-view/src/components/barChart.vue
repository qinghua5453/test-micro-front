<template>
	<div :id="id" :style="{height:height,width:width}"></div>
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
      default: "300px"
    },
    legendData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    grid: {
      type: Object,
      default: function() {
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
      default: function() {
        return {
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            textStyle: { color: "#999" },
            interval: 0
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
      default: function() {
        return [
          {
            type: "value",
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
              textStyle: { color: "#999" }
            }
          }
        ];
      }
    },
    series: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  name: "bar-chart",
  data() {
    return {
      Chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  created() {},
  methods: {
    initChart() {
      this.Chart = echarts.init(document.getElementById("" + this.id));
      this.Chart.setOption(this.ChartOPtion);
    }
  },
  watch: {
    series: {
      handler(newValue, oldValue) {
        this.Chart.setOption(this.ChartOPtion);
      },
      deep: true
    }
  },
  computed: {
    ChartOPtion() {
      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              // 阴影指示器样式设置
              width: "10px", // 阴影大小
              color: "rgba(150,150,150,0.3)" // 阴影颜色
            }
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
  }
};
</script>

<style scoped lang="less">
</style>
