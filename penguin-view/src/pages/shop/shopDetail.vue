<template>
  <section>
    <el-dialog class="dialog-shop" title="店铺详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose">
      <el-form :model="detail" label-width="96px">
        <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>基本信息</h2>
        <el-form-item label="店铺名称：" class="form-item-m">
          <span>{{ detail.name }}</span>
        </el-form-item>
        <el-form-item label="店铺类型：" class="form-item-m">
          <span>{{ detail.shopTypeName }}</span>
        </el-form-item>
        <el-form-item v-if="Number(detail.shopType) === 1" label="学校名称：" class="form-item-m">
          <span>{{ detail.orgName }}</span>
        </el-form-item>
        <el-form-item label="属性：" class="form-item-m">
          <span>{{ detail.attribute | attributeType }}</span>
        </el-form-item>
        <el-form-item label="状态：" class="form-item-m">
          <span>{{ detail.status | ShopType }}</span>
        </el-form-item>
        <el-form-item label="运营商账号：" class="form-item-m">
          <span>{{ detail.operatorName }}</span>
        </el-form-item>
        <el-form-item label="地址：" class="form-item-m">
          <span v-if="Number(detail.shopType) === 1">{{ detail.organization }}&nbsp;&nbsp;{{ detail.realAddress }}</span>
          <span v-else>{{ detail.address }}{{ detail.organization }}{{ detail.realAddress }}</span>
        </el-form-item>
        <el-form-item label="店铺图片：" class="form-item-m">
          <img width="140" :src="detail.image" @click="showImg(detail.image)" />
        </el-form-item>
      </el-form>
      <div style="margin-top:30px;" v-if="detail.revenueSharing">
        <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>分账信息</h2>
        <el-table :data="detail.revenueSharing.detail" style="width: 100%" border class="my-table">
          <el-table-column prop="date" label="分账比例">
            <template slot-scope="scope">
              <span>{{ scope.row.shareOperaterMobile }}({{ scope.row.shareOperaterName }})</span><span style="margin-left:15px;">{{ scope.row.proportion }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="设置时间" width="240">
            <template slot-scope="scope">
              {{ detail.revenueSharing.createdAt }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog class="big-img" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </section>
</template>

<script>
import Api from '@/utils/Api';
import { AttributeType, ShopType } from '@/utils/Mapping';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detail: {},
      // 显示原图
      dialogImageUrl: null,
      dialogVisible: false
    };
  },
  filters: {
    attributeType: val => {
      return AttributeType[val];
    },
    ShopType: val => {
      return ShopType[val];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    getDetail() {
      return this.$axios
        .post(Api.SHOP_DETAILS, {
          id: this.shopId
        })
        .then(res => {
          this.detail = res || {};
        });
    },
    // 查看原图
    showImg(imgUrl) {
      if (imgUrl != null) {
        this.dialogImageUrl = imgUrl;
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail-info-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  i {
    margin-right: 8px;
  }
}
</style>
