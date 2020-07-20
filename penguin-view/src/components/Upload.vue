<template>
  <el-upload action="" list-type="picture-card" :multiple="limit > 1" :show-file-list="limit > 1" :limit="limit" :on-exceed="handleExceed" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="handleBeforeUpload" :http-request="handleUpload" :file-list="fileList">
    <img v-if="limit === 1 && value && value.length > 0" :src="value" width="146" height="146">
    <i v-else class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
/**
 * 通用upload组件，支持单个和批量上传
 *
 *
 */
import Api from '@/utils/Api';

export default {
  name: 'component-upload',
  props: {
    // 文件列表
    value: [Array, String],
    // 最多上传个数，默认一个
    limit: {
      type: Number,
      default: 1
    },
    // image 表示图片，file 表示文件
    accept: {
      type: String,
      default: 'image'
    },
    // 允许上传文件的大小限制，单位kb
    size: {
      type: Number,
      default: 2048
    },
    layout: {
      type: Boolean,
      default: false
    },
    width:{
      type: Number,
        default: 146
    },
    height:{
      type: Number,
      default: 146
    },
    isDel:{
      type: Boolean,
      default: false
    },
    showWH:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleBeforeUpload(file) {
      if (this.accept === 'image' && !file.type.match(/image.*/)) {
        // 图片格式认证
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
        return false;
      } else if (this.accept === 'file') {
        // 文件格式认证
        this.$message.error('上传图片只能是文件!');
        return false;
      }

      // 图片大小认证
      if (this.size > 0 && file.size / 1024 > this.size) {
        this.$message.error('上传图片大小不能超过 ' + this.size + 'K!');
        return false;
      }
      // 是否判断宽高
     if (this.layout) { 
        const isSize = new Promise((resolve, reject)=>{
          let _URL = window.URL || window.webkitURL
          const img = new Image()
            img.onload = ()=>{
              const valid = img.width <= this.width && img.height <= this.height
              valid ? resolve() : reject()
            }
            img.src = _URL.createObjectURL(file)
        }).then(() => {
          return true
        }, () => {
          this.$message.error('上传的尺寸必须是宽:' + this.width + 'px 高:' + this.height + 'px')
          return Promise.reject()
        })
        return isSize;
     }

      return true;
    },
    // 自定义上传
    handleUpload({ file }) {
      // 上传文件
      let formData = new FormData();
      formData.append('files[]', file);
      if (this.showWH) {
        formData.append('size', 1);
      }
      this.$axios.post(Api.COMMON_UPLOAD, formData).then(resp => {
        if (resp.length > 0) {
          const file = resp[0].url;
          if (this.limit === 1) {
            this.$emit('input', file);
          } else {
            let files = this.value || [];
            files.push(file);
            this.$emit('input', files);
          }
        }
      }).catch(()=>{
        this.$emit('input', []);
      })
    },

    // 附件超限
    handleExceed(files, fileList) {
      this.$message.warning(`亲，您上传的文件超限了，当前限制${this.limit}，如需提升请和管理员联系～`);
    },

    // 移除附件
    handleRemove(file, fileList) {
      let files = fileList.map(item => item.url);
      this.$emit('input', files);
    },

    handlePreview(file) {
      this.$msgbox({
        title: '图片预览',
        message: this.$createElement('img', {
          attrs: { src: file.url, width: 390 }
        })
      });
    }
  },
  computed: {
    fileList() {
      if (this.value instanceof Array && this.value.length > 0) {
        return this.value.map((url, index) => {
          return { name: index, url: url };
        });
      }
      return [];
    }
  }
};
</script>

<style lang="less" scoped>
</style>
