<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    clearable
                    v-model="tableInfo.query"
                    @clear="getOrderData">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getOrderData"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderData">
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="订单编号"
                         min-width="300px"
                         prop="order_number"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"></el-table-column>
        <el-table-column label="是否付款"
                         prop="order_pay">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_pay-0?'success':'danger'">{{scope.row.order_pay-0?'已付款':'未付款'}}</el-tag>
          </template></el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send"></el-table-column>
        <el-table-column label="下单时间"
                         prop="create_time">
          <template slot-scope="scope">
            <span>{{scope.row.create_time | dateFormatter}}</span>
          </template> </el-table-column>
        <el-table-column label="操作"
                         min-width="120px">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       @click="openEditOrder(scope.row)"></el-button>
            <el-button type="success"
                       size="mini"
                       icon="el-icon-delete-location"
                       @click="openLogisticsInformation(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="tableInfo.pagenum"
                     :page-sizes="[5, 10, 20, 30]"
                     :page-size="tableInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editAddressForm"
               :rules="editAddressFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address">
          <el-cascader :options="addressList"
                       :props="cateProps"
                       v-model="editAddressForm.address"
                       @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流信息"
               :visible.sync="logisticsInformationVisible"
               width="50%">
      <el-steps align-center
                direction="vertical"
                :active="0">
        <el-step :title="item.time"
                 v-for="item in stepData"
                 :key="item.id"
                 :description="item.context"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>
<script>
import cityData from '../assets/js/city'
export default {
  data() {
    return {
      orderData: [],
      total: null,
      tableInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      editAddressForm: {
        address: []
      },
      editAddressFormRules: {
        address2: [
          {
            required: true,
            trigger: 'blur',
            message: '该项不能为空！'
          }
        ]
      },
      addressList: cityData,
      editDialogVisible: false,
      cateProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      stepData: [],
      logisticsInformationVisible: false
    }
  },
  created() {
    this.getOrderData()
  },
  methods: {
    async getOrderData() {
      const { data: res } = await this.$http.get('orders', {
        params: this.tableInfo
      })
      if (res.meta.status !== 200) this.$msg.error(res.meta.msg)
      this.orderData = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.tableInfo.pagesize = newSize
      this.getOrderData()
    },
    handleCurrentChange(newPage) {
      this.tableInfo.pagenum = newPage
      this.getOrderData()
    },
    handleChange(v) {
      console.log(v)
    },
    openEditOrder(row) {
      this.editDialogVisible = true
    },
    editDialogClosed() {
      console.log(1)
    },
    editUser() {
      this.editDialogVisible = false
    },
    async openLogisticsInformation(row) {
      this.logisticsInformationVisible = true
      const { data: res } = await this.$http.get('kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.stepData = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
