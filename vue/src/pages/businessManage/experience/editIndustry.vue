<template>
  <div class="add-warehouse-page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="breadData" />
    <div class="add-warehouse">
      <el-form :model="addWarehouseForm" label-width="110px" :rules="addWarehouseFormRules" ref="addWarehouseForm" class="add-warehouse-form">
        <el-row :gutter="20">
          <el-form-item label="标题" prop="title">
            <el-input style="width:100%;" v-model.trim="addWarehouseForm.title" size="small" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="正文" prop="content">
            <editor
              class="editor"
              v-model="addWarehouseForm.content"
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
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="封面图片" prop="cover">
            <q-upload v-model="addWarehouseForm.cover" :showWH="true" />
            <div class="tips">
              尺寸360px*454px, 支持.jpg, .jpeg, .png格式, 小于2M
            </div>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="标签" prop="tags">
            <el-checkbox-group v-model="addWarehouseForm.tags">
              <el-checkbox v-for="(item,index) in tagsList" :key="index" :label="item.id" :value="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="默认阅读量" prop="readNum">
              <el-input style="width:100%;" clearable v-model.trim="addWarehouseForm.readNum" size="small" placeholder="请输入默认阅读量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认点赞量" prop="support">
              <el-input style="width:100%;" clearable v-model.trim="addWarehouseForm.support" size="small" placeholder="请输入默认点赞量"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :disabled="isLoading" @click="onHandleAddWarehouse('addWarehouseForm')">确定</el-button>
          <el-button @click="mobileVisible = true" :disabled="isLoading">预览</el-button>
          <el-button :disabled="isLoading" @click="onHandleAddWarehouse('addWarehouseForm',1)">保存并发布</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="行业经验" center :visible.sync="mobileVisible" width="750px">
      <div class="center-content" v-if="mobileVisible">
        <div class="title">
          {{addWarehouseForm.title}}
        </div>
        <div class="time">
          {{addWarehouseForm.releaseTime}}
        </div>
        <div class="content" v-html="addWarehouseForm.content">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import  moment from 'moment'
import { assetStatusType } from "@/utils/Mapping";
import User from '@/utils/User';
import {
  tagsListFun,
  industryDetailFun,
  coversListFun,
  industryEditFun,
  industryAddFun
} from "../business";

import editor from '../../setting/helpCenter/editor'; // 根据editor.vue组件位置引入
import QUpload from "@/components/Upload";

