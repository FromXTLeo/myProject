<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="charts"
           style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    async initEcharts() {
      // 3. 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('charts'))
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      Object.assign(this.options, res.data)
      myChart.setOption(this.options)
    }
  }
}
</script>
