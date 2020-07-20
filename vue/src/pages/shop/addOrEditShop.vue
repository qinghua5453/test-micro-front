<template>
  <el-dialog :title="addOrEditShopTitle" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1100px" top="20px">
    <el-form class="addShopForm" :rules="addShopRules" :model="addShop" ref="addShopForm" label-width="170px">
      <el-form-item label="店铺名称：" prop="shopName">
        <el-input clearable v-model="addShop.shopName" auto-complete="off" class="input-w"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="type">
        <el-select v-model="addShop.type" placeholder="请选择" style="width: 100%;" @change="changeShopType">
          <el-option v-for="item in shopTypeList" :label="item.name" :value="+item.id" :key="item.id" />
        </el-select>
      </el-form-item>
      <div v-if="disabled">
        <el-form-item label="学校名称：" class="shop-name" prop="school">
          <el-select v-model="addShop.school" value-key="name" style="width: 100%;" filterable remote placeholder="请输入学校名称" :remote-method="getOrgByName" @change="changeOrg">
            <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-row class="address-wrap">
        <el-form-item label="所在区域：" prop="areaIds">
          <q-area v-model="addShop.areaIds" :disabled="disabled" />
          <div class="el-form-item__error" v-if="isarea">请选择省市区</div>
        </el-form-item>
      </el-row>
      <el-form-item label="所在小区/大厦/学校：" class="form-item-m map-search" v-if="!disabled">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <div class="el-form-item__error" v-show="isposition">请填写所在小区/大厦/学校</div>
      </el-form-item>
      <el-form-item v-if="!disabled">
        <el-amap vid="amapDemo" :center="center" :zoom="zoom" :plugin="plugin" style="height: 300px;">
          <el-amap-marker :position="marker.position"></el-amap-marker>
        </el-amap>
      </el-form-item>
      <div v-if="disabled">
        <el-form-item label="详细地址：" class="shop-name" prop="organization">
          <el-input v-model="addShop.organization" :disabled="disabled"></el-input>
        </el-form-item>
      </div>
      <el-form-item :label="disabled ? '楼栋/栋层：' : '详细地址：'" prop="address">
        <el-input clearable v-model="addShop.address" auto-complete="off" class="input-w"></el-input>
      </el-form-item>
      <el-form-item label="店铺属性：" prop="attribute">
        <el-select style="width:100%;" v-model="addShop.attribute" placeholder="请选择">
          <el-option v-for="(name, id) in attributeType" :key="id" :label="name" :value="+id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select style="width:100%;" v-model="addShop.status" placeholder="请选择">
          <el-option v-for="(name, id) in shopType" v-show="Number(id) !== 4" :key="id" :label="name" :value="+id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商：" prop="operatorId">
        <el-select style="width:100%;" v-model="addShop.operatorId" filterable remote clearable :remote-method="getOperatorList" placeholder="请选择">
          <el-option v-for="item in operatorList" :key="item.id" :label="item.userName + (item.realName ? '(' + item.realName + ')' : '')" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="店铺图片：" class="form-item-m add-img" prop="image">
        <q-upload v-model="addShop.image" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer btn-footer">
      <el-button type="primary" @click="handleAdd('addShopForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QArea from "@/components/Area";
