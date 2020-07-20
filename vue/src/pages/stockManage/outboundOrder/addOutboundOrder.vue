<template>
  <div class="add-warehouse-page">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['库存管理', '出库单', '新增出库']" />
    <div class="add-warehouse">
      <el-form :inline="true" :model="addWarehouseForm" label-width="110px" :rules="addWarehouseFormRules" ref="addWarehouseForm" class="add-warehouse-form">
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="钉钉审批编号" prop="dingdingNo" class="leng-input">
              <el-input clearable v-model.trim="addWarehouseForm.dingdingNo" size="small" placeholder="请输入钉钉审批编号" @blur="blurDingDingNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库类别" prop="inventoryOrderTypeId" class="leng-input">
              <el-select size="small" v-model="addWarehouseForm.inventoryOrderTypeId" placeholder="请选择出库类别" @change="changeIoType" :disabled="true">
                <el-option v-for="(item, index) in wareType" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="reverse" class="leng-input">
              <el-select size="small" v-model="addWarehouseForm.reverse" placeholder="请选择业务类型">
                <el-option v-for="(item, index) in wareSelType" :key="index" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="收货人" prop="contact" class="leng-input">
              <el-input clearable v-model="addWarehouseForm.contact" size="small" placeholder="请输入收货人" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="BD" prop="bd" class="leng-input">
              <el-input clearable v-model.trim="addWarehouseForm.bd" size="small" placeholder="请输入BD"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运营商" prop="tel" class="leng-input">
              <el-input clearable v-model="addWarehouseForm.tel" size="small" placeholder="请输入运营商" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="属性" prop="goodsAttribute" class="leng-input">
              <el-select size="small" v-model="addWarehouseForm.goodsAttribute" @change="changeAttr" placeholder="请选择属性">
                <el-option label="资产" value="10"></el-option>
                <el-option label="消耗品" value="20"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId" class="leng-input">
              <el-select size="small" v-model="addWarehouseForm.warehouseId" placeholder="请选择仓库" @change="changeWarehouse">
                <el-option v-for="(item, index) in storeList" :key="index" :label="item.showName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remark" class="leng-input">
             <el-input type="textarea" style="width:100%;padding-right: 6px;" clearable v-model.trim="addWarehouseForm.remark" size="small" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="addWarehouseForm.goodsAttribute == 20">
          <el-table border v-if="addWarehouseForm.goodsAttribute == 20" :data="addWarehouseForm.jsonlist" ref="list" style="width: 100%" :fit="true" height="603" class="my-table">
            <el-table-column
              label="序号"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column label="存货名称">
              <template slot-scope="scope">
                <el-form-item style="margin-top:20px;" :prop="'jsonlist.' + scope.$index + '.name'" :rules="addWarehouseFormRules.name">
                  <!-- <el-select size="small" v-model="scope.row.name" placeholder="请选择存货" @change="changeStock(scope.row)">
                    <el-option v-for="(item, index) in stockList" :key="index" :label="item.goodsName" :value="item.id"></el-option>
                  </el-select> -->
                   <el-select
                   :disabled="!addWarehouseForm.warehouseId"
                    size="small"
                    v-model="scope.row.name"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请选择消耗品"
                    @change="changeStock(scope)"
                    :remote-method="(query)=>{remoteStockMethod(query,scope.$index)}"
                    style="width:100%;"
                    >
                    <el-option
                      v-for="item in filterErpOptionsArr[scope.$index]"
                      :key="item.id"
                      :label="item.goodsName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="goodsCode" label="存货编码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
              <template slot-scope="scope">
                {{checkUnit(scope.row.unit)}}
              </template>
            </el-table-column>
            <el-table-column prop="num" label="出库数量">
              <template slot-scope="scope">
                <el-form-item style="margin-top:20px;" :prop="'jsonlist.' + scope.$index + '.num'" :rules="addWarehouseFormRules.num">
                  <el-input clearable v-model="scope.row.num" size="small" placeholder="请输入出库数量" :disabled="!addWarehouseForm.warehouseId"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <i class="el-icon-remove-outline" style="font-size: 20px;color: #1296db;margin-right:10px" v-if="addWarehouseForm.jsonlist.length > 1" @click="removeDomain(scope.row)"></i>
                <i class="el-icon-circle-plus-outline" style="font-size: 20px;color: #1296db;" v-if="scope.$index === addWarehouseForm.jsonlist.length - 1" @click="addDomain(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-table border v-show="addWarehouseForm.goodsAttribute == 10" :data="addWarehouseForm.assetsList" style="width: 100%" :fit="true" height="603" class="my-table">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="goodsName" label="存货名称">
          </el-table-column>
          <el-table-column prop="goodsCode" label="存货编码">
          </el-table-column>
          <el-table-column prop="deviceCode" label="设备编码">
          </el-table-column>
          <!-- <el-table-column prop="num" label="库存数量">
            <template slot-scope="scope">
              <span style="color: red;" v-if="scope.row.num == 0">
                {{scope.row.num}}
              </span>
              <span v-else>
                {{scope.row.num}}
              </span>
            </template>
          </el-table-column> -->
          <el-table-column prop="unit" label="计量单位" width="80">
            <template slot-scope="scope">
                {{checkUnit(scope.row.unit)}}
              </template>
          </el-table-column>
          <el-table-column label="出库数量" width="80">
            <template slot-scope="scope">
              {{fixedNum(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <i class="el-icon-remove-outline" style="font-size: 20px;color: #1296db;margin-right:10px" @click="removeAsset(scope.row)"></i>
            </template>
          </el-table-column>
          <div slot="empty" class="addMoreBtn" @click="addAssets">
            添加设备编码
          </div>
        </el-table>
        <div class="myAllNum" v-if="addWarehouseForm.goodsAttribute == 10 && addWarehouseForm.assetsList && addWarehouseForm.assetsList.length > 0">
          <span style="padding-left:12px;">
            总计
          </span>
          <span class="right-span">
            {{addWarehouseForm.assetsList.length}}
          </span>
        </div>
        <!-- <div class="tips" v-if="addWarehouseForm.goodsAttribute == 10">
          注: 非同一家供应商的物料不能同一张单入库.
        </div> -->
        <el-form-item>
          <el-button type="primary" @click="onHandleAddWarehouse('addWarehouseForm')">确定</el-button>
          <el-button @click="addAssets" v-if="addWarehouseForm.assetsList && addWarehouseForm.assetsList.length > 0">添加设备</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="添加设备编码" :close-on-click-modal="false" :visible.sync="deviceVisible" width="680px">
      <el-form :model="deviceSnForm" :rules="deviceSnFormRules" ref="deviceSnForm" class="deviceSn-form">
        <el-form-item prop="sn">
          <el-input type="textarea" ref="textArea" :rows="20" autofocus="true" v-model="deviceSnForm.sn"></el-input>
          <span class="imei_count">{{ computedImeiCount }}</span>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" :disabled="!deviceSnForm.sn" @click="checkSn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from "@/utils/Api";
import QBreadcrumb from "@/components/Breadcrumb";
import  moment from 'moment'
import { assetStatusType } from "@/utils/Mapping";
import User from '@/utils/User';
import {
  storeListFun,
  companyListFun,
  typeListFun,
  wareListFun,
  typeStockListFun,
  wareTypeListFun,
  addOutFun,
  getWareHouseCodeFun,
  getWareHouseCodeApi,
  erpNameFun,
  assetOutApi,
  scrapOutFun
} from "../stock";

export default {
  components: {
    QBreadcrumb,
  },
  data() {
    const validateImeiList = (rule, value, callback) => {
      if (!value) {
        callback(new Error('设备编码不可为空'));
      } else {
        let list = value.split(/\n/g);
        let isRepeat = false;
        let repeatImei = '';
        var newlist = list.sort();
        for (var i = 0; i < newlist.length; i++) {
          if (newlist[i] && newlist[i] === newlist[i + 1]) {
            isRepeat = true;
            repeatImei = newlist[i];
          }
        }
        if (isRepeat) {
          callback(new Error(`设备编码：${repeatImei}存在重复，请重新输入`));
        } else {
          callback();
        }
      }
    };
    return {
      addWarehouseForm: {
        "tel": "",
        "reverse": "",
        "companyId": "",
        "deviceCodes": [],
        "goodsAttribute": '10',
        "goodsCodes": [],
        "outNum": [],
        "inventoryOrderTypeId": "",
        "remark": "",
        "warehouseId": "",
        "bd": "",
        "contact": "",
        "dingdingNo": "",
        jsonlist:[{
          name: '',
          num: 1,
          unit: '',
          goodsCode: '',
        }],
        assetsList: []
      },
      addWarehouseFormRules:{
          dingdingNo: [
            { required: true, message: '请输入钉钉审批编号', trigger: 'change' },
          ],
          bd: [
            { required: true, message: '请输入BD负责人', trigger: 'change' },
          ],
          contact: [
            { required: true, message: '请输入收货人', trigger: 'change' },
          ],
          warehouseId: [
            { required: true, message: '请选择仓库', trigger: 'change' },
          ],
          inventoryOrderTypeId: [
            { required: true, message: '请选择出库类别', trigger: 'change' },
          ],
          reverse: [
            { required: true, message: '请选择业务类型', trigger: 'change' },
          ],
          goodsAttribute: [
            { required: true, message: '请选择属性', trigger: 'change' },
          ],
          remark: [
            { required: false, message: '请输入备注', trigger: 'blur' },
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'change' }
          ],
          tel: [
            { required: true, message: '请输入运营商', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请选择消耗品', trigger: 'change' },
          ],
          num: [
            { required: true, message: '请输入出库数量', trigger: 'blur' },
            {
              pattern:/^[1-9]\d*$/,
              message: "出库数量必须为正整数",
              trigger: "blur"
            }
          ],
      },
      deviceVisible:false,
      deviceSnForm:{
        sn:'',
      },
      deviceSnFormRules:{
        sn: [{ required: true, trigger: 'blur', validator: validateImeiList }],
      },
      storeList: [],
      companyList: [],
      stockList: [],
      wareType: [],
      wareSelType: [],

      filterErpOptions: [],

      filterErpOptionsArr: []
    };
  },
  computed: {
    assetStatusType() {
      return assetStatusType;
    },
    computedImeiCount() {
      let list = this.handleImeiList();
      return list.length;
    }
  },
  created() {
    this.getStoreList();
    // this.getCompanyList();
    // this.getStockList();
    this.getWareType();
  },
  mounted() {
    this.keyUp();
    // this.getErpData();
  },
  methods: {
    async getWareType() {
      let par = {
        keywords: "",
        status: null,
        type: 20,
      }
      let res = await wareTypeListFun(par);
      this.wareType = res;
      // this.addWarehouseForm.inventoryOrderTypeId = res[0].id;
      // this.changeIoType();
      // this.wareSelType = [
      //   {key: 0,value: res[0].normalName},
      //   {key: 1,value: res[0].reverseName},
      // ];
    },
    async getStockList() {
      let par = {
        warehouseId: this.addWarehouseForm.warehouseId,
        keywords: "",
        status: 1,
        goodsAttribute: "20",
        page: 1,
        pageNum: 1,
        pageSize: 1000,
      }
      let res = await typeStockListFun(par);
      this.stockList = res.items;
      this.filterErpOptions = res.items;
      this.filterErpOptionsArr = [];
      this.filterErpOptionsArr.push(res.items);
    },
    async getErpData(word,index) {
      var par = {
        warehouseId: this.addWarehouseForm.warehouseId,
        keywords: word,
        status: 1,
        goodsAttribute: "20",
      }
      let res = await erpNameFun(par);
      this.filterErpOptionsArr.splice(index,1,res);
      // this.filterErpOptionsArr[index] = res;
    },
    async getStoreList() {
      let par = {
        keywords: "",
        status: null,
        type: "",
      }
      let res = await storeListFun(par);
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          element.showName = element.code + " " + element.name;
        }
      }
      this.storeList = res;
    },
    async getCompanyList() {
      let par = {
        keywords: "",
        status: true,
        type: 20,
      }
      let res = await companyListFun(par);
      this.companyList = res;
    },
    changeWarehouse() {
      if (this.addWarehouseForm.warehouseId) {
        this.getStockList();
        this.addWarehouseForm.assetsList = [];
        this.addWarehouseForm.jsonlist = [{
          name: '',
          num: 1,
          unit: '',
          goodsCode: '',
        }];
      }
      
    },
    blurDingDingNo() {
      this.addWarehouseForm.inventoryOrderTypeId = "";
      this.addWarehouseForm.reverse = "";
      this.addWarehouseForm.contact = "";
      this.addWarehouseForm.tel = "";
      if (this.addWarehouseForm.dingdingNo) {
        let url = assetOutApi + this.addWarehouseForm.dingdingNo;
        let payload = {
          dingdingNo: this.addWarehouseForm.dingdingNo
        }
        scrapOutFun(url,payload).then(res => {
          for (let i = 0; i < this.wareType.length; i++) {
            const element = this.wareType[i];
            if (element.name == res.inventoryOrderType) {
              this.addWarehouseForm.inventoryOrderTypeId = element.id;
              this.changeIoType();
              break;
            }
          }
          this.addWarehouseForm.contact = res.contact;
          this.addWarehouseForm.tel = res.operator;
        });
      }
      
    },
    keyUp() {
      let that = this;
      document.body.addEventListener('keyup', function (e) {
          //判断按键code值
          if (e.keyCode == '13' && that.addWarehouseForm.goodsAttribute == 20) {
              that.addDomain();
          }
      })
    },
    fixedNum(item) {
      return 1;
    },
    checkUnit(unit) {
      if(unit == 1) {
        return "台";
      }else if(unit == 2) {
        return "桶";
      }else {
        return unit;
      }
    },
    addAssets() {
      if (!this.addWarehouseForm.warehouseId) {
        this.$message.warning('请选择仓库后重试!');
        return false;
      }
      this.deviceSnForm.sn = "";
      this.deviceVisible = true;
      this.$nextTick(()=>{
        this.$refs.textArea.focus();
      })
    },
    changeIoType(item) {
      for (let i = 0; i < this.wareType.length; i++) {
        const element = this.wareType[i];
        if (element.id == this.addWarehouseForm.inventoryOrderTypeId) {
          this.addWarehouseForm.reverse = 0;
          this.wareSelType = [
            {key: 0,value: element.normalName},
            {key: 1,value: element.reverseName},
          ];
          break;
        }
      }
    },
    changeStock(scope) {
      if (!scope.row.name) {
        this.filterErpOptionsArr.splice(scope.$index,1,JSON.parse(JSON.stringify(this.stockList)));
        scope.row.unit = "";
        scope.row.goodsCode = "";
        // this.filterErpOptionsArr[scope.$index] = JSON.parse(JSON.stringify(this.stockList));
      } else {
        for (let i = 0; i < this.stockList.length; i++) {
          const element = this.stockList[i];
          if (element.id == scope.row.name) {
            scope.row.unit = element.unit;
            scope.row.goodsCode = element.goodsCode;
            break;
          }
        }
      }
    },
    remoteStockMethod(query,index) {
      if (query) {
        this.getErpData(query,index);
      } else {
        this.filterErpOptionsArr[index] = JSON.parse(JSON.stringify(this.stockList));
        // this.filterErpOptions = JSON.parse(JSON.stringify(this.stockList));
      }
    },
    removeAsset(item) {
      this.$confirm('您确定删除该设备吗？', '提示').then(() => {
        let index = this.addWarehouseForm.assetsList.indexOf(item);
        if (index !== -1) {
          this.addWarehouseForm.assetsList.splice(index, 1);
          this.$message.success('删除成功');
        }
      });
    },
    removeDomain(item) {
      this.$confirm('您确定删除该消耗品吗？', '提示').then(() => {
        let index = this.addWarehouseForm.jsonlist.indexOf(item);
        if (index !== -1) {
          this.addWarehouseForm.jsonlist.splice(index, 1);
          this.filterErpOptionsArr.splice(index, 1);
          this.$message.success('删除成功');
        }
      });
    },
    addDomain() {
      this.addWarehouseForm.jsonlist.push({
          name: '',
          num: 1,
          unit: '',
          goodsCode: '',
        });
      var le = this.addWarehouseForm.jsonlist.length - 1;
      this.filterErpOptionsArr[le] = JSON.parse(JSON.stringify(this.stockList))
    },
    checkSn() {
      this.$refs.deviceSnForm.validate(valid => {
        if (valid) {
          let checkStr = this.deviceSnForm.sn.trim()
          if(!checkStr) {
            this.$message.warning("请添加设备编码后重试");
            this.deviceSnForm.sn = "";
            return false;
          }

          let list = this.deviceSnForm.sn.split(/\n/g);
          let checkedArr = [];
          for (let i = 0; i < list.length; i++) {
            const element = list[i];

            let ele = element.trim()
            if (ele) {
              checkedArr.push(ele);
            }
          }
          if (checkedArr.length == 0) {
            this.$message.warning("请添加设备编码后重试");
            return false;
          }
          let par = {
            deviceCodes: String(checkedArr)
          }
          let url = getWareHouseCodeApi + this.addWarehouseForm.warehouseId;
          getWareHouseCodeFun(url,par).then(resp => {
            this.addWarehouseForm.assetsList = this.addWarehouseForm.assetsList.concat(resp);
            this.deviceVisible = false;
          });
        }
      })
    },
    handleImeiList() {
      let list = this.deviceSnForm.sn.split(/\n/g);
      list = list.filter(item => {
        //去掉最后有可能的空换行
        if (item) return item;
      });
      return list;
    },
    changeAttr() {
      this.addWarehouseForm.assetsList = [];
      this.addWarehouseForm.jsonlist = [{
        name: '',
        num: 1,
        unit: '',
        goodsCode: '',
      }];
      this.filterErpOptionsArr = [];
      this.filterErpOptionsArr.push(JSON.parse(JSON.stringify(this.stockList)));
    },
    onHandleAddWarehouse(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addWarehouseForm.goodsAttribute == 10) {
            if (!this.addWarehouseForm.assetsList || this.addWarehouseForm.assetsList.length == 0) {
              this.$message.warning("请添加设备后重试");
              return false;
            }
            this.addWarehouseForm.deviceCodes = [];
            for (let i = 0; i < this.addWarehouseForm.assetsList.length; i++) {
              const element = this.addWarehouseForm.assetsList[i];
              this.addWarehouseForm.deviceCodes.push(element.deviceCode);
            }
            var par = JSON.parse(JSON.stringify(this.addWarehouseForm));
            par.goodsCodes = "";
            par.outNum = "";
            par.jsonlist = null;
            par.deviceCodes = String(par.deviceCodes);
            par.userId = User.getData("userId");
            par.assetsList = null;
            addOutFun(par).then(resp => {
              this.$message.success("操作成功");
              this.$router.go(-1);
            });
          }else {
            this.addWarehouseForm.goodsCodes = [];
            this.addWarehouseForm.outNum = [];
            for (let i = 0; i < this.addWarehouseForm.jsonlist.length; i++) {
              const element = this.addWarehouseForm.jsonlist[i];
              this.addWarehouseForm.goodsCodes.push(element.goodsCode);
              this.addWarehouseForm.outNum.push(element.num);
            }
            var par = JSON.parse(JSON.stringify(this.addWarehouseForm));
            par.goodsCodes = String(par.goodsCodes);
            par.outNum = String(par.outNum)
            par.jsonlist = null;
            par.deviceCodes = "";
            par.userId = User.getData("userId");
            addOutFun(par).then(resp => {
              this.$message.success("操作成功");
              this.$router.go(-1);
            });
          }
        }
      })
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.add-warehouse {
  background: #fff;
  .add-warehouse-form {
    width: 1000px;
    margin: 0 auto;
    padding-top: 50px;
    .leng-input {
      /deep/ .el-form-item__content{
        width: 200px;
      }
      /deep/ .el-select.el-select--small{
        width: 200px;
      }
    }
  }
  .warehouse-row {
    display: flex;
  }
}
.addMoreBtn {
  width: 600px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #ccc;
  margin-left: -50px;
  cursor: pointer;
}
.imei_count {
  position: absolute;
  bottom: 0px;
  right: 20px;
}
.tips {
  color: red;
  font-size: 12px;
  line-height: 36px;
  text-indent: 24px;
}
.myAllNum {
  line-height: 58px;
  overflow: hidden;
  border: 1px solid #EBEEF5;
  .right-span{
    display: block;
    width: 140px;
    float: right;
  }
}
</style>
