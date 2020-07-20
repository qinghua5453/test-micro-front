<template>
  <el-dialog title="适用店铺" :visible="visible" :before-close="modalClose" :close="modalClose" width="520px" top="10vh">
    <el-form :model="ruleForm" ref="ruleForm" :inline="true" label-position="left" class="demo-ruleForm">
      <el-form-item label="店铺名称" prop="title">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <ul class="shop">
      <li v-for="item in list" :key="item.id">{{item.name}}</li>
      <el-button type="primary" @click="modalClose">确定</el-button>
    </ul>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
export default {
  props: ['id', 'visible'],
  data() {
    return {
      ruleForm: {
        name
      },
      list: [],
      bakList: []
    };
  },
  created() {
    console.log(this.id);

    this.id && this.getShops();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getShops() {
      this.$axios.post(Api.VIP_MEMBER_SHOPs, { id: this.id }).then(res => {
        this.list = res;
        this.bakList = res;
      });
    },
    search() {
      //搜索
      var tmplist = this.bakList;
      if (this.ruleForm.name) {
        this.list = tmplist.filter(item => item.name.includes(this.ruleForm.name));
      } else {
        this.list = this.bakList;
      }
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.shop {
  text-align: center;
  li {
    line-height: 32px;
  }
  /deep/ button {
    margin-top: 20px !important;
  }
}
</style>
