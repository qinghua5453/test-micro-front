<template>
  <el-dialog :title="title" :visible="visible" :before-close="modalClose" :close="modalClose" width="1000px" top="10vh">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="位置归属" prop="appId">
                <el-select v-model="ruleForm.appId" placeholder="请选择位置归属" @change="changeAdvertiseSlot">
                  <el-option v-for="item in appSolt" :key="item.appId" :label="item.appName" :value="+item.appId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="位置名称" prop="slotId">
                <el-select v-model="ruleForm.slotId" placeholder="请选择位置名称" @change="getimageSize">
                  <el-option
                    v-for="item in adverstiseSolt"
                    :key="item.slotId"
                    :label="item.slotName"
                    :data-imagesize="item.imageSize"
                    :data-previewimage="item.previewImage"
                    :value="+item.slotId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="广告时间" prop="time">
            <el-date-picker
              style="width:100%;"
              v-model="ruleForm.time"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio v-for="(name, id) in addvertiseSoltStatus" :key="id" :label="+id">{{ name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="展示类型" prop="showType">
            <el-radio-group v-model="ruleForm.showType">
              <el-radio v-for="(name, id) in slotExhibitionType" :key="id" :label="+id">{{ name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="pic-block">
            <div v-for="(item, index) in ruleForm.images" :key="index">
              <el-form-item label="广告图片：" class="form-item-m add-img" :prop="'images.' + index + '.imageUrl'" :rules="rules.imageUrl">
                <p>图片尺寸:{{ imageSize }}</p>
                <q-upload v-model="item.imageUrl" :size="size" />
              </el-form-item>
              <el-form-item label="链接类型" :prop="'images.' + index + '.linkType'" :rules="rules.linkType">
                <el-select v-model="item.linkType" placeholder="请选择链接类型">
                  <el-option v-for="(name, id) in addvertiseLinkType" :key="id" :label="name" :value="+id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="链接地址" :prop="'images.' + index + '.linkUrl'" :rules="rules.linkUrl">
                <el-input v-model.trim="item.linkUrl" placeholder="请输入链接地址"></el-input>
              </el-form-item>
              <el-form-item label="权重" :prop="'images.' + index + '.probability'" :rules="rules.probability">
                <el-input v-model="item.probability" placeholder="请输入随机概率"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="ruleForm.images.length > 1" @click.prevent="removeDomain(item)">删除图片</el-button>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <el-button type="primary" @click="addImagesForm">新增图片</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="modalClose">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10">
        <img v-if="previewImage" :src="previewImage" alt="预览图" class="preview_img" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from '@/utils/Api';
import QUpload from '@/components/Upload';
import { addvertiseSoltStatus, addvertiseLinkType,slotExhibitionType} from '@/utils/Mapping';
export default {
  props: ['id', 'visible', 'appSolt'],
  components: {
    QUpload
  },
  data() {
    return {
      adverstiseSolt: [],
      title: '新增广告配置',
      ruleForm: {
        appId: '',
        slotId: '',
        title: '',
        time: [],
        status: 1,
        showType: 1,
        images:[
          {
            linkType: '',
            linkUrl: '',
            imageUrl: '',
            probability:''
          }
        ]
      },
      imageSize: '',
      size:200,//图片限制
      previewImage: '',
      rules: {
        appId: [{ required: true, message: '请选择位置归属', trigger: 'change' }],
        slotId: [{ required: true, message: '请选择位置名称', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { max: 20, message: '标题不超过20字', trigger: 'blur' }],
        time: [{ type: 'array', required: true, message: '请选择广告时间', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        showType: [{ required: true, message: '请选择展示类型', trigger: 'change' }],
        linkType: [{ required: true, message: '请选择链接类型', trigger: 'change' }],
        linkUrl: [{ required: true, message: '请输入链接地址', trigger: 'change' }],
        imageUrl: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
        probability: [{ required: true, message: '请输入随机概率',trigger: 'blur' },
                      { pattern:/^(1|([1-9]\d{0,1})|100)$/,  message: '请输入1-100之间的正整数'}],
      }
    };
  },
  computed: {
    addvertiseLinkType() {
      return addvertiseLinkType;
    },
    addvertiseSoltStatus() {
      return addvertiseSoltStatus;
    },
    slotExhibitionType() {
      return slotExhibitionType;
    }
  },
  created() {
    if (this.id) {
      this.title = '编辑广告配置';
      this.getDetali();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetali() {
      this.$axios.post(Api.SOLT_CONFIG_GET, { id: this.id }).then(res => {
        this.ruleForm = this.getPorpery(this.ruleForm, res);
        this.ruleForm.time = [res.startTime, res.endTime];
        this.ruleForm.id = res.id;
        this.imageSize = res.imageSize;
        this.previewImage = res.previewImage;
        this.getAdverstiseSolt();
      });
    },
    getPorpery(obj2, obj1) {
      let a = {};
      Object.keys(obj2).map(function(key) {
        a[key] = obj2[key] = obj1[key];
      });
      return a;
    },
    changeAdvertiseSlot(val) {
      this.size = Number(val) === 2 ? 60 : 200;
      this.adverstiseSolt = [];
      this.ruleForm.slotId = '';
      this.previewImage = '';
      val && this.getAdverstiseSolt();
    },
    getAdverstiseSolt() {
      this.$axios.post(Api.SOLT_LIST, { appId: this.ruleForm.appId }).then(res => {
        this.adverstiseSolt = res;
      });
    },
    getimageSize(slotId) {
      let obj = this.adverstiseSolt.find(item => item.slotId === slotId);
      this.imageSize = obj ? obj.imageSize : '';
      this.previewImage = obj ? obj.previewImage : '';
    },
    addImagesForm(){
      this.ruleForm.images.push({
          linkType: '',
          linkUrl: '',
          imageUrl: '',
          probability:''
        });
    },
    removeDomain(item) {
      let index = this.ruleForm.images.indexOf(item)
      if (index !== -1) {
        this.ruleForm.images.splice(index, 1)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.ruleForm);
          payload.startTime = payload.time ? payload.time[0] : null;
          payload.endTime = payload.time ? payload.time[1] : null;
          payload.time = null;
          let url = this.id ? Api.SOLT_CONFIG_EDIT : Api.SOLT_CONFIG_ADD;
          if(payload.showType === 3){
            let total = 0;
            payload.images.forEach(item=>{
              total += Number(item.probability);
            })
            if(total!==100){
              this.$message.error('权重总和不等于100');
              return false;
            }
          }
          payload = {
            json:JSON.stringify(payload)
          }
          this.$axios.post(url, payload).then(res => {
            this.$message.success('操作成功！');
            this.modalClose();
            this.$listeners.getAdvertiseSlotList && this.$listeners.getAdvertiseSlotList();
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.preview_img {
  display: block;
  width: 100%;
  height: 100%;
}
.pic-block {
  min-height: 500px;
  overflow: scroll;
  padding-bottom: 40px;
}
</style>
