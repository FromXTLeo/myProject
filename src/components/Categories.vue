<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#goods">分类管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="openAddCategorie"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="categorieData"
        row-key="cat_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template slot-scope="scope">
            <i
              v-if="scope.row.cat_deleted === false"
              class="el-icon-success icon-green"
            ></i>
            <i
              v-if="scope.row.cat_deleted === true"
              class="el-icon-success icon-green"
            ></i>
          </template> </el-table-column
        ><el-table-column label="权限等级" prop="cat_level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-if="scope.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-if="scope.row.cat_level === 2" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEditCategorie(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteCategorie(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="tableInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="dialogClosed('addFormRef')"
    >
      <el-form
        :model="addForm"
        :rules="editFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            v-model="addCategorieValue"
            :options="addCategorieData"
            :props="cascaderProp"
            @change="handleCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategorie">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="dialogClosed('editFormRef')"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategorie">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categorieData: [],
      total: 0,
      tableInfo: {
        type: '3',
        pagenum: 0,
        pagesize: 5
      },
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addDialogVisible: false,
      addCategorieValue: [],
      addCategorieData: [],
      cascaderProp: {
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      },
      editForm: {
        cat_name: '',
        cat_id: null
      },
      editDialogVisible: false,
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategorieData()
  },
  methods: {
    async getCategorieData() {
      const { data: res } = await this.$http.get('categories', {
        params: this.tableInfo
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.categorieData = res.data.result
      this.total = res.data.total
      console.log(this.categorieData)
    },
    handleSizeChange(newSize) {
      this.tableInfo.pagesize = newSize
      this.getCategorieData()
    },
    handleCurrentChange(newPage) {
      this.tableInfo.pagenum = newPage
      this.getCategorieData()
    },
    async openAddCategorie() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.addCategorieData = res.data
      this.addDialogVisible = true
    },
    handleCateChange() {
      this.addCategorieValue.length
        ? (this.addForm.cat_pid = this.addCategorieValue[
          this.addCategorieValue.length - 1
        ])
        : (this.addForm.cat_pid = this.addCategorieValue.length)
      this.addForm.cat_level = this.addCategorieValue.length
    },
    async addCategorie() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.addDialogVisible = false
      })
    },
    openEditCategorie(row) {
      this.editForm.cat_id = JSON.parse(JSON.stringify(row.cat_id))
      this.editForm.cat_name = JSON.parse(JSON.stringify(row.cat_name))
      this.editDialogVisible = true
    },
    async editCategorie() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.getCategorieData()
        this.editDialogVisible = false
      })
    },
    async deleteCategorie(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) return this.$msg.error('删除分类失败！')
        this.$msg.success('删除分类成功！')
        this.getCategorieData()
      }
    },
    dialogClosed(type) {
      this.$refs[type].resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.icon-green {
  color: rgb(90, 197, 162);
}
.el-cascader {
  width: 100%;
}
</style>
