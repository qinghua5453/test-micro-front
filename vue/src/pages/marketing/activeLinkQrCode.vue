<template>
  <el-dialog title="活动链接" :visible.sync="visible" :before-close="modalClose">
    <h3 class="copylink_title">活动名称：{{activityLinkName}}</h3>
    <div class="copylink_con">
      <p class="short_title">1.活动地址</p>
      <p style="padding-top:20px;">
        {{activityUrl}}
        <span style="color:#409EFF;cursor: pointer;padding-left:30px;" v-clipboard:copy="activityUrl" v-clipboard:success="onCopyLink" v-clipboard:error="onCopylinkError">复制</span>
      </p>
      <p class="short_title">1.活动二维码</p>
      <p>
        <img :src="activityQrcode" alt="活动二维码">
      </p>
      <p @click="downloadQrIamge(activityQrcode,'活动二维码')" style="color:#409EFF;cursor: pointer;padding-left: 20px;">保存图片</p>
      <el-button type="primary" size="small" @click.native="modalClose">确定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activityLinkName: {
      type: String,
      default: ''
    },
    showActivtiyDetailId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activityQrcode: '',
      activityUrl: ''
    };
  },
  components: {},
  created() {
    this.hanleCopyLink();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    hanleCopyLink() {
      //复制链接
      this.$axios.post(Api.MEMBER_EVENT_LINK, { id: this.showActivtiyDetailId }).then(resp => {
        this.activityQrcode = resp.qrcode;
        this.activityUrl = resp.link;
      });
    },
    onCopyLink: function(e) {
      this.$message.success('复制成功');
    },
    onCopylinkError: function(e) {
      this.$message.error('复制失败');
    },
    downloadQrIamge(imgsrc, name) {
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL('image/jpeg'); //得到图片的base64编码数据
        let a = document.createElement('a'); // 生成一个a元素
        let event = new MouseEvent('click'); // 创建一个单击事件
        a.download = name || 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
</style>
