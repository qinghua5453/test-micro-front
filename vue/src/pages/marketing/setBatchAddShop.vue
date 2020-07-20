<template>
  <div class="set_batch_page">
    <el-form  :model="filterData" :rules="filterDataRules" ref="filterDataForm" class="demo-form-inline" label-position="right" label-width="100px">
        <el-form-item label="创建时间：" prop="time">
            <el-date-picker v-model="filterData.time" :disabled="timeDisable"  @blur="checkTimeChange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <el-checkbox v-model="checkAllTime" style="margin-left:5px;" @change="timeDisable=!timeDisable;filterData.time=[];checkTimeError=false">不限</el-checkbox>
            <div class="el-form-item__error" v-show="checkTimeError">请选择时间</div>
        </el-form-item>
        <el-form-item label="区域：" prop="areas">
            <el-select v-model="filterData.areaIds" :disabled="areasDisable"   @change="CheckAreasChange" multiple value-key="id" placeholder="请选择" width="250px">
                <el-option v-for="item in proviceTypes"	:key="item.id" :label="item.areaName" :value="item.id"></el-option>
            </el-select>
            <el-checkbox v-model="checkAllAreas" style="margin-left:5px;" @change="areasDisable=!areasDisable;filterData.areaIds=[];checkAreasError=false">不限</el-checkbox>
            <div class="el-form-item__error" v-show="checkAreasError">请至少选择一个区域</div>
        </el-form-item>
        <el-form-item label="店铺类型：" prop="shopTypeIds">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllShopType" @change="handleCheckAllChange">全选</el-checkbox>
            <div class="shop_type">
                <el-checkbox-group v-model="filterData.shopTypeIds" @change="handleCheckedShopTypeChange">
                  <el-checkbox v-for="item in shopTypeList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
        </el-form-item>
        <el-form-item>
					<a class="el-button el-button--primary" type="primary" @click="toDoBatchAddShop('filterDataForm')">确认添加</a>
				</el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import moment from "moment";
export default {
  props: ["isSetBatchAddShopModel"],
  data() {
    return {
        filterData:{
          time:[],
          shopTypeIds:[],
          areaIds:[]
        },
        filterDataRules:{
          shopTypeIds: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
        },
        proviceTypes: [],
        shopTypeList:[],
        shopTypeIds:[],
        isIndeterminate: true,
        checkAllShopType: false,
        checkAllTime:false,
        checkAllAreas:false,
        checkTimeError:false,
        checkAreasError:false,
        timeDisable:false,
        areasDisable:false,
        setBatchAddShopModel:this.isSetBatchAddShopModel
    };
  },
  components: {

  },
  created() {
    this.getCommonProvice();
    this.getShopType();
  },
  methods: {
    // 获取省份
    getCommonProvice() {
      return this.$axios
        .post(Api.AREA_LIST, {parentId: 0})
        .then(resp => {
          this.proviceTypes = resp;
        });
    },
     // 获取店铺类型
    getShopType() {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp;
        resp.forEach(item => {
          this.shopTypeIds.push(item.id);
        });
      });
    },
    handleCheckAllChange(val) {
        this.filterData.shopTypeIds = val ? this.shopTypeIds : [];
        this.isIndeterminate = false;
    },
    handleCheckedShopTypeChange(value) {
        let checkedCount = value.length;
        this.checkAllShopType = checkedCount === this.shopTypeIds.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.shopTypeIds.length;
    },
    checkTimeChange(){
      if(this.filterData.time.length<=0){
        this.checkTimeError = true;
      }else {
        this.checkTimeError = false;
      }
    },
    CheckAreasChange(){
      if(this.filterData.areaIds.length<=0){
        this.checkAreasError = true;
      }else {
        this.checkAreasError = false;
      }
    },
    toDoBatchAddShop(formName){
      this.$refs[formName].validate((valid) => {
          let timeError = false;
          let areasError = false;
         if(!this.checkAllTime&&this.filterData.time.length<=0){
            this.checkTimeError = true;
            timeError =  false;
          }else {
            this.checkTimeError = false;
            timeError =  true;
          }
          if(!this.checkAllAreas&&this.filterData.areaIds.length<=0){
            this.checkAreasError = true;
            areasError =  false;
          }else {
            this.checkAreasError = false;
            areasError =  true;
          }
          if (valid&&timeError&&areasError) {
            let payload = Object.assign({},this.filterData);
            if(this.checkAllAreas&&this.checkAllTime){
              delete payload.time;
              delete payload.areaIds;
            }else {
              payload.startTime = payload.time ? payload.time[0] : null;
              payload.endTime = payload.time ? payload.time[1] : null;
              delete payload.time;
            }
            this.$axios.post(Api.SHOP_GET_CONDTION, payload).then(res=>{
              if (res.length>0) {
                this.setBatchAddShopModel = false;
                this.$emit("onBatchShop", {shopCondition:payload,shopList:res,isSetBatchAddShopModel:this.setBatchAddShopModel});
              }else {
                this.$message.warning("未找到符合条件的店铺"); 
              }
            });
            
          }
      });
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
  .set_batch_page .el-date-editor {
    width:250px;
  }
  .el-checkbox+.el-checkbox {
    margin-left:5px;
    margin-right:5px;
  }
  .el-select {
    width: 250px;
  }
  .el-input__inner {
    width: 315px;
  }
  .el-form-item{
    margin-bottom: 22px;
  }
</style>
