<template>
    <!--免费体验券详情信息-->
    <div style="margin-top:40px;">
        <el-form>
            <el-table border :data="freeDetail.vouchers" style="width: 100%" class="my-table">
                <el-table-column label="类型" fixed>
                    <template slot-scope="scope">
                        {{freeDetail.vouchers[scope.$index].type === 6 ? '免费体验券' : ''}}
                    </template>
                </el-table-column>
                <el-table-column  label="有效期类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="freeDetail.vouchers[scope.$index].dateType === 0">相对时间</span>
                        <span v-if="freeDetail.vouchers[scope.$index].dateType === 1">固定时间</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效日" width="120">
                    <template slot-scope="scope" v-if="freeDetail.vouchers[scope.$index].dateType === 0">
                             自领取日&nbsp;&nbsp;{{freeDetail.vouchers[scope.$index].startDays}}&nbsp;&nbsp;天
                    </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                    <template slot-scope="scope">
                        <span v-if="freeDetail.vouchers[scope.$index].dateType === 1">{{freeDetail.vouchers[scope.$index].startDate + '至' + freeDetail.vouchers[scope.$index].endDate}}</span>
						<span v-if="freeDetail.vouchers[scope.$index].dateType === 0">{{freeDetail.vouchers[scope.$index].day  + '天'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效时段" width="100">
                    <template slot-scope="scope">
                        <span>{{freeDetail.vouchers[scope.$index].startTime + '-' + freeDetail.vouchers[scope.$index].endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{freeDetail.vouchers[scope.$index].prizeNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="剩余数量" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{freeDetail.vouchers[scope.$index].num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中奖次数/人" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{freeDetail.vouchers[scope.$index].assocNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" width="100" v-if="couponHeaderDetail.type === 2">
                    <template slot-scope="scope">
                        <span>{{freeDetail.vouchers[scope.$index].chance + '%'}}</span>
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
  props: ["freeDetail", "couponHeaderDetail"],
  methods: {}
};
</script>

<style lang="less">
</style>
