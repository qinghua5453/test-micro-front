<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="640px"
  >
    <div class="bd-con">
      <el-form
        :model="detergentForm"
        :rules="detergentFormRules"
        ref="detergentForm"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="类别：" prop="brandTypeId">
          <el-radio-group v-model="detergentForm.brandTypeId" :disabled="editdisabled">
            <el-radio v-for="item in brandTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌：" prop="brandNameId">
          <el-radio-group v-model="detergentForm.brandNameId" :disabled="editdisabled">
            <el-radio v-for="item in brandNames" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格：" prop="qty">
          <el-radio-group v-model="detergentForm.qty" :disabled="editdisabled">
            <el-radio v-for="(name, id) in detergentQtyType" :key="id" :label="(+id)">{{name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="detergentForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="单次用量(ml):" prop="amount">
          <el-input v-model.number.trim="detergentForm.amount" placeholder="请输入单次用量"></el-input>
        </el-form-item>
        <el-form-item label="单次价格(元):" prop="price">
          <el-input v-model.trim="detergentForm.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo：" class="form-item-m add-img" prop="logo">
          <q-upload v-model="detergentForm.logo" :size="200" :layout="true" :width="200" :height="200"/>
        </el-form-item>
        <el-form-item label="语音提示：" class="form-item-m add-img" prop="voice">
          <el-upload class="upload-demo" ref="upload" action="#" :limit="1" :before-upload="beforeUpload" :http-request="handleUpload">
          <div class="upload_template">
            <el-button slot="trigger" type="primary" class="upload_btn"> <i class="el-icon-paperclip"></i>上传语音文件 </el-button>
          </div>
        </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click="handleDetergent('detergentForm')">提交</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QUpload from "@/components/Upload";
import {  detergentQtyType } from "@/utils/Mapping";
import { brandDetailFun, brandAddFun, brandEditFun,brandTypesFun,brandNamesFun } from '../detergent';

export default {
  components: {
    QUpload
  },
  props: ["visible", "brandId"],
  data() {
    return {
      title: "新增洗衣液/除菌液",
      detergentForm: {
        id:'',
        brandTypeId: 1,
        brandNameId: 1,
        qty: 2000,
        name:'',
        amount: "",
        price: "",
        logo: "",
        voice:''
      },
      detergentFormRules: {
        brandTypeId: [
          { required: true, message: "请选择类别", trigger: "change" }
        ],
        brandNameId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        qty: [{ required: true, message: "请选择规格", trigger: "change" }],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2-15个字符", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入单次用量", trigger: "blur" },
          {
            type: "number",
            pattern:/^[0-9]+$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { pattern: /^(([0-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[0-9]{0,2}|99|99.0|99.00)$/, message: '请输入0.01-99.99之间的数', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: "请上传品牌logo", trigger: "blur" },
        ]
      },
      brandNames:[],
      brandTypes:[],
      editdisabled: false,
    };
  },
  computed: {
    detergentQtyType() {
      return detergentQtyType;
    }
  },
  created() {
    this.getBrandTypesFun()
      this.getBrandNamesFun()
      if(this.brandId){
          this.title = '编辑洗衣液/除菌液';
          this.editdisabled = true;
          this.getBrandDetail();
      }
      
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    async getBrandDetail(){
      let res = await brandDetailFun({brandId:this.brandId});
      Object.keys(this.detergentForm).forEach(key => {
        this.detergentForm[key] = res[key];
      });
    },
    async getBrandTypesFun(){
      let res = await brandTypesFun();
      this.brandTypes= res;
    },
    async getBrandNamesFun(){
      let res = await brandNamesFun();
      this.brandNames = res;
    },
     beforeUpload(file) {
       console.log(file);
      if (file.type !== "video/mp3" && file.type !== "video/mpeg" && file.type !== "video/ogg" && file.type !== "video/wav") {
        this.$message.warning("上传音频文件格式不正确!");
        return false;
      }
      if (file.size > 0 && (file.size / 1024 / 1024) > 5) {
        this.$message.warning(`上传文件大小不能超过5MB!`);
        return false;
      }
      return true; 
    },
    // 自定义上传
    handleUpload({ file }) {
      // 上传文件
      let formData = new FormData();
      formData.append('files[]', file);
      this.$axios.post(Api.COMMON_UPLOAD, formData).then(resp => {
        if (resp.length > 0) {
          const file = resp[0].url;
          this.detergentForm.voice = file;
        }
      });
    },
    handleDetergent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.detergentForm);
          let fun = this.brandId ? brandEditFun : brandAddFun;
          fun(payload).then(res => {
            this.$listeners.getDetergentList && this.$listeners.getDetergentList();
              this.$message.success('操作成功！');
              this.modalClose();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped></style>
