<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#users">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    clearable
                    v-model="tableInfo.query"
                    @clear="getUserData">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="queryUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData">
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="手机"
                         prop="mobile"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态"
                         prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="handleChangeMgState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"
                       @click="openEditUser(scope.row)"></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark"
                        content="分配角色"
                        :enterable="false"
                        placement="top">
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-setting"
                         @click="openRoleDialog(scope.row)"></el-button>
            </el-tooltip>
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

    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    disabled=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色"
               :visible.sync="roleDialogVisible"
               width="50%">
      <span>
        <p>当前用户：{{roleInfo.username}}</p>
        <p>当前角色：{{roleInfo.role_name}}</p>
        <p>分配角色：
          <el-select v-model="roleValue"
                     placeholder="请选择">
            <el-option v-for="item in roleOption"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      userData: [],
      total: 0,
      tableInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      roleDialogVisible: false,
      roleInfo: {
        username: '',
        role_name: ''
      },
      roleOption: [],
      roleValue: '',
      userId: ''
    }
  },
  created() {
    this.getUserData()
  },
  methods: {
    async getUserData() {
      const { data: res } = await this.$http.get('users', {
        params: this.tableInfo
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.userData = res.data.users
      this.total = res.data.total
      console.log(this.userData)
    },
    handleSizeChange(newSize) {
      this.tableInfo.pagesize = newSize
      this.getUserData()
    },
    handleCurrentChange(newPage) {
      this.tableInfo.pagenum = newPage
      this.getUserData()
    },
    async handleChangeMgState(v) {
      const { data: res } = await this.$http.put(
        `users/${v.id}/state/${v.mg_state}`
      )
      if (res.meta.status !== 200) {
        v.mg_state = !v.mg_state
        return this.$msg.error(res.meta.msg)
      } else {
        this.$msg.success(res.meta.msg)
      }
    },
    queryUser() {
      this.tableInfo.pagenum = 1
      this.getUserData()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.addDialogVisible = false
        this.getUserData()
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    openEditUser(row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserData()
      })
    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$msg.error('删除用户失败！')
        this.$msg.success('删除用户成功！')
        this.getUserData()
      }
    },
    async openRoleDialog(row) {
      this.roleInfo.username = row.username
      this.roleInfo.role_name = row.role_name
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.roleOption = res.data
      this.roleDialogVisible = true
      this.userId = row.id
    },
    // 分配角色
    async allotRole() {
      const { data: res } = await this.$http.put(
        'users/' + this.userId + '/role',
        {
          rid: this.roleValue
        }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.getUserData()
      this.roleDialogVisible = false
      this.roleValue = ''
    }
  }
}
</script>
