<template>
    <!--配置店铺-->
    <div class="tab-s"> 
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
            <el-form-item label="店铺名称">
                <el-input v-model="searchData.shopName" :clearable="true" size="mini" placeholder="店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="区域">
                <q-area v-model="searchData.areaIds" size="mini" default-option="不限" />
            </el-form-item>
            <el-form-item label="店铺地址">
                <el-input v-model="searchData.address"  :clearable="true" size="mini" placeholder="店铺地址"></el-input>
            </el-form-item>
            <el-form-item label="运营商账号">
                <el-input v-model="searchData.operatorName" :clearable="true" size="mini" placeholder="运营商账号"></el-input>
            </el-form-item>
           <el-form-item>
                <a class="el-button el-button--primary" type="primary" @click="search()">查询</a>
            </el-form-item>
        </el-form>
        <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="500" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :selectable='checkboxInit'></el-table-column>
            <el-table-column label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="店铺名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="operatorName" label="运营商" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="店铺地址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="bdname" label="BD" width="80" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="block">
               <el-pagination
               v-show="pageShow"
                @size-change="pageSizeChange"
                @current-change="currentChange"
                :current-page="searchData.page"
                :page-sizes="pageSizeOpts"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-col>
    </div>
        
</template>

<script>
import Api from "@/utils/Api";
import QArea from "@/components/Area";
import modlePageMixin from "@/mixins/modlePageMixin";

export default {
  name: "page-relationbd-list",
  mixins: [modlePageMixin],
  data() {
    return {};
  },
  created() {
    this._getList();
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    },
    _getList() {
      try {
        const payload = Object.assign({ status: 2 }, this.searchData);
        payload.provinceId = this.searchData.areaIds
          ? this.searchData.areaIds[0]
          : null;
        payload.cityId = this.searchData.areaIds
          ? this.searchData.areaIds[1]
          : null;
        payload.districtId = this.searchData.areaIds
          ? this.searchData.areaIds[2]
          : null;
        delete payload.areaIds;
        for (const key in this.payload) {
          if (!this.payload[key]) {
            delete this.payload[key];
          }
        }
        this.$axios.post(Api.SHOP_LIST, payload).then(resp => {
          this.total = resp.total;
          this.list = resp.items || [];
          this.isSearchClick = false;
        });
      } catch (e) {
        this.list = [];
        this.tota = 0;
      }
    },
    //订单列表 获取所有有效店铺
    checkboxInit(row, index) {
      if (row.bdname === null || row.bdname === "") {
        return 1; //可勾选
      } else {
        return 0; //不可勾选
      }
    },
    handleSelectionChange(val) {
      this.$emit("chaeckShop", val);
    }
  },
  components: {
    QArea
  }
};
</script>

<style lang="less">
</style>
