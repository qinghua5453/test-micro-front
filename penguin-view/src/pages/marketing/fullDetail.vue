<template>
    <!--满减券信息-->
    <div style="margin-top:40px;">
        <el-form>
            <el-table border :data="fullDetail.vouchers" style="width: 100%" class="my-table">
                <el-table-column label="类型" fixed>
                    <template slot-scope="scope">
                        {{fullDetail.vouchers[scope.$index].type === 1 ? '满减券' : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="金额(元)" width="220">
                    <template slot-scope="scope">
                        <el-select v-model="fullDetail.vouchers[scope.$index].outId" filterable placeholder="请选择" disabled="disabled">
                            <el-option
                            v-for="item in templates"
                            :key="item.id"
                            :label="item.faceValue + '元'+ ' ' +'满' + item.minGcoins + '元可用'"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  label="有效期类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="fullDetail.vouchers[scope.$index].dateType === 0">相对时间</span>
                        <span v-if="fullDetail.vouchers[scope.$index].dateType === 1">固定时间</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效日" width="160">
                    <template slot-scope="scope" v-if="fullDetail.vouchers[scope.$index].dateType === 0">
                             自领取日&nbsp;&nbsp;{{fullDetail.vouchers[scope.$index].startDays}}&nbsp;&nbsp;天
                    </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                    <template slot-scope="scope">
                        <span v-if="fullDetail.vouchers[scope.$index].dateType === 1">{{fullDetail.vouchers[scope.$index].startDate + ' 至 ' + fullDetail.vouchers[scope.$index].endDate}}</span>
						<span v-if="fullDetail.vouchers[scope.$index].dateType === 0">{{fullDetail.vouchers[scope.$index].day  + '天'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效时段" width="100">
                    <template slot-scope="scope">
                        <span>{{fullDetail.vouchers[scope.$index].startTime + '-' + fullDetail.vouchers[scope.$index].endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{fullDetail.vouchers[scope.$index].prizeNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="剩余数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{fullDetail.vouchers[scope.$index].num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中奖次数/人" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{fullDetail.vouchers[scope.$index].assocNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{fullDetail.vouchers[scope.$index].chance + '%'}}</span>
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
  props: ["fullDetail", "couponHeaderDetail"],
  created() {
    this.getVoucherSelect(); // 获取满减金额
  },
  methods: {
    // 获取优惠券金额
    getVoucherSelect(id) {
      this.$axios.post(Api.VOUCHER_SELECT, { type: 1 }).then(resp => {
        this.templates = resp;
      });
    }
  }
};
</script>

<style lang="less">
</style>
