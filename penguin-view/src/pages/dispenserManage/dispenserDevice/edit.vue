<template>
  <el-dialog
    title="编辑洗衣液投放器"
    :visible.sync="visible"
    :before-close="modalClose"
    :close="modalClose"
    width="1080px"
    top="3vh"
  >
    <el-form ref="detergentForm" :model="detergentForm" :rules="detergentFormRules">
      <div class="plate">
        <h3 class="detail-base-title"><span class="line"></span>基本信息</h3>
        <div class="deatil-list">
          <el-form-item label="洗衣液投放器名称：" prop="name" label-width="155px">
            <el-input v-model.trim="detergentForm.name"></el-input>
          </el-form-item>
          <el-form-item label="编码：">{{detergentForm.sn}}</el-form-item>
        </div>
      </div>
      <div class="wrap">
        <div class="plate" style="margin-right:16px">
          <h3 class="detail-base-title">
            <span class="line"></span>洗衣液&除菌液信息
          </h3>
          <div class="table">
            <el-table :data="detergentForm.skuList">
              <el-table-column
                prop="name"
                label="功能"
              ></el-table-column>
              <el-table-column
                prop="amount"
                label="单次用量(ml)"
              ></el-table-column>
              <el-table-column    label="单次售价(元)">
                <template slot-scope="scope">
                  <el-form-item :prop="'skuList.' + scope.$index + '.price'" :rules='detergentFormRules.price'>
                    <el-input v-model.trim="scope.row.price"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column  label="状态">
                <template slot-scope="scope">
                  <el-form-item :prop="'skuList.' + scope.$index + '.status'">
                    <el-switch v-model="scope.row.status"></el-switch>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="plate">
          <h3 class="detail-base-title">
            <span class="line"></span>投放器通道信息
          </h3>
          <div class="table">
            <ul class="channel" v-if="detergentForm.channelList">
              <li v-for="(item,index) in detergentForm.channelList" :key="item.channelId">
                <div class="title">通道{{item.ucode}}</div>
                <div>
                  <img :src="`${STATIC_IMAGE}detergent_bak.png`" v-if="item.liquidStatus === 0"/>
                  <img :src="`${STATIC_IMAGE}detergent_bak_lack.png`" v-if="item.liquidStatus === 1"/>
                  <img :src="`${STATIC_IMAGE}detergent_bak_inactivated.png`" v-if="!item.goodsId&&item.goodsId<0"/>
                </div>
                <div class="base">
                  <img :src="`${STATIC_IMAGE}base_home.png`" v-if="detergentForm.channelList.length===1">
                  <img :src="`${STATIC_IMAGE}base_bak_left.png`" v-else-if="detergentForm.channelList.length>1&&index===0"/>
                  <img :src="`${STATIC_IMAGE}base_bak_right.png`" v-else-if="detergentForm.channelList.length>1&&index===(detergentForm.channelList.length-1)"/>
                  <img :src="`${STATIC_IMAGE}base_center.png`" v-else/>
                </div>
                <div>{{ item.locked === 1 ? '锁定': item.channelStatus ?"开启" : "关闭" }}</div>
                <el-form-item>
                  <el-switch :disabled="item.locked===1" v-model="item.channelStatus" @change="channelSwitchFun(item.channelStatus,item.channelId,detergentForm.sn)"></el-switch>
                </el-form-item>
              </li>
              <li class="logo" v-if="detergentForm.channelList.length>0">
                <img :src="`${STATIC_IMAGE}detergent_logo.png`" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="handleEdit('detergentForm')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { tfqDetailChannelStatus } from "@/utils/Mapping";
import { dispenserDetailFun, dispenserDditFun,dispenserChannelSwitchFun } from "./dispenserDevice";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deviceId: {
      type: Number,
      default: null
    }
  },
  filters: {
    tfqDetailChannelStatus: value => {
      return tfqDetailChannelStatus[value];
    }
  },
  data() {
    return {
      detergentForm: {
        name: "",
        sn:'',
        goodsId: null,
        channelList: [],
        skuList: []
      },
      detergentFormRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 15, message: "名称在15个字符内", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { pattern: /^(([0-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[0-9]{0,2}|99|99.0|99.00)$/, message: '请输入0.01-99.99之间的数', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.getDispenserDetail();
  },
  methods: {
    modalClose() {
      this.$emit("update:visible", false); // 直接修改父组件的属性
    },
    async getDispenserDetail() {
      let res = await dispenserDetailFun({ deviceId: this.deviceId });
      this.detergentForm.name = res.deviceName
      this.detergentForm.sn = res.sn
      this.detergentForm.goodsId = res.goodsId
      if(res.channels){
      res.channels.forEach(item => {
          if (item.channelStatus === 1) {
            item.channelStatus = true;
          } else{
            item.channelStatus = false;
          }
        });
      }
      this.detergentForm.channelList = res.channels;
      res.skus.forEach(item => {
          if (item.status === 1) {
            item.status = true;
          } else{
            item.status = false;
          }
        });
      this.detergentForm.skuList = res.skus;
    },
    channelSwitchFun(status,channelId,deviceSn){
      let channelStatus = null;
      if (status === true) {
        channelStatus = 1;
      } else {
        channelStatus = 0;
      }
      dispenserChannelSwitchFun({channelStatus,channelId,deviceSn});
    },
    handleEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = this._.cloneDeep(this.detergentForm);
          payload.channelList.forEach(item => {
            if (item.channelStatus === true) {
              item.channelStatus = 1;
            } else {
              item.channelStatus = 0;
            }
          });
          payload.skuList.forEach(item => {
            if (item.status === true) {
              item.status = 1;
            } else {
              item.status = 2;
            }
          });
          payload = {
            json:JSON.stringify(payload)
          }
          dispenserDditFun(payload).then(()=>{
              this.$message.success('操作成功');
              this.$listeners.getDispenserDeviceList && this.$listeners.getDispenserDeviceList(); //若组件传递事件confirm则执行
              this.modalClose();
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
/deep/ .el-dialog__header {
  border-bottom: none;
}
.wrap {
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  > div {
    flex: 1;
  }
}
.plate {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px 0;
  .detail-base-title {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 16px;
    .line {
      display: inline-block;
      width: 4px;
      height: 14px;
      background: #ef5657;
      margin-right: 16px;
    }
  }
  .deatil-list {
    padding-left: 20px;
    display: flex;
    /deep/ .el-form-item {
      flex: 45%;
    }
    /deep/ .el-input__inner {
      width: 310px !important;
      
    }
  }

  .table {
    padding: 16px;
    /deep/ .el-input__inner{
      width: 100% !important;
      line-height: 32px;
      height: 32px;
    }
    /deep/ .el-form-item__error{
      top:85%;
    }
  }
  /deep/ .el-table tr {
    background: #fafafa;
  }
  /deep/ .el-table thead tr {
    border-radius: 8px 8px 0px 0px;
  }
  /deep/ .el-table thead th {
    background: #f2f2f2 !important;
  }
  /deep/ .el-form {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    .el-form-item {
      flex: 45%;
    }
  }
}
.channel {
  display: flex;
  justify-content: center;
  position: relative;
  > li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    line-height: 17px;
    padding-bottom: 4px;
  }
  .base {
    margin-top: -20px;
    margin-bottom: 16px;
  }
  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 45%;
  }
}

</style>
