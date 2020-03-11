<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#goods">分类管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-alert title="添加商品信息"
                  type="info"
                  show-icon
                  center
                  :closable="false">
        </el-alert>
      </el-row>
      <el-row>
        <el-steps align-center
                  :space="200"
                  :active="activeIndex - 0"
                  finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <el-row>
        <el-form :model="goodInfo"
                 :rules="addFormRules"
                 ref="addFormRef">
          <el-tabs tab-position="left"
                   v-model="activeIndex"
                   :before-leave="beforeTabLeave">
            <el-tab-pane label="基本信息"
                         name="0">
              <el-form-item label="商品名称"
                            prop="goods_name">
                <el-input v-model="goodInfo.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格"
                            prop="goods_price">
                <el-input-number v-model="goodInfo.goods_price"
                                 :precision="2"
                                 :step="0.1"
                                 :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="商品重量"
                            prop="goods_weight">
                <el-input-number v-model="goodInfo.goods_weight"
                                 :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="商品数量"
                            prop="goods_number">
                <el-input-number v-model="goodInfo.goods_number"
                                 :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="商品分类"
                            prop="goods_cat">
                <el-cascader :options="catelist"
                             :props="cateProps"
                             v-model="goodInfo.goods_cat"
                             @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数"
                         name="1">
              <el-form-item :label="item.attr_name"
                            v-for="item in goodParamList"
                            :key="item.attr_id"
                            class="block-item-label">
                <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb"
                               v-for="(cb, i) in item.attr_vals"
                               :key="i"
                               border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性"
                         name="2">
              <el-form-item :label="item.attr_name"
                            v-for="item in goodAttrList"
                            :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片"
                         name="3">
              <el-upload action="http://127.0.0.1:8888/api/private/v1/upload"
                         :on-preview="handlePreview"
                         :on-success="handleSuccess"
                         :file-list="fileList"
                         :headers="headers"
                         list-type="picture">
                <el-button type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容"
                         name="4">
              <quill-editor v-model="goodInfo.goods_introduce"
                            :options="editorOption"></quill-editor>
              <el-button type="primary"
                         @click="addGood"
                         style="margin:20px 0;">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-row>
    </el-card>
    <div :class="['dialog', showDialog?'show':'']"
         @click.stop="showDialog=false">
      <img :src="fileUrl"
           alt="">
    </div>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'], // 清除文本格式-----['clean']
  ['image'] // 链接、图片、视频-----['link', 'image', 'video']
]
export default {
  components: { quillEditor },
  data() {
    return {
      goodInfo: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        goods_introduce: '',
        // 上传图片
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      activeIndex: '0',
      // 级联框数据源
      catelist: [],
      // 级联框数据格式配置
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      goodParamList: [],
      goodAttrList: [],
      fileList: [],
      fileUrl: '',
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      showDialog: false,
      editorOption: {
        placeholder: '请输入文本...',
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions
          }
        }
      }
    }
  },
  watch: {
    activeIndex(nV) {
      if (nV === '0') {
        this.getCateList()
      } else if (nV === '1') {
        this.getGoodParamList('many')
      } else if (nV === '2') {
        this.getGoodParamList('only')
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取级联框数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { type: '3' })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.catelist = res.data
    },
    // 获取商品参数数据
    async getGoodParamList(type) {
      const { data: res } = await this.$http.get(
        `categories/${
          this.goodInfo.goods_cat[this.goodInfo.goods_cat.length - 1]
        }/attributes`,
        { params: { sel: type } }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)

      if (type === 'many') {
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.goodParamList = res.data
      } else {
        this.goodAttrList = res.data
      }
    },
    // tabs切换前 回调事件
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      // return false
      if (oldActiveName === '0' && this.goodInfo.goods_cat.length !== 3) {
        this.$msg.error('请先选择商品分类！')
        return false
      }
    },
    // tabs切换
    tabClicked(active) {
      // console.log(active)
    },
    // 级联框选择赋值
    handleChange() {
      if (this.goodInfo.goods_cat.length !== 3) {
        return (this.goodInfo.goods_cat = [])
      }
    },
    // 点击已上传文件的回调
    handlePreview(file) {
      console.log(file)
      this.fileUrl = file.url
      this.showDialog = true
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.goodInfo.pics.push(picInfo)
    },
    addGood() {
      this.$refs.addFormRef.validate(async valid => {
        let _ = this
        if (!valid) return this.$msg.error('请填写必要的表单项')
        const form = JSON.parse(JSON.stringify(this.goodInfo))
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.goodParamList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          _.goodInfo.attrs.push(newInfo)
        })
        // 处理静态属性
        this.goodAttrList.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.goodInfo.attrs.push(newInfo)
        })
        form.attrs = this.goodInfo.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.$router.go(-1)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-form .el-input,
.el-input-number,
.el-cascader {
  width: 100%;
}
.block-item-label /deep/ .el-form-item__label {
  float: inherit;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
.dialog {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  text-align: center;
  z-index: 19960617;
  display: none;
  img {
    width: 400px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.dialog.show {
  display: block;
}
.ql-container {
  min-height: 200px;
}
</style>
