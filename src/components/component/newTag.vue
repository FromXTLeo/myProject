<template>
  <div>
    <el-tag v-for="(tag, i) in tagData"
            :key="i"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
      {{ tag }}
    </el-tag>
    <el-input class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
    </el-input>
    <el-button v-else
               class="button-new-tag"
               size="small"
               @click="showInput">+ New Tag</el-button>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
      tagData:
        this.data.attr_vals.trimStart() !== ''
          ? this.data.attr_vals.split(' ')
          : [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      let obj = {
        attr_vals: '',
        attr_id: this.data.attr_id,
        cat_id: this.data.cat_id,
        attr_name: this.data.attr_name,
        attr_sel: this.data.attr_sel
      }
      this.tagData.splice(this.tagData.indexOf(tag), 1)
      obj.attr_vals = this.tagData.join(' ')
      this.$emit('changeNewTag', obj)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      if (this.inputValue.trimStart() !== '' && this.inputValue) {
        let obj = {
          attr_vals: '',
          attr_id: this.data.attr_id,
          cat_id: this.data.cat_id,
          attr_name: this.data.attr_name,
          attr_sel: this.data.attr_sel
        }
        this.tagData.push(this.inputValue)
        obj.attr_vals = this.tagData.join(' ')
        this.$emit('changeNewTag', obj)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 0 5px;
}
</style>
