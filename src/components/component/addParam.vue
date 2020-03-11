<template>
  <div>
    <el-dialog
      :title="prop.title"
      :visible.sync="dVisible"
      width="50%"
      @close="dialogClosed"
    >
      <el-form
        :model="formValue"
        :rules="FormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item :label="prop.label" prop="attr_name">
          <el-input v-model="formValue.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClosed">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    prop: Object,
    dialogVisible: Boolean
  },
  data() {
    return {
      formValue: {
        attr_name: ''
      },
      FormRules: {
        attr_name: [
          { required: true, message: '该项不能为空~', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dVisible: {
      get() {
        return this.dialogVisible
      },
      set() {}
    }
  },
  methods: {
    dialogClosed() {
      this.formValue.attr_name = ''
      this.$refs.addFormRef.resetFields()
      this.$emit('close', false)
    },
    submitData() {
      this.$emit('submit', this.formValue.attr_name)
    }
  }
}
</script>
