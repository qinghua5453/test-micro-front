<template>
  <section v-if="getPerm('dal:credit:list')" class="invite-wrap">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['用户管理', '信用租']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="订单号：">
            <el-input size="small" clearable v-model="searchData.orderNo" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input size="small" clearable v-model="searchData.phone" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input size="small" clearable v-model="searchData.userName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.orderStatus" style="width: 140px;" placeholder="全部">
              <el-option value="" label="全部">全部</el-option>
              <el-option value="0" label="审核中"></el-option>
              <el-option value="1" label="待发货"></el-option>
              <el-option value="2" label="待收货"></el-option>
              <el-option value="3" label="已完成"></el-option>
              <el-option value="4" label="未通过"></el-option>
              <el-option value="5" label="已退还"></el-option>
              <el-option value="6" label="退还中"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              size="small"
              v-model="searchData.time"
              type="daterange"
              align="right"
              :editable="false"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:credit:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table border :data="list" style="width: 100%" :fit="true" ref="table" height="675" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod"></el-table-column>
            <el-table-column prop="orderNo" label="订单号">
              <template slot-scope="scope">
                <span class="name-active" @click="openInforDialog(scope.row, scope.row.orderNo)">{{ scope.row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="school" label="学校"></el-table-column>
            <el-table-column prop="address" label="收货地址"></el-table-column>
            <el-table-column prop="orderStatus" label="状态" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="buildTime" label="建单时间"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:credit:approve')" content="审核" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.orderStatus === 0" @click="examine(scope.row.orderNo)">
                    <use xlink:href="#icon-shenhe"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:credit:send')" content="确认发货" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.orderStatus === 1" @click="showSendModle(scope.row.orderNo)">
                    <use xlink:href="#icon-fahuo"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:credit:affirm')" content="确认收货" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.orderStatus === 2" @click="getReceiving(scope.row.orderNo)">
                    <use xlink:href="#icon-yishouhuo"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:credit:back')" content="确认退回" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.orderStatus === 6" @click="saleReturn(scope.row.orderNo)">
                    <use xlink:href="#icon-tuihui"></use>
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
    <!-- 订单详情 -->
    <el-dialog class="order-detail" title="订单详情" size="tiny" :visible.sync="isinforVisible" @close="isinforVisible = false" width="1200px">
      <div class="border-b examine-visible">
        <h2><i class="header-icon el-icon-goods"></i>操作信息</h2>
        <p v-for="(item, index) in inforLogListL" :key="index" class="action-log">
          <span style="width:200px;">时间：{{ item.buildTime }}</span>
          <span style="width:130px;">操作人：{{ item.operatorName }}</span>
          <span style="width:100px">类型：{{ item.type }}</span>
          <span style="width:180px" v-if="item.phone">账号：{{ item.phone }}</span>
          <span v-if="item.review" style="width:150px">审核结果：{{ item.review }}</span>
          <span v-if="item.reason">原因：{{ item.reason }}</span>
          <span v-if="item.logisticsCompany">物流公司：{{ item.logisticsCompany }}</span>
          <span v-if="item.shipNum">发货单号：{{ item.shipNum }}</span>
        </p>
      </div>
      <div class="border-b  examine-visible" style="border:none">
        <h2><i class="header-icon el-icon-goods"></i>基本信息</h2>
        <el-form :inline="true" :model="inforData">
          <el-form-item label="订单编号：">
            <span>{{ inforData.orderNo }}</span>
          </el-form-item>
          <el-form-item label="创建时间：">
            <span>{{ inforData.buildTime }}</span>
          </el-form-item>
          <el-form-item label="支付时间：">
            <span>{{ inforData.buildTime }}</span>
          </el-form-item>
          <el-form-item label="订单状态：">
            <span>{{ inforData.orderStatus | orderStatus }}</span>
          </el-form-item>
        </el-form>
        <el-table border :data="inforTable" class="my-table">
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="num" label="数量"></el-table-column>
          <el-table-column prop="payType" label="支付方式"></el-table-column>
          <el-table-column prop="money" label="订单金额"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog class="diaolog-ope" title="信用租审核" :visible.sync="isExamineVisible" @close="isExamineVisible = false" width="740px">
      <el-form :inline="true" :model="examineInforData" class="examine-visible">
        <el-form-item label="姓名：" class="form-item-m">
          <span>{{ examineInforData.studentName }}</span>
        </el-form-item>
        <el-form-item label="性别：" class="form-item-m">
          <span>{{ examineInforData.gender | genderStatus }}</span>
        </el-form-item>
        <el-form-item label="出生年月：" class="form-item-m">
          <span>{{ examineInforData.birth }}</span>
        </el-form-item>
        <el-form-item label="身份证号：" class="form-item-m">
          <span>{{ examineInforData.identityId }}</span>
        </el-form-item>
        <el-form-item label="学校：" class="form-item-m">
          <span>{{ examineInforData.school }}</span>
        </el-form-item>
        <el-form-item label="院系：" class="form-item-m">
          <span>{{ examineInforData.department }}</span>
        </el-form-item>
        <el-form-item label="专业：" class="form-item-m">
          <span>{{ examineInforData.profession }}</span>
        </el-form-item>
        <el-form-item label="班级：" class="form-item-m">
          <span>{{ examineInforData.studentClass }}</span>
        </el-form-item>
        <el-form-item label="学号：" class="form-item-m">
          <span>{{ examineInforData.studentId }}</span>
        </el-form-item>
        <el-form-item label="宿舍号：" class="form-item-m">
          <span>{{ examineInforData.dormitoryNum }}</span>
        </el-form-item>
        <el-form-item label="投放地照片：" class="form-item-m">
          <img v-if="examineInforData.placementUrl" :src="examineInforData.placementUrl" width="146" height="146" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goRegConfirm()">通过</el-button>
        <el-button
          type="primary"
          @click.native="
            isRegRefuseVisable = true;
            isExamineVisible = false;
          "
          >驳回</el-button
        >
      </div>
    </el-dialog>
    <!-- 审核驳回 -->
    <el-dialog class="min-dialog" title="注册审核" :visible.sync="isRegRefuseVisable" @close="refuseReg('regExmainForm')" width="740px">
      <el-form label-width="96px" :model="regExmainForm" :rules="regExmainRules" ref="regExmainForm" class="examine-visible">
        <el-form-item label="审核意见：" prop="reason">
          <el-input type="textarea" v-model="regExmainForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goRegRefuse('regExmainForm')">确认</el-button>
      </div>
    </el-dialog>

    <!--确认收货-->
    <el-dialog class="min-dialog" title="确认发货" :visible.sync="isSendVisable" @close="closeSend('sendFormForm')" width="520px">
      <el-form label-width="96px" :model="sendForm" :rules="sendFormRules" ref="sendFormForm" class="examine-visible">
        <el-form-item label="物流公司：" prop="logisticsCompany">
          <el-input class="el-input" v-model.trim="sendForm.logisticsCompany" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发货单号：" prop="shipNum">
          <el-input class="el-input" v-model.trim="sendForm.shipNum" clearable auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="confirmSend('sendFormForm')">提交</el-button>
      </div>
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
import { ApplyCreditStatus, PayType, GenderStatus } from '@/utils/Mapping';
export default {
  name: 'page-invite-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        beginTime: null,
        endTime: null,
        time: null
      },
      orderNo: '', //订单号
      isinforVisible: false,
      inforData: {},
      inforLogListL: [],
      inforTable: [
        {
          name: '企鹅智能洗衣机',
          num: '1',
          payType: '支付宝',
          money: '1.00'
        }
      ],
      //审核
      isExamineVisible: false,
      examineInforData: {},
      isRegVisable: false,
      isRegRefuseVisable: false,
      regExmainForm: {
        reason: ''
      },
      regExmainRules: {
        //新增运营商验证
        reason: [
          { required: true, message: '请输入驳回理由', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ]
      },

      isSendVisable: false,
      sendForm: {},
      sendFormRules: {
        //新增运营商验证
        logisticsCompany: [{ required: true, message: '请输入物流公司名称', trigger: 'blur' }],
        shipNum: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
      }
    };
  },
  mounted() {},
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:help:list')) {
      this.getInviteList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.beginTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.beginTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //获取用户列表信息
    getInviteList() {
      this.apiUrl = Api.APPLY_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    formatterStatus(row, column) {
      return ApplyCreditStatus[row.orderStatus];
    },
    //根据搜索条件查询
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.beginTime = query.time ? query.time[0] : null;
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
    //详情
    openInforDialog(row, orderNo) {
      this.$axios
        .post(Api.APPLY_LOG, {
          orderNo: orderNo
        })
        .then(res => {
          this.inforData = row;
          this.inforLogListL = res.list;
          this.isinforVisible = true;
        });
    },
    //审核
    examine(orderNo) {
      this.$axios
        .post(Api.APPLY_INFOR, {
          orderNo: orderNo
        })
        .then(res => {
          this.orderNo = orderNo;
          this.isExamineVisible = true;
          this.examineInforData = res;
        });
    },
    //审核通过
    goRegConfirm() {
      this.opeartorRegExamine(1);
    },
    //审核驳回
    goRegRefuse(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.opeartorRegExamine(4);
        } else {
          return false;
        }
      });
    },
    refuseReg(formName) {
      this.isExamineVisible = false;
      this.isRegRefuseVisable = false;
      this.$refs[formName].resetFields();
    },
    //注册审核信息
    opeartorRegExamine(orderStatus) {
      let params = {
        orderNo: this.orderNo || '',
        orderStatus: orderStatus
      };
      if (orderStatus === 4) {
        params = {
          orderNo: this.orderNo || '',
          orderStatus: orderStatus,
          reason: this.regExmainForm.reason || ''
        };
      }
      this.$axios.post(Api.APPLY_REBVIEW, params).then(resp => {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.getInviteList();
        this.isExamineVisible = false;
        this.$refs.regExmainForm.resetFields();
        this.isRegRefuseVisable = false;
      });
    },
    //发货
    showSendModle(orderNo) {
      this.isSendVisable = true;
      this.orderNo = orderNo;
    },
    closeSend(formName) {
      this.isSendVisable = false;
      this.$refs[formName].resetFields();
    },
    confirmSend(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            orderNo: this.orderNo || '',
            orderStatus: 2,
            logisticsCompany: this.sendForm.logisticsCompany,
            shipNum: this.sendForm.shipNum
          };
          this.$axios.post(Api.APPLY_SNED, params).then(resp => {
            this.$message({
              showClose: true,
              message: '操作成功！',
              type: 'success'
            });
            this.getInviteList();
            this.isSendVisable = false;
          });
        }
      });
    },
    //收货
    getReceiving(orderNo) {
      this.$confirm('请确认货物是否收到?', '确认收货', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        let params = {
          orderNo: orderNo || '',
          orderStatus: 3
        };
        this.$axios.post(Api.APPLY_CONFIRM, params).then(resp => {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          });
          this.getInviteList();
        });
      });
    },
    //退回
    saleReturn(orderNo) {
      this.$confirm('请确认货物是否退回?', '确认退回', {
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then(() => {
        let params = {
          orderNo: orderNo || '',
          orderStatus: 5
        };
        this.$axios.post(Api.APPLY_BACK, params).then(resp => {
          this.$message({
            showClose: true,
            message: '操作成功！',
            type: 'success'
          });
          this.getInviteList();
        });
      });
    },
    // 导出
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.beginTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.APPLY_ExCEL, '信用租总览.xlsx', query);
        }
      });
    }
  },
  filters: {
    orderStatus(value) {
      return ApplyCreditStatus[value];
    },
    genderStatus(value) {
      return GenderStatus[value];
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
.invite-wrap {
  .el-dialog__body {
    padding: 0;
  }
  .bd-con {
    color: #333;
    text-align: center;
    font-size: 16px;
    padding-top: 40px;
    padding-bottom: 20px;
    .invite-num {
      font-size: 32px;
      padding-top: 40px;
      padding-bottom: 20px;
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

.carrier-detail {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 20px;
}
.action-log {
  padding: 20px 0;
  span {
    display: block;
    float: left;
    margin-right: 50px;
  }
}
.examine-visible {
  padding: 30px;
  .form-item-m {
    width: 300px;
  }
}
</style>
