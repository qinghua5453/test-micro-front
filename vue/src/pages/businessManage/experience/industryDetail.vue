<template>
  <div class="add-warehouse-page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['商机管理', '行业经验', '详情']" />
    <div class="add-warehouse">
      <div class="center-content">
        <div class="title">
          {{addWarehouseForm.title}}
        </div>
        <div class="time">
          {{addWarehouseForm.releaseTime}}
        </div>
        <div class="content" v-html="addWarehouseForm.content">
        </div>
        <div class="botBtns">
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
      <el-form :model="addWarehouseForm" label-width="110px" ref="addWarehouseForm" class="add-warehouse-form">
        <el-row :gutter="20">
          <el-form-item label="标签:">
            <div class="tagUl">
              <span class="tagLi" v-for="(item,index) in addWarehouseForm.tags" :key="index">
                {{checkTagList(item)}}
              </span>
            </div>
          </el-form-item>
        </el-row>
         <el-row :gutter="20">
          <el-form-item label="阅读量:">
            {{addWarehouseForm.readNum}}
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="点赞量:">
            {{addWarehouseForm.support}}
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <div class="line">

          </div>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="封面图片:">
            <ul class="imgUl">
              <li class="imgLi" v-for="(item,index) in coversList" :key="index">
                <img :src="item" alt="">
              </li>
            </ul>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="创建时间:">
            {{addWarehouseForm.createTime}}
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="创建人:">
            {{addWarehouseForm.creator}}
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="最后更新时间:">
            {{addWarehouseForm.updateTime}}
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="最后更新人:">
            {{addWarehouseForm.editor}}
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import {
  tagsListFun,
  industryDetailFun,
} from "../business";

export default {
  components: {
    QBreadcrumb,
  },
  data() {
    return {
      addWarehouseForm: {
        "id": "", //文章id
        "title": "",
        "content": "",
        "releaseTime": "", //发布时间
        "cover": "",   //封面url
        readNum: null,
        support: null,
        tokenCoin: 20,
        tags: []
      },
      tagsList: [],
      biddingsId: '',
      coversList: []
    };
  },
  created() {
    this.coversList = [];
    this.getTagList();
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
      let res = await industryDetailFun(par);
      this.biddingData = res;
      this.addWarehouseForm = res;
      this.addWarehouseForm.id = this.biddingsId;
      this.coversList.push(res.cover);
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
    checkTagList(item) {
      for (let i = 0; i < this.tagsList.length; i++) {
        const element = this.tagsList[i];
        if (element.id == item) {
          return element.name;
        }
      }
    },
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.add-warehouse {
  background: #fff;
  overflow: hidden;
  .center-content {
    background: #fff;
    width: 50%;
    float: left;
    margin-left: 25%;
    padding: 50px 20px;
    box-sizing: border-box;
    border-right: 2px solid #ccc;
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
  }
  .add-warehouse-form {
    background: #fff;
    width: 25%;
    float: right;
    padding: 50px 20px;
    box-sizing: border-box;
    .line {
      width: 100%;
      background: #ccc;
      height: 1px;
      margin-bottom: 20px;
      margin-left: 30px;
      box-sizing: border-box;
    }
    /deep/ .el-form-item {
      margin-bottom: 8px;
    }
  }
  .warehouse-row {
    display: flex;
  }
  .content {
    font-size: 14px;
    word-wrap:break-word;
    /deep/ div {
      line-height: 1.5;
    }
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
.tagUl{
  width: 100%;
  display: block;
  flex-wrap: wrap;
  .tagLi{
    margin-top: 5px !important;
    padding: 7px 20px !important;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    font-size: 14px;
    border-radius: 4px;
    display: inline-block;
    margin-right: 14px;
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
  }
}
.botBtns {
  text-align: center;
  margin-top: 20px;
}
</style>
