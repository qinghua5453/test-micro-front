<template>
  <el-dialog title="洗衣液投放器详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1080px" top="3vh">
    <div class="plate">
      <h3 class="detail-base-title"><span class="line"></span>基本信息</h3>
      <el-form :inline="true" class="deatil-list" label-position="left" label-width="85px">
        <el-form-item label="洗衣液投放器名称：" label-width="140px">{{ detail.deviceName }}</el-form-item>
        <el-form-item label="编码：">{{ detail.sn }}</el-form-item>
        <el-form-item label="所属设备：" v-if="detail.machineName">{{ detail.machineName }}</el-form-item>
        <el-form-item label="所属店铺：">{{ detail.shopName }}</el-form-item>
        <el-form-item label="创建人：">{{ detail.createUserName }}</el-form-item>
        <el-form-item label="创建时间：">{{ detail.createTime }}</el-form-item>
      </el-form>
    </div>
    <div class="wrap">
      <div class="plate" style="margin-right:16px">
        <h3 class="detail-base-title"><span class="line"></span>洗衣液&除菌液信息</h3>
        <div class="table">
          <el-table :data="detail.skus">
            <el-table-column prop="name" label="功能"></el-table-column>
            <el-table-column prop="amount" label="单次用量(ml)"></el-table-column>
            <el-table-column prop="price" label="单次售价(元)"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatterSkusStatus"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="plate">
        <h3 class="detail-base-title"><span class="line"></span>投放器通道信息</h3>
        <div class="table">
          <ul class="channel" v-if="detail.channels">
            <li v-for="(item, index) in detail.channels" :key="item.channelId">
              <div class="title">通道{{ item.ucode }}</div>
              <div>
                <img :src="`${STATIC_IMAGE}detergent_bak.png`" v-if="item.liquidStatus === 0" />
                <img :src="`${STATIC_IMAGE}detergent_bak_lack.png`" v-if="item.liquidStatus === 1" />
                <img :src="`${STATIC_IMAGE}detergent_bak_inactivated.png`" v-if="!item.goodsId && item.goodsId < 0" />
              </div>
              <div class="base">
                <img :src="`${STATIC_IMAGE}base_home.png`" v-if="detail.channels.length === 1" />
                <img :src="`${STATIC_IMAGE}base_bak_left.png`" v-else-if="detail.channels.length > 1 && index === 0" />
                <img :src="`${STATIC_IMAGE}base_bak_right.png`" v-else-if="detail.channels > 1 && index === detail.channels.length - 1" />
                <img :src="`${STATIC_IMAGE}base_center.png`" v-else />
              </div>
              <div>{{ item.locked === 1 ? '锁定' : item.channelStatus ? '开启' : '关闭' }}</div>
            </li>
            <li class="logo" v-if="detail.channels.length > 0">
              <img :src="`${STATIC_IMAGE}detergent_logo.png`" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { skusStatus } from '@/utils/Mapping';
import { dispenserDetailFun } from './dispenserDevice';

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
  data() {
    return {
      detail: {}
    };
  },
  created() {
    this.getDispenserDetail();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    formatterSkusStatus(row, column) {
      return skusStatus[row.status];
    },
    async getDispenserDetail() {
      let res = await dispenserDetailFun({ deviceId: this.deviceId });
      this.detail = res;
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
  padding-bottom: 24px;
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
    > li {
      line-height: 36px;
      > span {
        display: inline-block;
        width: 130px;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }
  .table {
    padding: 16px;
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
    top: 57%;
  }
}
</style>