import QUpload from "@/components/Upload";
import { AttributeType, ShopType } from "@/utils/Mapping";
export default {
  components: {
    QArea,
    QUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: String,
      default: ""
    }
  },
  data() {
    let self = this;
    const validateAres = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("请选择省市区"));
      } else {
        callback();
      }
    };
    return {
      shopTypeList: [],
      addOrEditShopTitle: "新增店铺",
      //添加或者编辑店铺
      addShop: {
        id: "",
        shopName: "",
        operatorId: null,
        address: "",
        longitude: -1,
        latitude: -1,
        image: null,
        type: null,
        status: null,
        attribute: 0,
        areaIds: [],
        organization: "",
        orgAreaId: null,
        school: {}
      },
      //地图 城市搜索
      searchName: "", // 搜索城市
      searchOption: {
        city: "",
        citylimit: true
      },
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      zoom: 14,
      marker: {
        position: [121.5273285, 31.21515044]
        //icon: '../img/currentLocationCenter.png'
      },
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.marker.position = [self.lng, self.lat];
                  self.center = [self.lng, self.lat];
                  self.$nextTick();
                }
              });
            }
          }
        }
      ],
      addShopRules: {
        shopName: [
          { required: true, trigger: "blur", message: "请输入店铺名称" },
          {
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_-]{2,16}$/,
            message: "店铺名称需为2-16个字，只支持中英文、_和-",
            trigger: "blur"
          }
        ],
        type: [
          { required: true, message: "请选择店铺类型", trigger: "change" }
        ],
        address: [{ required: true, message: "内容不可为空", trigger: "blur" }],
        organization: [{ required: true, message: "内容不可为空", trigger: "blur" }],
        operatorId: [
          { required: true, message: "请选择运营商", trigger: "change" }
        ],
        attribute: [
          { required: true, message: "请选择属性", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        school: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value.name) {
                callback(new Error("请选择学校"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      orgList: [],
      disabled: false,
      isarea: false,
      isposition: false,
      operatorList: []
    };
  },
  computed: {
    attributeType() {
      return AttributeType;
    },
    shopType() {
      return ShopType;
    }
  },
  mounted() {
    if (this.shopId) {
      this.addOrEditShopTitle = "编辑店铺";
      this.getShopDetail();
    }
  },
  created() {
    this.getShopType();
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    // 获取店铺类型
    getShopType() {
      this.$axios.post(Api.GET_SHOP_TYPE).then(res => {
        this.shopTypeList = res;
      });
    },
    async getOperatorList(words) {
      if (words === "") return;
      let res = await this.$axios.post(Api.OPERATOR_NAME, { name: words });
      this.operatorList = res || [];
      return Promise.resolve();
    },
    async getOrgByName(words) {
      if (words === "") return;
      let res = await this.$axios.post(Api.SHOP_ORG, { name: words, type: 1 });
      this.orgList = res || [];
      return Promise.resolve();
    },
    changeShopType(val) {
      this.disabled = Number(val) === 1 ? true : false;
      this.addShopRules.address[0].required = Number(val) === 1 ? false : true;
    },
    changeOrg(item) {
      this.addShop.areaIds = [item.province, item.city, item.district];
      this.addShop.longitude = item.lng;
      this.addShop.latitude = item.lat;
      this.addShop.organization = item.organization;
      this.$refs.addShopForm.clearValidate(['organization']);
    },
    async getShopDetail() {
      this.$axios
        .post(Api.SHOP_DETAILS, {
          id: this.shopId
        })
        .then(res => {
          Object.keys(this.addShop).forEach(key => {
            this.addShop[key] = res[key];
          });
          this.addShop.shopName = res.name;
          this.addShop.address = res.realAddress;
          this.addShop.type = res.shopType;
          this.addShop.areaIds = [res.provinceId, res.cityId, res.districtId];
          // 地图相关
          this.center = [res.longitude, res.latitude];
          this.marker.position = [res.longitude, res.latitude];
          this.searchOption.city = res.cityName;
          this.getOperatorList(res.operatorName);
          this.disabled = Number(res.shopType) === 1 ? true : false;
          this.addShopRules.address[0].required = Number(res.shopType) === 1 ? false : true;
          if (res.orgName) {
            this.getOrgByName(res.orgName)
          }
          this.addShop.school = {
            id: res.orgAreaId,
            name: res.orgName
          };
        });
    },

    //搜索城市获取经纬度
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      this.center = [pois[0].lng, pois[0].lat];
      this.marker.position = [pois[0].lng, pois[0].lat];
      this.addShop.longitude = pois[0].lng;
      this.addShop.latitude = pois[0].lat;
      this.addShop.organization = pois[0].name;
      this.isposition =
        Number(this.addShop.longitude)>=0 && Number(this.addShop.latitude)>=0 ? false : true;
    },
    handleAdd(formName) {
      this.$refs[formName].validate(async valid => {
        this.isarea =
          this.addShop.areaIds[0] && this.addShop.areaIds[1] && this.addShop.areaIds[2]? false : true;
        this.isposition =
          Number(this.addShop.longitude)>=0 && Number(this.addShop.latitude)>=0  ? false : true;
        if (valid && !this.isarea && !this.isposition) {
          let { school, areaIds, ...payload } = this.addShop;
          payload.provinceId = areaIds[0];
          payload.cityId = areaIds[1];
          payload.districtId = areaIds[2];
          payload.orgAreaId = school.id || "";
          let apiUrl = payload.id ? Api.SHOP_UPDATE : Api.SHOP_ADD;
          this.$axios.post(apiUrl, payload).then(res => {
            this.modalClose();
            this.$message.success("操作成功！");
            this.$listeners.getShoplist && this.$listeners.getShoplist();
          });
        }else{
           this.$message.error("请输入完整信息");
           return false;
        }
      });
    }
  },
  watch: {
    "addShop.areaIds": {
      handler: function(val) {
        this.isarea = val.length >= 3 ? false : true;
      }
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.form-item-m {
  .el-vue-search-box-container {
    position: relative;
    width: 100%;
    height: 34px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    z-index: 10;
  }
}
.address-wrap /deep/ .el-form-item__label:before,
.map-search /deep/ .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.add-img {
  margin-top: 20px;
}
</style>
