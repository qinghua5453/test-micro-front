
<template>
  <section v-if="getPerm('statis:getStatusDevice')">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="区域：">
            <q-area v-model="searchData.areaIds" size="small" default-option="不限" />
          </el-form-item>
          <el-form-item label="一级类型：" prop="firstTypeId">
            <el-select size="small" v-model="searchData.parentType" placeholder="不限">
              <el-option label="不限" :value="null"></el-option>
              <el-option v-for="item in firstTypes" :key="item.id" :label="item.machineTypeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="searchData.shopType" size="small" placeholder="不限">
              <el-option label="不限" :value="null" />
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in shopTypeList" />
            </el-select>
          </el-form-item>
          <el-form-item label="通信类型：">
            <el-select size="small" v-model="searchData.communicateType" style="width: 140px;" placeholder="不限">
              <el-option value="" label="全部">全部</el-option>
              <el-option value="0" label="脉冲"></el-option>
              <el-option value="1" label="串口"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商：">
            <el-input size="small" clearable v-model="searchData.operator"></el-input>
          </el-form-item>
          <el-form-item label="店铺名称：">
            <el-input size="small" clearable v-model="searchData.shop"></el-input>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <ul class="machine-wrap">
            <li>
              <p class="title">有效设备数<el-tooltip content="按设备状态＝空闲+预约+使用中的设备IMEI号去重统计（实时）" placement="top">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfontquestion"></use>
                  </svg>
                </el-tooltip>
              </p>
              <p class="machine-icon"><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dagouyouquan"></use>
                </svg></p>
              <p class="num">{{data.deviceValidCount | numFormat}}</p>
              <p class="point" v-if="!String(data.deviceValidRatio).includes('N/A')">{{data.deviceValidRatio}}</p>
            </li>
            <li style="background:#C3C3C3">
              <p class="title">离线设备数<el-tooltip content="按状态＝离线的设备IMEI号去重统计（实时）" placement="top">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfontquestion"></use>
                  </svg>
                </el-tooltip>
              </p>
              <p class="machine-icon"><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-lixian"></use>
                </svg></p>
              <p class="num">{{data.deviceOfflineCount | numFormat}}</p>
              <p class="point" v-if="!String(data.deviceOfflineRatio).includes('N/A')">{{data.deviceOfflineRatio}}</p>
            </li>
            <li style="background:#F8D347">
              <p class="title">故障设备数<el-tooltip content="按状态＝故障的设备IMEI号去重统计（实时）" placement="top">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfontquestion"></use>
                  </svg>
                </el-tooltip>
              </p>
              <p class="machine-icon"><svg class="icon" aria-hidden="true" style="color:#fff">
                  <use xlink:href="#icon-taizhanguzhang"></use>
                </svg></p>
              <p class="num">{{data.deviceHitchCount | numFormat}}</p>
              <p class="point" v-if="!String(data.deviceHitchRatio).includes('N/A')">{{data.deviceHitchRatio}}</p>
            </li>
            <li style="background:#6CCAC9">
              <p class="title">微信支付设备数<el-tooltip content="开通了微信支付功能的活跃设备数（非实时数据，统计昨日）" placement="top">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfontquestion"></use>
                  </svg>
                </el-tooltip>
              </p>
              <p class="machine-icon"><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weixin"></use>
                </svg></p>
              <p class="num">{{data.deviceWeixinCount | numFormat}}</p>
              <p class="point" v-if="!String(data.deviceWeixinRatio).includes('N/A')">{{data.deviceWeixinRatio}}</p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
import QArea from "@/components/Area";
import Api from "@/utils/Api";
import moment from "moment";
import DataUtils from "@/utils/Data";
export default {
  name: "firm-order",
  components: {
    QArea
  },
  data () {
    return {
      data: {}, // 数据
      searchData: {},
      shopTypeList: [], // 店铺类型
      firstTypes: [] // 一级类型
    };
  },
  created () {
    if (this.getPerm("statis:getStatusDevice")) {
      this.getShopType();
      this.getMachineType();
      this.getDeviceStatus();
    }
  },
  methods: {
    // 获取店铺类型
    getShopType () {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
      });
    },
    //获取二级类型
    getMachineType () {
      return this.$axios
        .post(Api.MACHINE_GETTYPELIST, { parentId: 0 })
        .then(resp => {
          this.firstTypes = resp;
        });
    },
    //明细列表
    getDeviceStatus () {
      let query = Object.assign({}, this.searchData);
      // 地区转换
      query.province = query.areaIds ? query.areaIds[0] : null;
      query.city = query.areaIds ? query.areaIds[1] : null;
      query.district = query.areaIds ? query.areaIds[2] : null;
      query.areaIds = null;
      this.$axios.post(Api.DEVICE_STATUS_STATIS, query).then(res => {
        this.data = res;
      });
    },
    //根据条件查询
    goSearch () {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          this.getDeviceStatus();
        }
      });
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"])
  }
};
</script>

<style lang='less' scoped type='text/css'>
.tab-s {
  padding: 20px 0;
}
.machine-wrap {
  width: 60%;
  overflow: hidden;
  display: flex;
  padding-left: 30px;
  li {
    width: 160px;
    background: #57c8f2;
    border-radius: 5px;
    color: #fff;
    margin-right: 40px;
    text-align: center;
    padding-bottom: 20px;
    .icon {
      margin: 0;
      font-size: 16px;
    }
  }
  .title {
    font-size: 16px;
    padding-top: 20px;
    .icon {
      font-size: 16px;
    }
  }
  .machine-icon .icon {
    font-size: 40px;
    padding-top: 15px;
  }
  .num {
    font-size: 20px;
    padding-top: 15px;
  }
  .point {
    font-size: 14px;
    padding-top: 15px;
  }
}
@media screen and (max-width: 1336px) {
  .machine-wrap {
    width: 90% !important;
    .title {
      font-size: 16px !important;
      .icon {
        font-size: 14px !important;
        margin: 0;
      }
    }
    .machine-icon .icon {
      font-size: 50px !important;
    }
    .num {
      font-size: 22px !important;
    }
    .point {
      font-size: 14px !important;
    }
  }
}
</style>
