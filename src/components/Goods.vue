<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#goods">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    clearable
                    v-model="tableInfo.query"
                    @clear="getGoodData">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="queryGood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodData">
        <el-table-column label="商品名称"
                         prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)"
                         prop="goods_price"></el-table-column>
        <el-table-column label="商品重量"
                         prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间"
                         prop="add_time">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       @click="openEditGood(scope.row)"></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       @click="deleteGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="tableInfo.pagenum"
                     :page-sizes="[2, 5, 10, 20]"
                     :page-size="tableInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodData: [],
      total: 0,
      tableInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }
    }
  },
  created() {
    this.getGoodData()
  },
  methods: {
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
    async getGoodData() {
      const { data: res } = await this.$http.get('goods', {
        params: this.tableInfo
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.goodData = res.data.goods
      this.total = res.data.total
      console.log(this.goodData)
    },
    handleSizeChange(newSize) {
      this.tableInfo.pagesize = newSize
      this.getGoodData()
    },
    handleCurrentChange(newPage) {
      this.tableInfo.pagenum = newPage
      this.getGoodData()
    },
    queryGood() {
      this.tableInfo.pagenum = 1
      this.getGoodData()
    },
    openEditGood(row) {
      console.log(1)
    },
    async deleteGood(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('goods/' + id)
        if (res.meta.status !== 200) return this.$msg.error('删除商品失败！')
        this.$msg.success('删除商品成功！')
        this.getGoodData()
      }
    },
    addGood() {
      this.$router.push('/addgoods')
    }
  }
}
</script>
