<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><a href="#roles">权限管理</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="roleData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bd-bottom', 'flex-center', i1 ? '' : 'bd-top']"
            >
              <el-col :span="6">
                <el-tag closable @close="handleClose(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['flex-center', i2 ? 'bd-top' : '']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="handleClose(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="handleClose(scope.row, item3.id)"
                      type="warning"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEditRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="openRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      @close="rightDialogClosed"
    >
      <el-tree
        :data="treeData"
        show-checkbox
        accordion
        node-key="id"
        ref="tree"
        highlight-current
        :props="defTreeProp"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleData: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      rightDialogVisible: false,
      roleId: '',
      treeData: [],
      defTreeProp: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getRoleData()
  },
  methods: {
    async getRoleData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.roleData = res.data
      console.log(this.roleData)
    },
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.addDialogVisible = false
        this.getRoleData()
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭编辑角色对话框的回调
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 开始编辑角色
    openEditRole(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    // 提交编辑后的角色
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.id,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.editDialogVisible = false
        this.getRoleData()
      })
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$msg.error('删除角色失败！')
        this.$msg.success('删除角色成功！')
        this.getRoleData()
      }
    },
    // 删除角色下某一个权限
    async handleClose(roles, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          'roles/' + roles.id + '/rights/' + id
        )
        if (res.meta.status !== 200) return this.$msg.error('删除权限失败！')
        this.$msg.success('删除权限成功！')
        roles.children = res.data
      }
    },
    rightDialogClosed() {},
    async openRightDialog(role) {
      this.roleId = role.id
      this.rightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.treeData = res.data
      const arr = []
      this.getRightNode(role, arr)
      this.$refs.tree.setCheckedKeys(arr)
    },
    getRightNode(role, arr) {
      if (!role.children) {
        return arr.push(role.id)
      }
      role.children.forEach(item => {
        this.getRightNode(item, arr)
      })
    },
    async allotRight() {
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', {
        rids: [
          ...this.$refs.tree.getHalfCheckedKeys(),
          ...this.$refs.tree.getCheckedKeys()
        ].join(',')
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.getRoleData()
      this.rightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 5px;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
