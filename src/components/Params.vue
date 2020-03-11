<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="#goods">分类管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-alert title="注意：只允许为第三级分类设置相关参数！"
                  type="warning"
                  show-icon
                  :closable="false"></el-alert>
      </el-row>
      <el-row class="margin10">
        选择商品分类：
        <el-cascader v-model="paramsValue"
                     :options="paramsData"
                     :props="cascaderProp"
                     @change="handleCateChange"
                     clearable></el-cascader>
      </el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数"
                     name="many">
          <el-row>
            <el-button type="primary"
                       size="mini"
                       :disabled="isDisabled"
                       @click="openAddDialog">添加参数</el-button>
          </el-row>
          <el-table :data="manyAttrData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <new-tag @changeNewTag="changeNewTag"
                         :data="scope.row"></new-tag>
              </template>
            </el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="openEditCategorie(scope.row)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="deleteCategorie(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     size="mini"
                     :disabled="isDisabled"
                     @click="openAddDialog">添加属性</el-button>
          <el-table :data="onlyAttrData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <new-tag @changeNewTag="changeNewTag"
                         :data="scope.row"></new-tag>
              </template>
            </el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="openEditCategorie(scope.row)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="deleteCategorie(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <add-param ref="dialogRef"
               :prop="dialogProp"
               :dialogVisible="dialogVisible"
               @close="dialogVisible = false"
               @submit="dialogSubmit"></add-param>
  </div>
</template>
<script>
import NewTag from './component/newTag.vue'
import AddParam from './component/addParam.vue'
export default {
  data() {
    return {
      paramsValue: [],
      paramsData: [],
      cascaderProp: {
        label: 'cat_name',
        value: 'cat_id'
      },
      activeName: 'many',
      manyAttrData: [],
      onlyAttrData: [],
      dialogVisible: false,
      dialogParam: {
        attr_id: null,
        cat_id: null,
        dialogType: ''
      }
    }
  },
  components: { NewTag, AddParam },
  computed: {
    isDisabled() {
      if (this.paramsValue.length === 3) {
        return false
      } else {
        return true
      }
    },
    dialogProp() {
      const obj = {}
      if (this.activeName === 'many') {
        obj.title = '添加动态参数'
        obj.label = '动态参数'
      } else {
        obj.title = '添加静态属性'
        obj.label = '静态属性'
      }
      return obj
    }
  },
  created() {
    this.getCategorieData()
  },
  methods: {
    async getCategorieData() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: '3' }
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.paramsData = res.data
    },
    handleCateChange() {
      if (this.paramsValue.length === 3) {
        this.dialogParam.cat_id = this.paramsValue[this.paramsValue.length - 1]
        this.getAttrData('many')
        this.getAttrData('only')
      } else {
        this.paramsValue = []
        this.manyAttrData = []
        this.onlyAttrData = []
      }
    },
    async changeNewTag(v) {
      const { data: res } = await this.$http.put(
        `categories/${v.cat_id}/attributes/${v.attr_id}`,
        {
          attr_name: v.attr_name,
          attr_sel: v.attr_sel,
          attr_vals: v.attr_vals
        }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
    },
    async getAttrData(type) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.dialogParam.cat_id}/attributes`,
        { params: { sel: type } }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      type === 'many'
        ? (this.manyAttrData = res.data)
        : (this.onlyAttrData = res.data)
    },
    async dialogSubmit(v) {
      let obj = {}
      if (this.dialogParam.dialogType === 'add') {
        obj.type = 'post'
        obj.url = `categories/${this.dialogParam.cat_id}/attributes/`
      } else {
        obj.type = 'put'
        obj.url = `categories/${this.dialogParam.cat_id}/attributes/${this.dialogParam.attr_id}`
      }
      const { data: res } = await this.$http[obj.type](obj.url, {
        attr_name: v,
        attr_sel: this.activeName
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.getAttrData(this.activeName)
      this.dialogVisible = false
    },
    openAddDialog() {
      this.dialogParam.cat_id = this.paramsValue[this.paramsValue.length - 1]
      this.dialogParam.dialogType = 'add'
      this.dialogVisible = true
    },
    openEditCategorie(row) {
      this.activeName === 'many'
        ? (this.dialogProp.title = '编辑动态参数')
        : (this.dialogProp.title = '编辑静态属性')
      this.dialogVisible = true
      this.dialogParam.attr_id = row.attr_id
      this.dialogParam.cat_id = row.cat_id
      this.dialogParam.dialogType = 'edit'
      this.$refs.dialogRef.formValue.attr_name = row.attr_name
    },
    async deleteCategorie(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该属性，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${row.cat_id}/attributes/${row.attr_id}`
        )
        if (res.meta.status !== 200) return this.$msg.error('删除属性失败！')
        this.$msg.success('删除属性成功！')
        this.getAttrData(this.activeName)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.margin10 {
  margin: 10px 0;
}
.el-cascader {
  width: calc(100% - 117px);
}
</style>
