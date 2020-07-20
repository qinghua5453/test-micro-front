<template>
  <div>
    <el-dialog class="addActivity-dialog" :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="640px">
      <el-form :model="addEvent" label-width="115px" :rules="addEventRules" ref="couponAdd">
        <el-form-item label="优惠券名称：" prop="title">
          <el-input clearable v-model="addEvent.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="适用店铺：" class="form-item-m" prop="shopIds">
          <el-select style="width:100%" v-model="addEvent.shopIds" multiple filterable remote placeholder="请输入店铺名称" :remote-method="getShopByName">
            <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用类型：" prop="machineParentTypeIds">
          <el-checkbox-group v-model="addEvent.machineParentTypeIds">
            <el-checkbox label="c9892cb4-bd78-40f6-83c2-ba73383b090a">洗衣机</el-checkbox>
            <el-checkbox label="4a245cde-538b-47d8-aa35-dd4a28c0e901">烘干机</el-checkbox>
            <el-checkbox label="ef5b8f13-36ec-44fb-8179-38627abd9be0">洗鞋机</el-checkbox>
            <el-checkbox label="4eeb1b0a-d006-49cc-bf17-73c20599057b">吹风机</el-checkbox>
            <el-checkbox label="4eeb1b0a-d006-49cc-bf17-73c20599057c">充电桩</el-checkbox>
            <el-checkbox label="4eeb1b0a-d006-49cc-bf17-73c20599057e">饮水机</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="优惠方式：" prop="couponType">
          <el-radio-group v-model="addEvent.couponType" @change="changeDiscountType">
            <el-radio :label="+id" :key="id" v-for="(name, id) in ActDiscountType">{{ name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面额：" class="form-item-m" prop="reduce" :rules="validatorRules({ max: 999, min: 0.01, point: 2, unit: '面额' })" v-if="addEvent.couponType === 1">
          <div class="condition">
            <el-input v-model="addEvent.reduce" clearable auto-complete="off"></el-input>
            <span>元</span>
          </div>
        </el-form-item>
        <el-form-item label="满减条件：" class="form-item-m" prop="orderReachPrice" :rules="validatorRules({ max: 999, min: 0.01, point: 2, unit: '满减条件' })" v-if="addEvent.couponType === 1">
          <div class="condition">
            <el-input v-model="addEvent.orderReachPrice" clearable auto-complete="off"></el-input>
            <span>元可用</span>
          </div>
        </el-form-item>
        <el-form-item label="折扣：" class="form-item-m" prop="percentage" :rules="validatorRules({ max: 9.9, min: 0.1, point: 1, unit: '折扣' })" v-if="addEvent.couponType === 3">
          <div class="condition">
            <el-input v-model="addEvent.percentage" clearable auto-complete="off"></el-input>
            <span>折</span>
          </div>
        </el-form-item>
        <el-form-item label="减免上限：" class="form-item-m" prop="maxDiscountPrice" :rules="validatorRules({ max: 999, min: 0.01, point: 2, unit: '减免上限' })" v-if="addEvent.couponType === 3">
          <el-input v-model="addEvent.maxDiscountPrice" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量：" class="form-item-m" prop="stock">
          <el-input v-model.number="addEvent.stock" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="有效期：" class="form-item-m" prop="date">
          <el-date-picker
            v-model="addEvent.date"
            :picker-options="pickerBeginDateAfter"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:01', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效时段：" class="form-item-m" prop="time">
          <el-time-picker
            is-range
            v-model="addEvent.time"
            value-format="HH:mm"
            format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleAddEvent('couponAdd')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 1: '满减劵', 2: '免费体验券',  3: '折扣券';
const fullCutCoupons = 1;
const freeCoupons = 2;
const discountCoupons = 3;

import Api from '@/utils/Api';
import { ActDiscountType } from '@/utils/Mapping';
import { log } from 'util';

export default {
  props: ['promotionId', 'visible'],
  data() {
    return {
      title: '新增优惠券',
      addEvent: {
        promotionId: '',
        title: '',
        shopIds: [],
        machineParentTypeIds: [],
        couponType: null,

        reduce: null,
        orderReachPrice: null,
        percentage: null,
        maxDiscountPrice: null,
        stock: null,

        date: null, // 日期
        time: ['00:00', '23:59'] // 时间
      },
      addEventRules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 50, message: '活动名称长度不超过50个字符', trigger: 'blur' }
        ],
        shopIds: [{ type: 'array', required: true, message: '请选择店铺', trigger: 'change' }],
        machineParentTypeIds: [
          {
            type: 'array',
            required: true,
            message: '请选择适用类型',
            trigger: 'change'
          }
        ],
        couponType: [{ required: true, message: '请选择优惠方式', trigger: 'change' }],
        stock: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', min: 1, max: 99999, message: '请输入1-99999间的整数', trigger: 'blur' }
        ],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      shopList: [],
      pickerBeginDateAfter: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  computed: {
    ActDiscountType() {
      return ActDiscountType;
    }
  },
  created() {
    if (this.promotionId) {
      this.title = '编辑优惠券';
      this.getDetail();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    validatorRules(params) {
      return [
        { required: true, message: `请输入${params.unit}`, trigger: ['blur', 'change'] },
        {
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            let reg = /^[0-9]+\.{0,1}[0-9]{0,}$/;
            let point = String(value).indexOf('.');
            let pointLen = 0;
            if (point !== -1) {
              pointLen = String(value).substring(point + 1);
            }
            if (params.point > 0 && point !== -1 && pointLen.length > params.point) {
              callback(new Error(`请输入${params.min}-${params.max}之间的数字，最多保留${params.point}位小数`));
            } else if (Number(value) < params.min || Number(value) > params.max) {
              callback(new Error(`请输入${params.min}-${params.max}之间的数字，${params.point ? `最多保留${params.point}位小数` : ''}`));
            } else if (!reg.test(value)) {
              callback(new Error(`请输入${params.min}-${params.max}之间的数字${params.point ? `，最多保留${params.point}位小数` : ''}`));
            } else {
              callback();
            }
          }
        }
      ];
    },
    async getDetail() {
      let res = await this.$axios.post(Api.NEW_COUPON_DETAIL, { promotionId: this.promotionId });
      Object.keys(this.addEvent).forEach(key => {
        this.addEvent[key] = res[key];
      });
      this.addEvent.date = [res.startAt, res.endAt];
      this.addEvent.time = [res.hourMinuteStartTime, res.hourMinuteEndTime];
      res.shopIds.forEach((item, index) => {
        this.shopList.push({
          id: item,
          name: res.shopNames[index]
        });
      });
    },
    async getShopByName(keywords) {
      if (keywords === '') {
        return;
      }
      this.loading = true;
      let res = await this.$axios.post(Api.SHOP_GETFORNAME, {
        name: keywords
      });
      this.shopList = [...res,...this.shopList] || [];
      this.loading = false;
    },
    changeDiscountType(val) {
      let arr = ['reduce', 'orderReachPrice', 'percentage', 'maxDiscountPrice'];
      this.$refs.couponAdd.clearValidate(arr);
      arr.forEach(i => {
        this.addEvent[i] = null;
      });
    },
    handleAddEvent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { date, time, ...payload } = this.addEvent;
          payload.startAt = date[0];
          payload.endAt = date[1];
          payload.hourMinuteStartTime = time[0];
          payload.hourMinuteEndTime = time[1];
          payload.machineParentTypeIds = JSON.stringify(payload.machineParentTypeIds);
          payload.shopIds = JSON.stringify(payload.shopIds);
          let url = payload.promotionId ? Api.NEW_COUPON_UPDATE : Api.NEW_COUPON_CREATE;
          this.$axios.post(url, payload).then(() => {
            this.modalClose();
            this.$message.success('操作成功！');
            this.$listeners.getEventList && this.$listeners.getEventList();
          });
        } else {
          this.$message.error('信息未填写完整');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.condition {
  display: flex;
  /deep/ .el-input {
    width: 87%;
  }
  span {
    padding-left: 10px;
  }
}
</style>
