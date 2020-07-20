<template>
    <!--折扣券详情信息-->
    <div style="margin-top:40px;">
        <el-form>
            <el-table border :data="discountDetail.vouchers" style="width: 100%" class="my-table">
                <el-table-column label="类型" fixed>
                    <template slot-scope="scope">
                        {{discountDetail.vouchers[scope.$index].type === 5 ? '折扣券' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="金额(元)" width="220">
                    <template slot-scope="scope">
                        <el-select v-model="discountDetail.vouchers[scope.$index].outId" filterable placeholder="请选择" disabled="disabled">
                            <el-option
                            v-for="item in templates"
                            :key="item.id"
                            :label="item.faceValue *10 + '折'"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="有效期类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="discountDetail.vouchers[scope.$index].dateType === 0">相对时间</span>
                        <span v-if="discountDetail.vouchers[scope.$index].dateType === 1">固定时间</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效日" width="120">
                    <template slot-scope="scope" v-if="discountDetail.vouchers[scope.$index].dateType === 0">
                             自领取日&nbsp;&nbsp;{{discountDetail.vouchers[scope.$index].startDays}}&nbsp;&nbsp;天
                    </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                    <template slot-scope="scope">
                        <span v-if="discountDetail.vouchers[scope.$index].dateType === 1">{{discountDetail.vouchers[scope.$index].startDate + '至' + discountDetail.vouchers[scope.$index].endDate}}</span>
						<span v-if="discountDetail.vouchers[scope.$index].dateType === 0">{{discountDetail.vouchers[scope.$index].day  + '天'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效时段" width="100">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].startTime + '-' + discountDetail.vouchers[scope.$index].endTime}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="减免上限" width="100">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].maxDerate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].prizeNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="剩余数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中奖次数/人" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].assocNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{discountDetail.vouchers[scope.$index].chance + '%'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import Api from "@/utils/Api";

export default {
  data() {
    return {
      templates: null,
      disabled: true
    };
  },
  props: ["discountDetail", "couponHeaderDetail"],
  created() {
    this.getVoucherSelect(); // 获取满减金额
  },
  methods: {
    // 获取优惠券金额
    getVoucherSelect() {
      this.$axios.post(Api.VOUCHER_SELECT, { type: 3 }).then(resp => {
        this.templates = resp;
      });
    }
  }
};
</script>

<style lang="less">
</style>
