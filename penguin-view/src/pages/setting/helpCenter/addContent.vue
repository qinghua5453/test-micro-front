<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="800px">
    <el-form class="addHelpForm" :rules="helprules" :model="addHelpForm" ref="addHelpForm" label-width="125px">
      <el-form-item label="标题：" class="form-item-m" prop="title">
        <el-input clearable v-model="addHelpForm.title" auto-complete="off" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="分类：" class="form-item-m" prop="type">
        <el-select v-model="addHelpForm.type" placeholder="请选择内容分类" @change="getTags" style="width: 100%;">
          <el-option v-for="(name, id) in HelpType" :key="id" :label="name" :value="+id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签：">
        <el-select v-model="addHelpForm.tagName" filterable allow-create @change="tagChange" placeholder="请选择标签" style="width: 100%;">
          <el-option v-for="item in tagOptions" :key="item.id" :label="item.tagName" :value="item.tagName"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容：">
        <editor
          class="editor"
          v-model="content"
          :setting="editorSetting"
          @show="editors"
          :url="Url"
          :accept="Accept"
          :with-credentials="withCredentials"
          @on-upload-fail="onEditorReady"
          @on-upload-success="onEditorUploadComplete"
        >
        </editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click="addHelp('addHelpForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Api from '@/utils/Api';
import { HelpType } from '@/utils/Mapping';
import editor from './editor'; // 根据editor.vue组件位置引入

export default {
  components: {
    editor
  },
  props: ['visible', 'helpId', 'contentRow'],
  computed: {
    HelpType() {
      return HelpType;
    }
  },
  data() {
    return {
      editorSetting: {
        // 配置富文本编辑器高
        height: 300
      },
      Url: 'common/uploadFile', // 图片对应的上传地址
      Accept: 'image/jpeg, image/png', // 文件格式
      withCredentials: true,
      content: '', // 富文本编辑器双向绑定的内容
      addHelpForm: {
        id: '',
        title: '',
        type: null,
        tagName: ''
      },
      helprules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 40, message: '标题长度不超过40个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择分类', trigger: 'change' }]
      },
      title: '新增内容',
      tagOptions: []
    };
  },
  created() {
    if (this.helpId) {
      this.title = '编辑内容';
      this.addHelpForm.id = this.contentRow.id;
      this.addHelpForm.title = this.contentRow.questionTitle;
      this.addHelpForm.type = this.contentRow.type;
      this.content = this.contentRow.answerContent;
      this.addHelpForm.tagName = this.contentRow.tagName;
      this.getTags(this.contentRow.type);
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getTags(val) {
      this.$axios.post(Api.HELP_TAG_LIST, { type: 1000, subType: '100' + val }).then(res => {
        this.tagOptions = res.items;
      });
    },
    createTag(name) {
      this.$axios.post(Api.HELP_TAG_CREATE, { tagName: name, type: 1000, subType: '100' + this.addHelpForm.type }).then(res => {
        if (res.state) {
          this.tagOptions.push({ id: res.tagId, type: 1000, subType: '100' + this.addHelpForm.type, tagName: name });
        }
      });
    },
    tagChange(val) {
      let flag = this.tagOptions.every(item => val !== item.tagName);
      if (flag && val) {
        this.createTag(val);
      }
    },
    editors(content) {
      // editor组件传过来的值赋给content
      this.content = content;
    },
    onEditorReady(ins, ina) {
      // 上传失败的函数
      this.$message.error('上传失败');
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      this.content = this.content + '<img src=' + json[0].data.filePath + '>';
    },
    addHelp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.content === '') {
            this.$message.error('请填写内容');
            return false;
          }
          let tags = this.tagOptions.find(i => this.addHelpForm.tagName === i.tagName);
          let payload = Object.assign({ tagId: tags ? tags.id : '', content: this.content }, this.addHelpForm);
          let apiUrl = payload.id ? Api.HELP_UPDATE : Api.HELP_ADD;
          this.$axios.post(apiUrl, payload).then(res => {
            this.$listeners.getHelpList && this.$listeners.getHelpList();
            this.$message.success('操作成功！');
            this.modalClose();
          });
        }
      });
    }
  }
};
</script>

<style></style>
