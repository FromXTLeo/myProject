<template>
  <div class="login_container">
    <div class="login_form">
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="loginForm"
        class="login_form_input"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_form_button">
          <el-button type="primary" @click="handleLogin">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '账号不能为空哦' }],
        password: [{ required: true, message: '密码不能为空哦' }]
      }
    }
  },
  methods: {
    handleLogin() {
      const _ = this
      _.$refs.loginForm.validate(async valid => {
        if (valid) {
          const { data: res } = await _.$http.post('login', _.loginForm)
          if (res.meta.status === 200) {
            _.$msg.success(res.meta.msg)
            window.sessionStorage.setItem('token', res.data.token)
            _.$router.push('/home')
          } else {
            _.$refs.loginForm.resetFields()
            _.$msg.error(res.meta.msg)
          }
        }
      })
    },
    handleReset() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  // background-color:darkslategrey;
  position: relative;
  .login_form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 250px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    .login_form_input {
      margin: 43px 20px 0;
      .el-input {
        background-color: rgba(0, 0, 0, 0);
      }
      .login_form_button {
        text-align: center;
      }
    }
  }
}
</style>
