<template>
  <section v-if="getPerm('dal:member:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['用户管理', '用户列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="手机号：">
            <el-input size="small" clearable v-model="searchData.phone" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.status" style="width: 140px;" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="0"></el-option>
              <el-option label="冻结" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="VIP：">
            <el-select size="small" v-model="searchData.vip" style="width: 140px;" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:member:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="740" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed prop="phone" label="手机号" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userName" label="昵称" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.sex === 0 ? "男" : "女" }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="balance" label="账户余额" width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="voucherCount" label="可用优惠券" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="
                    openCouponDialog(scope.row.id, scope.row.voucherCount)
                  ">{{ scope.row.voucherCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="balance" label="VIP" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.vip === 0 ? "否" : "是" }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="payTime" label="最近支付时间" width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="shopName" label="最近使用店铺" width="150" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="registerTime" label="注册时间" width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="110">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:member:update')" content="冻结" placement="top" effect="dark">
                  <svg v-if="scope.row.status == 0" class="icon" aria-hidden="true" @click="openFreezeDialog(scope.row)">
                    <use xlink:href="#icon-lock-close"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:member:update')" content="解冻" placement="top" effect="dark">
                  <svg v-if="scope.row.status == 1" class="icon" aria-hidden="true" @click="openthawDialog(scope.row)">
                    <use xlink:href="#icon-lock-open"></use>
                  </svg>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!--////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->

    <!-- 冻结账户 -->
    <el-dialog title="冻结账户" size="tiny" :visible.sync="isfreezeVisible" @close="isfreezeVisible = false">
      <el-form label-width="96px" :model="memberForm" :rules="rules" ref="memberForm">
        <el-form-item label="原因：" prop="reason">
          <el-input class="draw-textarea" v-model="memberForm.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="confirmFreeze('memberForm')">确认</el-button>
      </div>
    </el-dialog>
    <!-- 解冻账户 -->
    <el-dialog title="解冻账户" size="tiny" :visible.sync="isthawVisible" @close="isthawVisible = false">
      <el-form label-width="96px" :model="memberForm" :rules="rules" ref="memberForm">
        <el-form-item label="原因：" prop="thawReason">
          <el-input class="draw-textarea" v-model="memberForm.thawReason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="confirmThaw('memberForm')">确认</el-button>
      </div>
    </el-dialog>

    <!--优惠券列表-->
    <el-dialog class="dialog-device" title="优惠券" :visible.sync="isShowCouponDialog" @close="isShowCouponDialog = false">
      <el-table class="my-table" :data="couponData" border tooltip-effect="dark" center="true" height="500px">
        <el-table-column prop="faceValue" show-overflow-tooltip label="面额" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.faceValue === "0.00"
              ? "免费体验券"
              : scope.row.faceValue + "元"
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minGcoins" show-overflow-tooltip label="条件">
          <template slot-scope="scope">
            <span>{{
              scope.row.minGcoins == 0.0
              ? "无"
              : "满" + scope.row.minGcoins + "元可用"
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="useScope" show-overflow-tooltip label="适用范围" width="120">
          <template slot-scope="scope">
            <span>{{
              scope.row.useScope === 0 ? "通用店铺" : scope.row.shopName
              }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="usePosition" label="适用类型" width="100" :formatter="formatterStatus">
        </el-table-column>
        <el-table-column prop="operatorName" show-overflow-tooltip label="有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate }} 至 {{ scope.row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" show-overflow-tooltip label="有效时段">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" show-overflow-tooltip label="数量">
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { voucherType } from '@/utils/Mapping';
import moment from 'moment';

export default {
  name: 'page-user-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        userName: null,
        status: null,
        startTime: moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        vip: null,
        time: []
      },
      memberForm: {
        reason: null, //冻结原因
        thawReason: null //解冻原因
      },
      rules: {
        /*reason: [{
						required: true,
						message: '请输入冻结的原因',
						trigger: 'blur'
					}],
					thawReason: [{
						required: true,
						message: '请输入解冻的原因',
						trigger: 'blur'
					}],*/
      },
      memberId: '', // 用户id
      isfreezeVisible: false,
      isthawVisible: false,
      dateTime: '',
      isShowCouponDialog: false, // 是否显示优惠券列表
      couponData: [] // 优惠券列表信息
    };
  },
  created() {
    // 判断该用户是否有查看的权限
    if (this.getPerm('dal:member:list')) {
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
      this.getMemberList();
    }
  },
  methods: {
    //获取用户列表信息
    getMemberList() {
      this.apiUrl = Api.MEMBER_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    //根据搜索条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
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
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },

    //锁定用户
    openFreezeDialog(row) {
      this.isfreezeVisible = true;
      this.memberId = row.id;
      this.memberForm.reason = null;
    },
    confirmFreeze() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          let params = {
            memberId: this.memberId || '',
            status: 1,
            reason: this.memberForm.reason || ''
          };
          this.$axios.post(Api.MEMBER_TRIGGER, params).then(resp => {
            this.getMemberList();
            this.isfreezeVisible = false;
            this.memberForm.reason = null;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          });
        }
      });
    },
    //解锁用户
    openthawDialog(row) {
      this.isthawVisible = true;
      this.memberId = row.id;
      this.memberForm.thawReason = null;
    },

    // 确认解冻账户
    confirmThaw() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          let params = {
            memberId: this.memberId || '',
            status: 0,
            reason: this.memberForm.thawReason || ''
          };
          this.$axios.post(Api.MEMBER_TRIGGER, params).then(resp => {
            this.getMemberList();
            this.isthawVisible = false;
            this.memberForm.thawReason = null;
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
          });
        }
      });
    },

    // 格式化状态
    formatStatus: function(row, column, value) {
      switch (row.status) {
        case 0:
          return '正常';
          break;
        case 1:
          return '冻结';
          break;
      }
    },

    // 获取优惠券详情
    getUserCouponDetail(id) {
      return this.$axios
        .post(Api.VOUCHERUSER_USABLE, {
          userId: id
        })
        .then(resp => {
          this.couponData = resp;
        });
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
          exportExcel(Api.EXPORT_MEMBER, '用户总览.xlsx', query);
        }
      });
    },

    // 格式化类型
    formatterStatus(row, column) {
      return voucherType[row.usePosition];
    },

    // 查看可用优惠券
    openCouponDialog(id, voucherCount) {
      if (this.getPerm('dal:voucheruser:usable')) {
        if (id != '' && voucherCount > 0) {
          this.getUserCouponDetail(id).then(_ => (this.isShowCouponDialog = true));
        }
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less">
.draw-textarea {
  .el-textarea__inner {
    line-height: 3.5 !important;
  }
}
</style>
