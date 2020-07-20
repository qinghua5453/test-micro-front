<template>
  <section v-if="getPerm('dal:voucher:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['营销管理', '优惠券配置']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="面额：">
            <el-input size="small" clearable v-model="searchData.price" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select size="small" v-model="searchData.type" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option :label="name" :value="id" :key="id" v-for="(name, id) in ActDiscountType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.status" @change="handleStatus" placeholder="请选择" style="width: 140px;margin-left:12px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="0"></el-option>
              <el-option label="删除" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:voucher:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!-- 新增 -->
          <el-button v-if="getPerm('dal:voucher:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddVoucherDialog">新增优惠券</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" max-height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="面额/折扣">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">{{scope.row.faceValue + '元'}}</span>
                <span v-if="scope.row.type === 2">{{'免费体验券'}}</span>
                <span v-if="scope.row.type === 3">{{scope.row.faceValue * 10 + '折'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="类型" prop="type" width="180" :formatter="formatterDiscountType"></el-table-column>
            <el-table-column show-overflow-tooltip label="条件" prop="minGcoins">
              <template slot-scope="scope">
                <span>{{scope.row.minGcoins == 0.00 || scope.row.type != 1  ? '无' : '满' + scope.row.minGcoins + '元可用'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="状态" prop="status" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.status === 0 ? '正常' : '删除'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="创建时间" prop="createTime">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="createUserName" label="创建人">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope" v-if="scope.row.status === 0">
                <el-tooltip v-if="getPerm('dal:voucher:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddVoucherDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:voucher:delete')" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row.id)">
                    <use xlink:href="#icon-trashcopy"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" :query="payload" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!--////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->
    <el-dialog title="新增优惠券" :visible.sync="isShowAddCouponDialog" @close="isShowAddCouponDialog = false" width="800px">
      <el-form class="addCoupon" style="height:auto;" :rules="voucherrules" :model="addVoucher" ref="addVoucher" label-width="125px" v-if="isShowAddCouponDialog">
        <el-form-item label="类型：" class="form-item-m" prop="type">
          <el-radio-group v-model="addVoucher.type" @change="selectCouponType">
            <el-radio :label="1">满减券</el-radio>
            <el-radio :label="3">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面额：" class="form-item-m" prop="faceValue" v-if="isShowFullCoupon" ref="faceValue">
          <template slot-scope="scope">
            <el-input v-model="addVoucher.faceValue" clearable auto-complete="off" class="input-w"></el-input>&nbsp;&nbsp;元
          </template>
        </el-form-item>
        <el-form-item label="条件：" class="form-item-m" prop="minGcoins" v-if="isShowFullCoupon">
          满&nbsp;&nbsp;<el-input v-model="addVoucher.minGcoins" clearable auto-complete="off" class="input-w"></el-input>&nbsp;&nbsp;元可用
        </el-form-item>
        <el-form-item label="折扣：" class="form-item-m" prop="discountValue" v-if="isShowDiscountCoupon">
          <el-input v-model="addVoucher.discountValue" clearable auto-complete="off" class="input-w"></el-input>&nbsp;&nbsp;折
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="handleAdd">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import QIndex from '@/components/Index';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { voucherType, ActDiscountType } from '@/utils/Mapping';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    // 验证条件
    var checkMinGcoins = (rule, value, callback) => {
      let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/;
      if (!reg.test(value)) {
        return callback(new Error('条件必须大于0，最多包含两位小数'));
      } else if (parseFloat(value) > 99.99) {
        return callback(new Error('条件金额超出允许的最大值'));
      } else {
        callback();
      }
      //  else if (parseFloat(value) <= parseFloat(this.addVoucher.faceValue)) {
      //   return callback(new Error("条件金额需大于面额，请重新填写"));
      // }
    };
    // 验证面额
    var checkfaceValue = (rule, value, callback) => {
      let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/;
      if (!reg.test(value)) {
        return callback(new Error('面额必须大于0，最多包含两位小数'));
      } else if (parseFloat(value) > 99.99) {
        return callback(new Error('面额超出允许的最大值'));
      } else {
        callback();
      }
    };
    // 验证折扣
    var checkDiscountValus = (rule, value, callback) => {
      var reg1 = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/;
      if (!reg1.test(value)) {
        return callback(new Error('折扣必须大于0小于10，并且最多包含一位小数'));
      } else {
        callback();
      }
    };

    return {
      // 额外参数
      query: { status: null },
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,

      //头部搜索
      searchData: {
        faceValue: null, // 优惠券面额
        type: null, // 券类型
        status: '0', // 状态 默认为正常
        startTime: null,
        endTime: null,
        time: null
      },
      payload: {},

      // 新增优惠券
      isShowAddCouponDialog: false, // 是否显示新增优惠券
      addVoucher: {
        id: null,
        type: 1,
        faceValue: null,
        minGcoins: null,
        discountValue: null,
        usePosition: 0
      },
      voucherrules: {
        // 新增验证
        faceValue: [{ required: true, message: '请填写面额', trigger: 'blur' }, { validator: checkfaceValue, trigger: 'blur' }],
        discountValue: [{ required: true, message: '请填写折扣', trigger: 'blur' }, { validator: checkDiscountValus, trigger: 'blur' }],
        minGcoins: [{ required: true, message: '不能为空', trigger: 'blur' }, { validator: checkMinGcoins, trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      isShowFullCoupon: true, // 是否是满减券
      isShowDiscountCoupon: false // 是否显示折扣券
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:voucher:list')) {
      this.getVoucherList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    //状态值修改
    handleStatus(data) {
      this.payload = {
        status: data
      };
    },

    // 清除验证
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
    },

    // 获取优惠券配置列表
    getVoucherList() {
      this.apiUrl = Api.VOUCHER_LIST;
      this.payload = {
        status: this.searchData.status
      };
      let query = Object.assign({}, this.$route.query, this.payload);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 选择类型
    selectCouponType(value) {
      if (value === 1) {
        // 满减券
        this.isShowFullCoupon = true;
        this.isShowDiscountCoupon = false;
      } else {
        this.isShowFullCoupon = false;
        this.isShowDiscountCoupon = true;
      }
      this.$refs.addVoucher.clearValidate();
    },

    // 查询优惠券配置列表
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          if (this.searchData.price == '免费体验券') {
            this.searchData.faceValue = 0;
          } else if (this.searchData.price == '免费') {
            this.searchData.faceValue = 0;
          } else {
            this.searchData.faceValue = this.searchData.price;
          }
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;

          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    // 格式化优惠方式
    formatterDiscountType(row, column) {
      return ActDiscountType[row.type];
    },
    // 添加优惠券弹出框
    async openAddVoucherDialog(id) {
      this.addVoucher = {
        id: null,
        type: 1,
        faceValue: null,
        minGcoins: null,
        discountValue: null,
        usePosition: 0
      };
      if (this.addVoucher.type === 1) {
        // 满减券
        this.isShowFullCoupon = true;
        this.isShowDiscountCoupon = false;
      } else {
        this.isShowFullCoupon = false;
        this.isShowDiscountCoupon = true;
      }
      if (id > 0) {
        await this.getVoucherDetail(id);
      }
      this.isShowAddCouponDialog = true;
    },

    // 获取优惠券详情
    getVoucherDetail(id) {
      return this.$axios
        .post(Api.VOUCHER_DETAILS, {
          id: id
        })
        .then(resp => {
          if (resp.type === 1) {
            // 满减券
            this.isShowFullCoupon = true;
            this.isShowDiscountCoupon = false;
            this.addVoucher.faceValue = Number(resp.faceValue);
            this.addVoucher.minGcoins = resp.minGcoins;
          } else {
            this.isShowFullCoupon = false;
            this.isShowDiscountCoupon = true;
            this.addVoucher.faceValue = null;
            this.addVoucher.discountValue = parseFloat(resp.faceValue) * 10;
            this.addVoucher.minGcoins = null;
          }
          this.addVoucher.id = resp.id;
          this.addVoucher.type = resp.type;
        });
    },

    // 添加优惠券提交
    handleAdd() {
      this.$refs.addVoucher.validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addVoucher);
          if (data.type === 3) {
            data.faceValue = parseFloat(data.discountValue / 10) || null;
            data.minGcoins = 0;
            data.discountValue = null;
          }
          let url = data.id > 0 ? Api.VOUCHER_UPDATE : Api.VOUCHER_ADD;
          this.$axios.post(url, data).then(_ => {
            this.getVoucherList();
            this.isShowAddCouponDialog = false;
            this.$refs.addVoucher.resetFields();
            this.$message({
              showClose: true,
              message: '操作成功！',
              type: 'success'
            });
          });
        }
      });
    },

    // 删除优惠券
    handleDelete(id) {
      this.$confirm('您确定要删除该优惠券吗？', '警告').then(_ => {
        this.$axios
          .post(Api.VOUCHER_DELETE, {
            id: id
          })
          .then(_ => {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getVoucherList();
          });
      });
    },

    // 格式化类型
    formatterStatus(row, column) {
      return voucherType[row.usePosition];
    },

    // 导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.VOUCHER_ExCEL, '优惠券配置总览.xlsx', query);
        }
      });
    }
  },
  computed: {
    ActDiscountType() {
      return ActDiscountType;
    },
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb
  }
};
</script>
<style lang="less">
.max-dialog {
  .el-dialog {
    width: 1000px;
  }
}

.diaolog-ope {
  .el-dialog {
    width: 700px;
  }
  .carrier-detail {
    .border-b {
      border-bottom: 1px solid #e3e1e1;
      .operator-img {
        img {
          display: inline-block;
          width: 50px;
          height: 50px;
          margin: 0 5px;
        }
        .big-img {
          .el-dialog__header {
            border: none !important;
          }
        }
      }
    }
    h2 {
      margin-bottom: 15px;
      padding-top: 15px;
      i {
        margin-right: 10px;
      }
    }
    .el-form-item {
      width: 45%;
      margin-right: 45px;
    }
    .el-form-item:nth-child(odd) {
      margin-right: 0;
    }
  }
}

.border-b {
  border-bottom: 1px solid #e3e1e1;
  margin-bottom: 10px;
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    i {
      margin-right: 8px;
    }
  }
}

.el-input__inner:hover {
  cursor: pointer;
  border-color: #409eff;
}

.name-active:hover {
  cursor: pointer;
}

.el-form-item__label:hover {
  cursor: pointer;
  color: #409eff;
}
.addCoupon {
  .el-input {
    width: 80% !important;
  }
}
</style>
