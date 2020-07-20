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
        <!-- <el-row :gutter="20">
          <el-form-item label="封面图片" prop="cover">
            <ul class="imgUl">
              <li class="imgLi" v-for="(item,index) in coversList" :key="index" @click="addWarehouseForm.cover = item">
                <img :src="item" alt="">
                <div class="backbox" v-if="addWarehouseForm.cover == item">
                </div>
                <svg class="icon" aria-hidden="true" v-if="addWarehouseForm.cover == item">
                  <use xlink:href="#icon-checeked"></use>
                </svg>
              </li>
            </ul>
          </el-form-item>
        </el-row> -->
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
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="企鹅蛋" prop="tokenCoin">
              <el-input style="width:100%;" clearable v-model.trim="addWarehouseForm.tokenCoin" size="small" placeholder="请输入企鹅蛋"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button v-if="isScreen" :disabled="isLoading" type="primary" @click="onHandleAddWarehouse('addWarehouseForm')">通过</el-button>
          <el-button v-else type="primary" :disabled="isLoading" @click="onHandleEdit('addWarehouseForm')">保存</el-button>
          <el-button @click="mobileVisible = true" :disabled="isLoading">预览</el-button>
          <el-button v-if="isScreen" :disabled="isLoading" @click="showModel('addWarehouseForm')">驳回</el-button>
          <el-button :disabled="isLoading" @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="驳回" :close-on-click-modal="false" :visible.sync="deviceVisible" width="540px">
      <el-form :model="deviceSnForm" :rules="deviceSnFormRules" label-width="80px" ref="deviceSnForm" class="deviceSn-form">
        <el-form-item prop="remark" label="原因">
          <el-input type="textarea" ref="textArea" :rows="15" autofocus="true" v-model.trim="deviceSnForm.remark"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" :disabled="!deviceSnForm.remark" @click="onHandleAdd('deviceSnForm')">确定</el-button>
          <el-button @click="deviceVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="供求撮合" center :visible.sync="mobileVisible" width="750px">
      <div class="center-content" v-if="mobileVisible">
        <div class="title">
          {{addWarehouseForm.title}}
        </div>
        <div class="time">
          {{addWarehouseForm.createTime}}
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
  pairingDetailFun,
  coversListFun,
  pairingReviewFun,
  pairingEditFun
} from "../business";
import QUpload from "@/components/Upload";

import editor from '../../setting/helpCenter/editor'; // 根据editor.vue组件位置引入

export default {
  components: {
    QBreadcrumb,
    editor,
    QUpload
  },
  data() {
    return {
      breadData: ['商机管理', '供求撮合', '审核'],
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
        tokenCoin: 10,
      },
      mobileVisible: false,
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
          tokenCoin: [
            { required: true, message: '请输入企鹅蛋', trigger: 'blur' },
            {
              pattern:/^[1-9]\d*$|0/,
              message: "企鹅蛋必须为非负整数",
              trigger: "blur"
            }
          ],
      },
      biddingsId: '',
      coversList: [],
      deviceVisible: false,
      deviceSnForm:{
        remark:'',
      },
      deviceSnFormRules:{
        remark: [
          { required: true, message: '请输入原因', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'change' }
        ],
      },
      isScreen: false,
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
    this.coversList = [];
    this.getCoversList();
    if (this.$route.query.biddingsId) {
      this.biddingsId = this.$route.query.biddingsId;
      this.getBiddingDetail();
    }
  },
  mounted() {
  },
  methods: {
    async getBiddingDetail() {
      let par = {
        id: this.biddingsId,
      }
      let res = await pairingDetailFun(par);
      this.biddingData = res;
      this.addWarehouseForm = res;
      this.addWarehouseForm.id = this.biddingsId;
      if (this.addWarehouseForm.images) {
        let arr = this.addWarehouseForm.images.split(',');

        this.coversList = this.coversList.concat(arr);
      }
      if (this.$route.query.isScreen) {
        if (!this.addWarehouseForm.readNum || this.addWarehouseForm.readNum == 0) {
          this.getRandomNum();
        }
        // this.getRandomNum();
        // this.addWarehouseForm.tokenCoin = 10;
        this.breadData = ['商机管理', '供求撮合', '审核'];
        this.isScreen = true;
      } else {
        this.isScreen = false;
        this.breadData = ['商机管理', '供求撮合', '编辑'];
      }
    },
    async getCoversList() {
      let par = {
      }
      let res = await coversListFun(par);
      this.coversList = this.coversList.concat(res);
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
    showModel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (Number(this.addWarehouseForm.readNum) < Number(this.addWarehouseForm.support)) {
            this.$message.warning('点赞数不能大于阅读数!请修改后重试');
            return false;
          }
          this.deviceSnForm.remark = "";
          this.deviceVisible = true;
        } else {
          this.$message.warning('请补全必填项后重试!');
        }
      })
      
    },
    onHandleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var par = Object.assign({}, this.addWarehouseForm);
          par.release = 2;
          par.remark = this.deviceSnForm.remark;
          pairingReviewFun(par).then(resp => {
            this.$message.success('操作成功');
            this.isLoading = true;
            setTimeout(() => {
              this.$router.go(-1);
            }, 600);
          });
        } else {
          this.$message.warning('请补全必填项后重试!');
        }
      })
    },
    goBack() {
      this.$router.go(-1);
    },
    onHandleEdit(formName,index) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (Number(this.addWarehouseForm.readNum) < Number(this.addWarehouseForm.support)) {
            this.$message.warning('点赞数不能大于阅读数!请修改后重试');
            return false;
          }
          var par = Object.assign({}, this.addWarehouseForm);
          par.tags = String(par.tags);

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

          pairingEditFun(par).then(resp => {
            this.$message.success('操作成功');
            this.isLoading = true;
            setTimeout(() => {
              this.$router.go(-1);
            }, 600);
          });
        } else {
          this.$message.warning('请补全必填项后重试!');
        }
      })
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

          par.release = 1;
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
          pairingReviewFun(par).then(resp => {
            this.$message.success('操作成功');
            this.isLoading = true;
            setTimeout(() => {
              this.$router.go(-1);
            }, 600);
          });
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
.tips{
  color: red;
  font-size: 12px;
}
</style>
