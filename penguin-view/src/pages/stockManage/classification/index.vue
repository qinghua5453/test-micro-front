<template>
  <div class="invoice">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['存货管理', '存货']" />
    <div class="class-content">
      <div class="leftTree">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button type="text" class="top-btn" @click="addType" v-if="getPerm('mer:classification:add')">新增</el-button>
            <el-button type="text" class="top-btn" @click="editType" v-if="getPerm('mer:classification:edit')">修改</el-button>
            <el-button type="text" class="top-btn" @click="delType" v-if="getPerm('mer:classification:delete')">删除</el-button>
          </div>
          <!-- <el-row :gutter="20">
            <el-col :span="18">
              <el-input clearable v-model="keywords"></el-input>
            </el-col>
            <el-col :span="6">
              <a class="el-button el-button--primary" type="primary" @click="typeSearchList()">查找</a>
            </el-col>
          </el-row> -->
          <el-tree ref="tree" node-key="id" :highlight-current="true" :expand-on-click-node="false" :default-expanded-keys="expand" :props="defaultProps" :data="data" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="bs-icon ic-folder"></i>{{ node.label }}
            </span>
          </el-tree>
        </el-card>
      </div>
      <div class="rightTb">
        <div class="button-items">
          <el-popover
            v-if="getPerm('mer:classification:add')"
            placement="bottom"
            width="40"
            class="popoverDiv"
            trigger="click">
            <div class="choseBtn">
              <div class="firstDiv" @click="addAssets">
                资产
              </div>
              <div @click="addLux">
                消耗品
              </div>
            </div>
            <a class="el-button el-button--primary" slot="reference" type="primary">新增</a>
          </el-popover>
          <a class="el-button el-button--primary" style="margin-left: 10px;" type="primary" @click="goEditAsset()" v-if="getPerm('mer:classification:edit')">修改</a>
          <a class="el-button el-button--primary" type="primary" @click="goDelAsset()" v-if="getPerm('mer:classification:delete')">删除</a>
          <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查找</a>
        </div>
        <!--表格-->
        <div class="tab-s">
          <el-table border :data="list" ref="list" @selection-change="selsChange" style="width: 100%" :fit="true" height="603" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="goodsCode" label="存货编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="goodsName" label="存货名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceCode" label="设备编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="unit" label="计量单位" show-overflow-tooltip>
              <template slot-scope="scope">
                {{checkUnit(scope.row.unit)}}
              </template>
            </el-table-column>
            <el-table-column prop="erpCode" label="ERP库存编号">
            </el-table-column>
            <el-table-column prop="createTime" label="建档日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.status == 1 ? "启用" : "停用"}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-tooltip content="启用" placement="top" effect="dark">
                  <svg style="font-size: 24px;" v-if="!scope.row.status" class="icon weiixn-icon" aria-hidden="true" @click="handleToggle(scope.row)">
                    <use xlink:href="#icon-kaiguankai"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip content="停用" placement="top" effect="dark">
                  <svg style="font-size: 24px;" v-if="scope.row.status" class="icon weiixn-icon" aria-hidden="true" @click="handleToggle(scope.row)">
                    <use xlink:href="#icon-kaiguanguan"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="查找存货"
      :visible.sync="isShowSearch"
      width="500px"
    >
      <el-form class="addTypeForm" :model="searchData" ref="setModuleTrafficForm" label-width="130px">
        <el-form-item label="存货名称：">
          <el-select
            v-model="searchData.goodsId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键字搜索"
            :remote-method="remoteMethod"
            style="width:100%;"
            >
            <el-option
              v-for="item in filterOptions"
              :key="item.id"
              :label="item.goodsName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ERP存货编码：">
          <el-input clearable v-model="searchData.erpCode"></el-input>
        </el-form-item>
        <el-form-item label="存货分类：">
          <el-cascader
          style="width:100%;"
          v-model="paType"
          :props="defaultOptt"
          :options="checkedZero"
          filterable
          clearable></el-cascader>
        </el-form-item>
        <el-form-item label="设备编码：" prop="deviceCode">
          <el-input clearable v-model="searchData.deviceCode"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width:100%;" v-model="searchData.status" placeholder="请选择状态">
            <el-option label="不限" value=""></el-option>
            <el-option label="停用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="doSearch">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增/编辑存货分类 -->
    <classfication-edit v-if="isShowAddShopDialog" :visible.sync="isShowAddShopDialog" :parentsData="addOrEditTree" :curparentData="curParent" :editData="editData" :isEdit="isEdit" @childFn="getTreeData" />

     <!-- 新增/编辑存货 -->
    <stock-edit v-if="isShowAddLuxDialog" :visible.sync="isShowAddLuxDialog" :parentsData="checkedZero" :curparentData="curAssetParent" :editData="editAssetData" :isEdit="isAssetEdit" :typeArrs="typeArrs" :assetType="assetType" @childFn="getStockList" />
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import Api from "@/utils/Api";
import PagerMixin from "@/mixins/PagerMixin";
import DataUtils from "@/utils/Data";
import QBreadcrumb from "@/components/Breadcrumb";
import { exportExcel } from "@/utils/tool";
import { assetCurStatusType } from "@/utils/Mapping";
import {
  codeListApi,
  codeListFun,
} from "../../detergentManage/detergent";
import {
  treeDataFun,
  delTypeFun,
  searchListFun,
  typeDelApi,
  typeStockListFun,
  changeStockApi,
  changeStockFun,
  delAssetFun,
  erpNameFun
} from "../stock";

