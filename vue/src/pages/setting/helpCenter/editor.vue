<template>
  <textarea :id='id' :value='value'></textarea>
</template>

<script>
// Import TinyMCE
import Api from "@/utils/Api";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/modern/theme";
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/paste";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/colorpicker";
const INIT = 0;
const CHANGED = 2;
export default {
  props: {
    value: {
      type: String,
      editor: null,
      required: true
    },
    setting: {},
    url: {
      // 接口
      default: "",
      type: String
    },
    accept: {
      // 文件类型
      default: "image/jpeg, image/png",
      type: String
    },
    maxSize: {
      // 大小
      default: 2048000,
      type: Number
    },
    withCredentials: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    value: function(val) {
      if (this.status === INIT || tinymce.activeEditor.getContent() !== val) {
        tinymce.activeEditor.setContent(val);
      }
      this.status = CHANGED;
    }
  },
  data() {
    return {
      status: INIT,
      id: "editor-" + new Date().getMilliseconds()
    };
  },
  methods: {},
  mounted() {
    const _this = this;
    const setting = {
      selector: "#" + _this.id,
      //启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
      //menubar: 'file edit insert view format table',
      menubar: false,
      branding: false, //去除右下角的'由tinymce驱动'
      elementpath: false, //左下角的当前标签路径
      images_upload_url: "common/uploadFile", // 图片对应的上传地址
      language_url: "/static/tinymce/zh_CN.js",
      language: "zh_CN",
      skin_url: "/static/tinymce/skins/lightgray",
      image_title: false, // 是否开启图片标题设置的选择，这里设置否
      init_instance_callback: function(editor) {
        editor.on("input change undo redo", () => {
          var content = editor.getContent();
          _this.$emit("show", content);
        });
      },
      content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
        `,
      insert_button_items: "image link | inserttable",
      paste_retain_style_properties: "all",
      paste_word_valid_elements: "*[*]", // word需要它
      paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
      powerpaste_allow_local_images: true, //允许带图片
      paste_convert_word_fake_lists: false, // 插入word文档需要该属性
      paste_webkit_styles: "all",
      paste_merge_formats: true,
      nonbreaking_force_tab: false,
      paste_auto_cleanup_on_paste: false,

      fontsize_formats: "10px 11px 12px 14px 16px 18px 20px 24px,36px",
      style_formats: [
        {
          title: "首行缩进",
          block: "p",
          styles: { "text-indent": "2em" }
        },
        {
          title: "行高",
          items: [
            { title: "1", styles: { "line-height": "1" }, inline: "span" },
            { title: "1.5", styles: { "line-height": "1.5" }, inline: "span" },
            { title: "2", styles: { "line-height": "2" }, inline: "span" },
            { title: "2.5", styles: { "line-height": "2.5" }, inline: "span" },
            { title: "3", styles: { "line-height": "3" }, inline: "span" }
          ]
        }
      ],
      font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats
        `,
      plugins: [
        "advlist link image",
        "code",
        "table textcolor paste textcolor colorpicker"
      ],
      // 配置
      toolbar_items_size: "small",
      block_formats:
        "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;",
      toolbar:
        " fontsizeselect | forecolor backcolor | formatselect | fontselect bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat | uploadimg image media | table | insertfile undo redo ", // 工具栏2
      // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
      images_upload_handler: function(blobInfo, success, failure) {
        if (blobInfo.blob().size > _this.maxSize) {
            failure('请选择小于2M的图片!')
            return false;
        }
        if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
          uploadPic();
        } else {
          failure("图片格式错误");
        }
        function uploadPic() {
          let formData = new FormData();
          formData.append("size", 1);
          formData.append("files[]", blobInfo.blob());
          _this.$axios
            .post(Api.COMMON_UPLOAD, formData)
            .then(res => {
              // 这里返回的是你图片的地址
              if (res.length > 0) {
                const file = res[0].url;
                success(file);
              }
            })
            .catch(() => {
              failure("上传失败");
            });
        }
      }
    };
    Object.assign(setting, _this.setting);
    tinymce.init(setting);
  },
  beforeDestroy: function() {
    tinymce.get(this.id).destroy();
  }
};
</script>
