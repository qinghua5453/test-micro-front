<template>
    <!--现金详情信息-->
    <div style="margin-top:40px;">
        <el-form>
            <el-table border :data="cashDetail.vouchers" style="width: 100%" class="my-table">
                <el-table-column label="类型" width="120" fixed>
                    <template slot-scope="scope">
                        {{cashDetail.vouchers[scope.$index].type === 2 ? '现金' : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="金额(元)">
                     <template slot-scope="scope">
                        {{cashDetail.vouchers[scope.$index].value}}
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="100" v-if="couponHeaderDetail.type === 2||couponHeaderDetail.type === 6">
                    <template slot-scope="scope">
                        <span>{{cashDetail.vouchers[scope.$index].prizeNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="剩余数量" v-if="couponHeaderDetail.type === 2||couponHeaderDetail.type === 6">
                    <template slot-scope="scope">
                        <span>{{cashDetail.vouchers[scope.$index].num}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="中奖次数/人" v-if="couponHeaderDetail.type === 2||couponHeaderDetail.type === 6">
                    <template slot-scope="scope">
                        <span>{{cashDetail.vouchers[scope.$index].assocNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" v-if="couponHeaderDetail.type === 2||couponHeaderDetail.type === 6">
                    <template slot-scope="scope">
                        <span>{{cashDetail.vouchers[scope.$index].chance + '%'}}</span>
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
  props: ["cashDetail", "couponHeaderDetail"],
  methods: {}
};
</script>

<style lang="less">
</style>
