<template>
  <div id="myChart" ref="myChart"></div>
</template>
<style>
  #myChart {
    width: 100%;
    min-height: 350px;
  }
</style>
<script>
  // 引入完整的echarts
  import echarts from 'echarts'

  export default {
    name: 'HomeChart',
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      rows: {
        type: Array,
        default: () => []
      },
      height: {
        type: String,
        default: '320px'
      }
    },
    data() {
      return {
        data1: [],
        data2: [],
        data3: [],
        data4: [],
        dataX: [],
        splitNumber: 5,
        colors: [
          '#ee1926',
          '#eea11c',
          '#5fbbff',
          '#ed24ff']
      }
    },
    watch: {
      rows: function(val) {
        const  that=this
        this.rows.forEach((item, index) => {
          that.data1.push(item.累计规模)
          that.data2.push(item.当月增加规模)
          that.data3.push(item.累计单数)
          that.data4.push(item.当月新增单数)
          that.dataX.push(item.时间)
        })
        that.draw()
      }
    },
    mounted() {
      this.draw()
    },
    methods: {
      draw() {
        // 实例化echarts对象
        let myChart = echarts.init(this.$refs.myChart) // 绘制条形图
        myChart.setOption(
          {
            color: this.colors,
            grid: {
              left: '13%',
              top:'15%'
            },
            legend: {
              top: 1
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' }
            },
            xAxis: {
              type: 'category',
              axisTick: { show: false },
              axisLabel: {
                textStyle: { color: '#333333', fontSize: 14 }
              },
              axisLine: {
                show: true,
                lineStyle: { color: '#707070' }
              },
              data: this.dataX
            },
            yAxis: [{
              name: '资产规模（亿）',
              type: 'value',
              position: 'left',
              min: this.calMin(this.data1),
              max: this.calMax(this.data1),
              splitNumber: this.splitNumber,
              interval: (this.calMax(this.data1) - this.calMin(this.data1)) / this.splitNumber,
              splitLine: {
                lineStyle: { type: 'dashed', color: '#707070' }
              },
              // axisLabel: {
              //   // formatter: '{value}mm',
              //   formatter: function(value, index) {
              //     return (value + '').indexOf('.') != -1 ? value.toFixed(1) : value
              //   },
              //   textStyle: { color: this.colors[0], fontSize: 10 }
              // },
              axisLine: { show: true },
              axisTick: { show: true }
            },
              {
                type: 'value',
                position: 'left',
                offset: 65,
                min: this.calMin(this.data1),
                max: this.calMax(this.data1),
                splitNumber: this.splitNumber,
                interval: (this.calMax(this.data1) - this.calMin(this.data1)) / this.splitNumber,
                splitLine: { show: false },
                axisLine: { show: false },
                axisLabel: {
                  show:false
                },
                axisTick: { show: false }
              },
              {
                name: '累计单数',
                type: 'value',
                position: 'right',
                min: this.calMin(this.data3),
                max: this.calMax(this.data3),
                splitNumber: this.splitNumber,
                interval: (this.calMax(this.data3) - this.calMin(this.data3)) / this.splitNumber,
                splitLine: { show: false },
                // axisLabel: {
                //   // formatter: '{value}m/s',
                //   formatter: function(value, index) {
                //     return parseInt(value)
                //   },
                //   textStyle: { color: this.colors[2], fontSize: 10 }
                // },
                axisLine: { show: true },
                axisTick: { show: true }
              },
              {
                type: 'value',
                position: 'right',
                offset: 54,
                min: this.calMin(this.data3),
                max: this.calMax(this.data3),
                splitNumber: this.splitNumber,
                interval: (this.calMax(this.data3) - this.calMin(this.data3)) / this.splitNumber,
                splitLine: { show: false },
                axisLine: { show: false },
                axisLabel: {
                  show:false
                },
                axisTick: { show: false }
              }],
            series: [{
              name: '累计规模',
              type: 'line',
              smooth: true,
              yAxisIndex: 0,
              data: this.data1
            },
              {
                name: '当月增加规模',
                type: 'line',
                smooth: true,
                symbolSize: 8,
                yAxisIndex: 1,
                data: this.data2
              },
              {
                name: '累计单数',
                type: 'line',
                smooth: true,
                symbolSize: 8,
                yAxisIndex: 2,
                data: this.data3
              },
              {
                name: '当月新增单数',
                type: 'line',
                smooth: true,
                symbolSize: 8,
                yAxisIndex: 3,
                data: this.data4
              }
            ]
          })
      },
      //计算最大值
      calMax(arr) {
        let min = Math.min.apply(null, arr)
        let max = Math.max.apply(null, arr)
        let interval = (max - min) / this.splitNumber // 平均值
        max = Math.ceil(max + interval) // 向上取整
        // console.log(min, max, interval);
        return max
      },

      //计算最小值
      calMin(arr) {
        let min = Math.min.apply(null, arr)
        let max = Math.max.apply(null, arr)
        let interval = (max - min) / this.splitNumber // 平均值
        min = min === 0 ? min : Math.floor(min - interval) // 向下取整
        if (min < 0) {
          min = 0
        }
        // console.log(min, max, interval);
        return min
      }
    }

  }
</script>