<template>
    <!--免费体验券信息-->
    <div style="margin-top:40px;">
        <el-form :rules="rules" :model="cashCouponData"  ref="cashCouponData">
            <el-table border :data="cashCouponData.vouchers" style="width: 100%" class="my-table">
                <el-table-column prop="type" label="类型" fixed>
                    <template slot-scope="scope">
                        {{cashCouponData.vouchers[scope.$index].type === 2 ? '现金' : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="金额(元)">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.value'" :rules='rules.value'>
                             <el-input style="width:100%;" v-model="scope.row.value" :disabled="!isEditorAdd"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="已发放数量" width="130" v-if="activityType === 2 || activityType === 6 && !isEditorAdd">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.prizeNum'" :rules='rules.prizeNum'>
                            <el-input v-model="scope.row.prizeNum" :disabled="!isEditorAdd"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column :label="isEditorAdd ? '发放数量' : '剩余数量'" width="200" v-if="activityType === 2 || activityType === 6">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.num'" :rules='rules.num'>
                            <el-input v-model="scope.row.num"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="中奖次数/人" width="200" v-if="activityType === 2 || activityType === 6">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.assocNum'" :rules='rules.assocNum'>
                            <el-input v-model="scope.row.assocNum"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="probab" label="中奖概率" width="230" v-if="activityType === 2 || activityType === 6">
                    <template slot-scope="scope">
                        <el-form-item :prop="'vouchers.' + scope.$index + '.chance'" :rules='rules.chance'>
                            <el-input style="width:180px;" v-model="scope.row.chance"></el-input>&nbsp;&nbsp;%
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="functionDescribe" label="操作" width="150" v-if="isEditorAdd">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleActAddCoupon(scope.$index)" v-if="cashCouponData.vouchers[scope.$index].isShowCouponAddBtn"> + </el-button>
                        <el-button type="primary" size="mini" @click="handleRemoveActCoupon(scope.$index)" v-if="cashCouponData.vouchers.length > 1" >  - </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
	import Api from '@/utils/Api';

	export default {
		data() {
            // 验证金额
            var checkPrice = (rule, value, callback) => {
                let reg = /^([0-9]\d*)(\s|$|\.\d{1,2}\b)/; // 验证金额大于0，并且可以包含两位小数
				if(!reg.test(value)) {
					return callback(new Error('必须是大于0，允许两位小数'));
				} else {
					callback();
				}
            };
            // 验证发放数量
            var checkNum = (rule, value, callback) => {
                let reg = /^(0|[1-9][0-9]*)$/; // 验证大于或者等于0的正整数
				if(!reg.test(value)) {
					return callback(new Error('必须是大于或者等于0的正整数'));
				} else {
					callback();
				}
            };
            // 验证中奖次数
            var checkAssocNum = (rule, value, callback) => {
                let reg = /^(0|[1-9][0-9]*)$/; // 验证大于或者等于0的正整数
				if(!reg.test(value)) {
					return callback(new Error('必须是大于或者等于0的正整数'));
				} else {
					callback();
				}
            };
            // 验证中奖概率
            var checkChance = (rule, value, callback) => {
                let reg = /^([0-9]\d*)(\s|$|\.\d{1,2}\b)/; // 验证概率大于或者等于0，并且包含两位小数
				if(!reg.test(value)) {
					return callback(new Error('必须是大于或者等于0，允许两位小数'));
				} else {
					callback();
				}
            };
			return {
               rules:{
                   value:[
                       {required: true,message: '请填写金额',trigger: 'blur'},
                       {validator: checkPrice, trigger: 'blur' }
                   ],
                   num:[
                       {required: true,message: '请填写发放数量',trigger: 'blur'},
                       {validator: checkNum, trigger: 'blur' }
                   ],
                   assocNum:[
                       {required: true,message: '请填写中奖次数',trigger: 'blur'},
                       {validator: checkAssocNum, trigger: 'blur' }
                   ],
                   chance:[
                       {required: true,message: '请填写概率',trigger: 'blur'},
                       {validator: checkChance, trigger: 'blur' }
                   ],
               },
			};
        },
        props:['cashCouponData','startTime','activityType','isEditorAdd'],
        created(){
        },
		methods: {
            // 新增活动优惠券
            handleActAddCoupon(index){
                let addActCoupon = {
                    id:null,
                    type: 2,
                    value: null, // 金额
                    num: null, // 发放数量
                    assocNum: null, // 中奖次数/人
                    chance: null, // 概率
                    //
                    isShowCouponAddBtn:false,
                };
                this.cashCouponData.vouchers.push(addActCoupon);
                this.isShowBtn(this.cashCouponData.vouchers);
            },
            // 移除活动优惠券
            handleRemoveActCoupon(index){
                if(this.cashCouponData.vouchers.length > 1){
                    this.cashCouponData.vouchers.splice(index, 1);
                }
                this.isShowBtn(this.cashCouponData.vouchers);
                this.$refs.cashCouponData.clearValidate();
            },
            // 判断'+ - '按钮显示
            isShowBtn(list){
                for(let i = 0; i < list.length; i++){
                    if(i === list.length - 1){
                        list[i].isShowCouponAddBtn = true;
                    } else{
                        list[i].isShowCouponAddBtn = false;
                    }
                }
            },
            // 表单是否验证通过
            validateFullForm() {
                let flag = false;
                this.$refs['cashCouponData'].validate((valid) => {
                    flag = valid;
                });
                return flag;
            },
             // 清除验证
			clearValidate(formName) {
				this.$refs[formName].clearValidate();
				this.$refs[formName].resetFields();
			},
        },
	};
</script>

<style lang="less">
</style>