import classficationEdit from './classficationEdit';
import stockEdit from './stockEdit';

export default {
  mixins: [PagerMixin],
  components: {
    QBreadcrumb,
    classficationEdit,
    stockEdit
  },
  data() {
    return {
      defaultKey: [0,13,29],
      sels: [],
      keywords: "",
      // expandedArr: [0],
      curParent: [0],
      curAssetParent: [],
      expand: [0],
      editData : {},
      editAssetData : {},
      isEdit: false,
      isAssetEdit: false,
      isShowAddShopDialog: false,
      isShowAddLuxDialog: false,
      isShowSearch: false,
      typeArrs: [],
      checkedNoZero: [],
      checkedZero: [],
      checkedLevelData: [],

      addOrEditTree: [],
      data: [
        {
					"childNodes": [
					],
					"goodsCategoryCode": "",
					"goodsCategoryName": "存货分类",
					"id": 0,
					"level": 0,
          "parentId": 0,
          showCode: "",
          showCodeName: "存货分类",
					"status": true
				}
      ],
      defaultOptt: {
          children: 'childNodes',
          label: 'showCodeName',
          value: 'id',
      },
      defaultProps: {
          children: 'childNodes',
          label: 'showCodeName'
      },
      list: [], // 数据
      total: 0,
      //头部搜索
      searchData: {
        "deviceCode": "",
        "erpCode": "",
        "goodsCategoryId": "",
        "goodsCode": "",
        "goodsId": "",
        status: "",
      },
      assetType: 20,
      paType: [],
      erpNames: [],
      filterOptions: []
    };
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    assetCurStatusType() {
      return assetCurStatusType;
    },
  },
  created() {
    if (this.getPerm("mer:classification:list")) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      this.getTreeData();
      this.getAllErpData();
    }
  },
  methods: {
    async getAllErpData() {
      var par = {
        keywords: ''
      }
      let res = await erpNameFun(par);
      this.erpNames = res;
      this.filterOptions = this.erpNames;
    },
    async getErpData(word) {
      var par = {
        keywords: word
      }
      let res = await erpNameFun(par);
      this.filterOptions = res;
    },
    async getTreeData(id) {
      this.curParent = [0];
      this.curAssetParent = [];
      this.editData = {};
      if(id) {
        this.expand = [id];
      }
      var par = {
        keywords: ""
      }
      let res = await treeDataFun(par);
      this.checkNoTypeArr(res);
      this.checkNameTypeArr(this.checkedZero);

      this.data[0].childNodes = this.checkedZero;
      this.getTypeArr(this.data);
      // this.checkTypeArr(this.data);
      this.checkedNoZero = this.data;
      this.checkLevelArr(this.data)
      this.getStockList();
    },
    async doSearch() {
      var par1 = {
        page: 1,
        pageNum: 1,
        pageSize: 1000,
      }
      let par = Object.assign(this.searchData, par1);
      if(this.paType && this.paType.length > 0) {
        par.goodsCategoryId = this.paType[this.paType.length - 1];
      }
      let res = await typeStockListFun(par);
      this.list = res.items;
      this.total = res.total;
      this.isShowSearch = false;
    },
    async getStockList() {
      var par = {
        "goodsCategoryId": this.editData.id ? this.editData.id : null,
        page: 1,
        pageNum: 1,
        pageSize: 1000,
      }
      let res = await typeStockListFun(par);
      this.list = res.items;
      this.total = res.total;
    },
    async typeSearchList() {
      if(this.keywords) {
        this.curParent = [0];
        this.curAssetParent = [];
        this.editData = {};
        var par = {
          keywords: this.keywords
        }
        let res = await searchListFun(par);
        this.data[0].childNodes = res;
        this.getTypeArr(this.data);

        this.list = res;
      }
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
    checkChild(node) {
      let curNode = node;
      const checkedNode = function(dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            if (father.childNodes && father.childNodes.length == 0) {  
              curNode = father;
            }
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedNode(father.childNodes);
            }
        });
        // return;
      }
      checkedNode(node.childNodes)
    },
    addAssets() {
      // if (this.editData && this.editData.childNodes && this.editData.childNodes.length > 0) {
      //   this.checkChild(this.editData.childNodes);
      // }
      this.isAssetEdit = false;
      this.assetType = 10;
      this.isShowAddLuxDialog = true;
    },
    addLux() {
      this.isAssetEdit = false;
      this.assetType = 20;
      this.isShowAddLuxDialog = true;
    },
    addType() {
      if (this.editData.level >= 3) {
        this.$message.warning("当前分类暂不支持添加子分类!");
        return false;
      }
      
      this.addOrEditTree = JSON.parse(JSON.stringify(this.checkedLevelData));
      this.isEdit = false;
      this.isShowAddShopDialog = true;
    },
    goEditAsset() {
      if(this.sels && this.sels.length == 1) {
        this.editAssetData = this.sels[0];
        this.assetType = this.editAssetData.goodsAttribute ? this.editAssetData.goodsAttribute : 20;
        this.isAssetEdit = true;
        this.isShowAddLuxDialog = true;
      } else if(this.sels && this.sels.length > 1) {
        this.$message.warning("只能同时编辑一个存货!");
      } else {
        this.$message.warning("请选择存货后重试!");
      }
    },
    editType() {
      if(this.editData.id) {

        this.addOrEditTree = JSON.parse(JSON.stringify(this.checkedNoZero));
        this.isEdit = true;
        this.isShowAddShopDialog = true;
      }
    },
    goDelAsset() {
      if(this.sels && this.sels.length > 0) {
        let arr = [];
        for (let i = 0; i < this.sels.length; i++) {
          const element = this.sels[i];
          arr.push(element.id);
        }

        let w = this.editData.goodsCategoryName;
        this.$confirm(`您确定要删除存货?`, '提示', {
          type: 'warning'
        }).then(_ => {
          let par = {
            goodsIds: String(arr)
          }

          delAssetFun(par).then(resp => {
            this.$message.success("操作成功");
            this.getStockList();
          });
        });
      } else {
        this.$message.warning("请选择存货后重试!");
      }
    },
    delType() {
      if(this.editData.id) {
        let url = typeDelApi + '/' + this.editData.id
        let w = this.editData.goodsCategoryName;
        this.$confirm(`您确定要删除“${w}”存货分类?`, '提示', {
          type: 'warning'
        }).then(_ => {
          let par = {}
          delTypeFun(url,par).then(resp => {
            this.$message.success("操作成功");
            this.getTreeData();
          });
        });
      }
      
    },
    handleNodeClick(data) {
      this.curParent = [];
      this.curAssetParent = [];
      // if(data.id) {
      //   this.curParent.push(data.id);
      // }
      this.editData = data;
      this.expand = [data.id];
      // this.getParentArr(data);
      this.getAssetParentArr(data);
      let arr = [0];

      this.curParent = arr.concat(this.curAssetParent);

      this.getStockList();
    },
    checkLevelArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            if (father.childNodes && father.childNodes.length == 0) {  
              father.childNodes = null;
            }
            if (father.level == 2) {
              father.childNodes = null;
            }

            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes);
            }
        });
        // return;
      }
      checkedFromTree(dataArr);
      // console.log(dataArr);
      this.checkedLevelData = dataArr;
    },
    checkTypeArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            if (father.childNodes && father.childNodes.length == 0) {  
              father.childNodes = null;
            }     
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes);
            }
        });
        // return;
      }
      checkedFromTree(dataArr);
      this.checkedNoZero = dataArr;
    },
    checkNoTypeArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource,code){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            father.showCode = code + father.goodsCategoryCode;
            if (father.childNodes && father.childNodes.length == 0) {  
              father.childNodes = null;
            }     
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes,father.showCode);
            }
        });
        // return;
      }
      checkedFromTree(dataArr,"");
      this.checkedZero = dataArr;
    },
    checkNameTypeArr(arr) {
      let dataArr = JSON.parse(JSON.stringify(arr));
      // tree 铺平方法
      const checkedFromTree = function(dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            father.showCodeName = father.showCode +" "+ father.goodsCategoryName;
            if (father.childNodes && father.childNodes.length > 0) {  
              checkedFromTree(father.childNodes);
            }
        });
        // return;
      }
      checkedFromTree(dataArr);
      this.checkedZero = dataArr;
    },
    getTypeArr(arr) {
      // tree 铺平方法
      const setGridDataFromTree = function(list,dataSource){
        if (!(Array.isArray(dataSource) && dataSource.length >0)) return ;            
        dataSource.forEach((father) => {
            // debugger;
            list.push(father);            
            if (father.childNodes && father.childNodes.length > 0) {  
              setGridDataFromTree(list, father.childNodes);
            }
        });
        // return;
      }
      var list= [];
      setGridDataFromTree(list, arr, "");
      this.typeArrs = list;
    },
    getParentArr(type) {
      let typeArrs = this.typeArrs;
      let checkedArr = this.curParent;
      // tree 铺平方法
      const setKeyFromTree = function(item){
        if (!item.parentId || item.parentId == 0) {
          checkedArr.unshift(0);
        } else {
          let isThere = false;
          let checkedItem = {};
          for (let i = 0; i < typeArrs.length; i++) {
            const element = typeArrs[i];
            if (element.id == item.parentId) {
              isThere = true;
              checkedItem = element;
            }
          }
          if(isThere) {
            checkedArr.unshift(item.parentId);
            setKeyFromTree(checkedItem)
          }
        };
        // return;
      }
      setKeyFromTree(type)
      this.curParent = checkedArr;
    },
    getAssetParentArr(type) {
      let typeArrs = this.typeArrs;
      let checkedArr = this.curAssetParent;
      checkedArr.unshift(type.id);
      // tree 铺平方法
      const setKeyFromTree = function(item){
        if (!item.parentId || item.parentId == 0) {
          console.log()
        } else {
          let isThere = false;
          let checkedItem = {};
          for (let i = 0; i < typeArrs.length; i++) {
            const element = typeArrs[i];
            if (element.id == item.parentId) {
              isThere = true;
              checkedItem = element;
              break;
            }
          }
          if(isThere) {
            checkedArr.unshift(item.parentId);
            setKeyFromTree(checkedItem)
          }
        };
        // return;
      }
      setKeyFromTree(type)
      this.curAssetParent = checkedArr;
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    // 开通微信支付
    handleToggle(device) {
      let url = changeStockApi + device.id;
      let w = device.status == 1 ? '停用' : '启用';
      this.$confirm(`是否需要${w}该存货?`, '提示', {
        type: 'warning'
      }).then(_ => {
        var par = {
        }
        changeStockFun(url,par).then(resp => {
            this.$message({
              showClose: true,
              message: `操作成功！`,
              type: 'success'
            });
            device.status = device.status == 1 ? 0 : 1;
          });
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.getErpData(query);
      } else {
        this.filterOptions = this.erpNames;
      }
    },
    goSearchList() {
      this.searchData = {
        "deviceCode": "",
        "erpCode": "",
        "goodsCategoryId": "",
        "goodsCode": "",
        "goodsId": "",
        status: "",
      };
      this.paType = [];
      this.isShowSearch = true;
    },
    goDetail(row) {
      this.$router.push({
        name: 'stockDetail',
        query: { id: row.id }
      });
    },
    exportTable() {
      let query = DataUtils.clone(this.searchData);
      query.excel = true;
      exportExcel(codeListApi, "库存列表总览.xlsx", query);
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.action-wraper {
  margin-bottom: 10px;
}
.signalred {
  color: #f54949;
}
.table-action /deep/ .el-button {
  padding: 7px 10px !important;
}
.linkinNum {
  text-decoration: underline;
  color: #409EFF;
  cursor: pointer;
}
.class-content {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .leftTree {
    width: 30%;
    float: left;
    background: #fff;
    min-height: 658px;
  }
  .rightTb {
    width: 69%;
    float: right;
    .button-items {
      padding-left: 12px;
      background: #fff;
      
    }
  }
}
.box-card {
  .top-btn {
    padding: 0px 10px !important;
    margin-top: 0px !important;
  }
}
.popoverDiv.el-popover {
  min-width: 60px !important;
}
.choseBtn {
  width: 100%;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  .firstDiv {
    border-bottom: 1px solid #EBEEF5;
  }
}
.menu-btn {
  width: 100px;
}
</style>