export default {
  components: {
    QBreadcrumb,
    editor,
    QUpload
  },
  data() {
    return {
      breadData: ['商机管理', '行业经验', '编辑'],
      editorSetting: {
        // 配置富文本编辑器高
        height: 300
      },
      Url: 'common/uploadFile', // 图片对应的上传地址
      Accept: 'image/jpeg, image/png', // 文件格式
      withCredentials: true,
      content: '', // 富文本编辑器双向绑定的内容
      addWarehouseForm: {
        "id": "", //文章id
        "title": "",
        "content": "",
        "cover": "",   //封面url
        readNum: null,
        support: null,
        tags: []
      },
      addWarehouseFormRules:{
          content: [
            { required: true, message: '请输入正文', trigger: 'change' },
          ],
          cover: [
            { required: true, message: '请选择封面图片', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'change' }
          ],
          tags: [
            { required: true, message: '请选择标签', trigger: 'change' },
          ],
          readNum: [
            { required: true, message: '请输入默认阅读量', trigger: 'blur' },
            {
              pattern:/^[1-9]\d*$/,
              message: "阅读数量必须为正整数",
              trigger: "blur"
            }
          ],
          support: [
            { required: true, message: '请输入默认点赞量', trigger: 'blur' },
            {
              pattern:/^[1-9]\d*$/,
              message: "点赞数量必须为正整数",
              trigger: "blur"
            }
          ],
      },
      tagsList: [],
      biddingsId: '',
      coversList: [],
      isAdd: true,
      mobileVisible: false,
      isLoading: false,
    };
  },
  computed: {
    assetStatusType() {
      return assetStatusType;
    },
    computedImeiCount() {
      let list = this.handleImeiList();
      return list.length;
    }
  },
  created() {
    this.getTagList();
    if (this.$route.query.biddingsId) {
      this.isAdd = false;
      this.biddingsId = this.$route.query.biddingsId;
      this.getBiddingDetail();
      this.breadData = ['商机管理', '行业经验', '编辑'];
    } else {
      this.isAdd = true;
      this.getRandomNum();
      this.breadData = ['商机管理', '行业经验', '新增'];
    }
  },
  mounted() {
  },
  methods: {
    async getBiddingDetail() {
      let par = {
        id: this.biddingsId,
      }
      let res = await industryDetailFun(par);
      this.biddingData = res;
      this.addWarehouseForm = res;
      this.addWarehouseForm.id = this.biddingsId;
      // this.addWarehouseForm.tags = [];
      if (!this.addWarehouseForm.tags) {
        this.addWarehouseForm.tags = [];
      }
      if (this.$route.query.isScreen) {
        // this.getRandomNum();
      }
    },
    async getTagList() {
      let par = {
        category: 2
      }
      let res = await tagsListFun(par);
      this.tagsList = res;
    },
    goBack() {
      this.$router.go(-1);
    },
    getRandomNum() {
      function sum (m,n){
      　　var num = Math.floor(Math.random()*(m - n) + n);
      　　return num;
      }
      var num1 = sum(800,2000);
      var num2 = sum(800,2000);
      if (num1 <= num2) {
        this.addWarehouseForm.readNum = num2;
        this.addWarehouseForm.support = num1;
      } else {
        this.addWarehouseForm.readNum = num1;
        this.addWarehouseForm.support = num2;
      }
    },
    editors(content) {
      // editor组件传过来的值赋给content
      this.addWarehouseForm.content = content;
    },
    onEditorReady(ins, ina) {
      // 上传失败的函数
      this.$message.error('上传失败');
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      this.addWarehouseForm.content = this.addWarehouseForm.content + '<img src=' + json[0].data.filePath + '>';
    },
    changeCompany() {
      if (!this.addWarehouseForm.companyId) {
         this.filterOptions = JSON.parse(JSON.stringify(this.companyNames));
      }
    },
    onHandleAddWarehouse(formName,index) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (Number(this.addWarehouseForm.readNum) < Number(this.addWarehouseForm.support)) {
            this.$message.warning('点赞数不能大于阅读数!请修改后重试');
            return false;
          }
          var par = Object.assign({}, this.addWarehouseForm);
          par.tags = String(par.tags);
          if (index) {
            par.release = 2;
          } else {
            par.release = 1;
          }
          //图片处理

          let myContent = par.content;
          var imgReg = /<img.*?(?:>|\/>)/gi;
          //匹配src属性
          var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var widthReg = /width=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var heightReg = /height=[\'\"]?([^\'\"]*)[\'\"]?/i;
          var tarr = myContent.match(imgReg);

          if (tarr && tarr.length > 0) {
            let images = [];
            let imagesArr = [];
            for (let i = 0; i < tarr.length; i++) {
              const element = tarr[i];
              var src = element.match(srcReg);
              var widthArr = element.match(widthReg);
              var heightArr = element.match(heightReg);
              let imgUrl = src[1];
              let pureUrl = src[1];
              let finalUrl = src[1];
              if(imgUrl){
                pureUrl = pureUrl.split("?");
              }
              if(heightArr && heightArr[1] && widthArr && widthArr[1]){

                  finalUrl = pureUrl[0] + "?penguin_w=" + widthArr[1] + "&penguin_h=" + heightArr[1];
                  images.push(finalUrl);
              } else {
                images.push(imgUrl);
              }
              let contentArr = myContent.split(src[1]);
              contentArr.splice(1, 0, finalUrl);
              myContent = contentArr.join("");
            }

            par.images = images && images.length > 0 ? String(images) : "";
            par.content = myContent;
          }

          if (this.isAdd) {
            industryAddFun(par).then(resp => {
              this.$message.success('添加成功');
              this.isLoading = true;
              setTimeout(() => {
                this.$router.go(-1);
              }, 600);
            });
          } else {
            industryEditFun(par).then(resp => {
              this.$message.success('操作成功');
              this.isLoading = true;
              setTimeout(() => {
                this.$router.go(-1);
              }, 600);
            });
          }
        } else {
          this.$message.warning('请补全必填项后重试!');
        }
      })
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.add-warehouse {
  background: #fff;
  padding-bottom: 20px;
  .add-warehouse-form {
    width: 50%;
    margin: 0 auto;
    padding-top: 50px;
  }
  .warehouse-row {
    display: flex;
  }
}
.imgUl{
  overflow: hidden;
  .imgLi{
    float: left;
    margin-right: 20px;
    position: relative;
    img{
      width: 100px;
      height: 100px;
    }
    .backbox{
      position: absolute;
      right: 0;
      top: 0;
      width: 13px;
      height: 13px;
      background: #fff;
    }
    .icon{
      position: absolute;
      right: -5px;
      top: 0;
      width: 30px;
      height: 30px;
    }
  }
}
.tips{
  color: red;
  font-size: 12px;
}
.center-content {
  background: #fff;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 1.5;
  }
  .time {
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 20px;
    color: #666;
  }
  .content {
    font-size: 14px;
    /deep/ table {
      border-collapse: separate;
      border-spacing: 2px;
      max-width: 100%;
      td {
        border: 1px solid #ccc;
      }
      th {
        border: 1px solid #ccc;
      }
    }
    /deep/ img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
