<template>
  <section v-if="getPerm('dal:member:event:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['营销管理', '活动列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="活动名称：">
            <el-input size="small" clearable v-model="searchData.name" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input size="small" clearable v-model="searchData.username" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="活动时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.status" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="未开始" value="0"></el-option>
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已结束" value="2"></el-option>
              <el-option label="已暂停" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:member:event:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--新增弹出框-->
          <el-button v-if="getPerm('dal:member:event:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddOperatorDialog(0)">新增活动</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip></el-table-column>
            <el-table-column label="活动名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openEventDetailDialog(scope.row.id)">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动类型" prop="type" :formatter="formatterType" show-overflow-tooltip></el-table-column>
            <el-table-column label="活动CODE" prop="code" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column show-overflow-tooltip label="有效期" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.startTime}}至{{scope.row.endTime}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="prizeNum" label="中奖用户数(受邀人)" width="160">
              <template slot-scope="scope">
                <span class="name-active" @click="openMemberPrizeDialog(scope.row.id, scope.row.prizeNum,scope.row.type)">{{scope.row.prizeNum}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="joinNum" label="参与用户数(邀请人)" width="160">
              <template slot-scope="scope">
                <span class="name-active" @click="openMemberJoinDialog(scope.row.id, scope.row.joinNum,scope.row.type)">{{scope.row.joinNum}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createUserName" label="创建人"></el-table-column>
            <el-table-column show-overflow-tooltip :formatter="formatterStatus" prop="createUserName" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:member:event:update') && scope.row.status != 2" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openAddOperatorDialog(scope.row.id)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:member:event:pause')" content="启动" placement="top" effect="dark">
                  <svg style="font-size: 24px;" v-if="scope.row.status == 3" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                    <use xlink:href="#icon-kaiguankai"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:member:event:pause')" content="暂停" placement="top" effect="dark">
                  <svg style="font-size: 24px;" v-if="scope.row.status == 1" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                    <use xlink:href="#icon-kaiguanguan"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:member:event:delete') && scope.row.status != 1" content="删除" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="hanleDelete(scope.row.id)">
                    <use xlink:href="#icon-trashcopy"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip content="复制链接及二维码" placement="top" effect="dark">
                  <svg class="icon" v-if="scope.row.type == 4" aria-hidden="true" @click="hanleCopyLink(scope.row.id,scope.row.name)">
                    <use xlink:href="#icon-fuhao-lianjie"></use>
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
    <!--新增活动 -->
    <el-dialog class="add-activity-dialog" :title="isEditorAdd ? '新增活动' : '编辑活动'" :visible.sync="isShowAddEventDialog" @close="handleCancel">
      <add-header v-if="isShowAddEventDialog" :couponHeaderData="couponHeaderData" :isEditorAdd="isEditorAdd" @handleSetShop="handleSetShop" @setManualShop="setManualShop" @setBatchShop="setBatchShop" @setActivityType="setActivityType" @setStartTime="setStartTime" @setEndTime="setEndTime" @setConditionType="setConditionType" ref="couponHeader"></add-header>
      <el-form label-width="94px" :model="couponTypeData" :rules="couponHeaderDataRules" ref="couponTypeData">
        <el-tag>{{activityType===5 ? '邀请人':'优惠券信息'}}</el-tag>
        <el-form-item label="券类型：" prop="prizeType">
          <el-checkbox-group v-model="couponTypeData.prizeType" :disabled="!isEditorAdd">
            <el-checkbox label="1" name="prizeType" @change="handleVoucherType(1, $event)">满减券</el-checkbox>
            <el-checkbox label="5" name="prizeType" @change="handleVoucherType(5, $event)">折扣券</el-checkbox>
            <el-checkbox label="6" name="prizeType" @change="handleVoucherType(6, $event)">免费体验券</el-checkbox>
            <el-checkbox label="2" name="prizeType" v-if="activityType === 2 ||activityType === 6" @change="handleVoucherType(2, $event)">现金</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form label-width="94px" :model="couponInfoData" :rules="couponInfoDataRules" ref="couponInfoData">
        <el-form-item label="适用类型：" prop="usePosition">
          <el-checkbox-group v-model="couponInfoData.usePosition" :disabled="!isEditorAdd">
            <el-checkbox label="1">洗衣机</el-checkbox>
            <el-checkbox label="2">烘干机</el-checkbox>
            <el-checkbox label="3">洗鞋机</el-checkbox>
            <el-checkbox label="4">吹风机</el-checkbox>
            <el-checkbox label="5">充电桩</el-checkbox>
            <el-checkbox label="6">饮水机</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用店铺：" prop="useScope">
          <el-radio-group v-model="couponInfoData.useScope" :disabled="!isEditorAdd || isScanTypeToDisabledUseScope">
            <el-radio :label="0">通用</el-radio>
            <el-radio v-if="isShowShop" :label="1">指定店铺</el-radio>
            <!-- <label class="name-active set-shop" v-if="couponInfoData.useScope == 1" @click="openShopListDialog(couponHeaderData.shopIds)">查看店铺</label> -->
          </el-radio-group>
        </el-form-item>
        <el-row v-if="activityType===4">
          <el-col :span="6">
            <el-form-item label="券总量：" prop="limitSum">
              <el-input size="small" clearable v-model="couponInfoData.limitSum" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参与次数限制：" prop="limitNum" label-width="180px">
              <el-input size="small" clearable v-model="couponInfoData.limitNum" style="width: 180px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <full-coupon v-if="isShowFullcoupon" :isEditorAdd="isEditorAdd" :fullCouponData="fullCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="fullCoupon"></full-coupon>
        <discount-coupon v-if="isShowDisCountDialog" :isEditorAdd="isEditorAdd" :discountCouponData="discountCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="discountCoupon"></discount-coupon>
        <free-coupon v-if="isShowFreeCoupon" :isEditorAdd="isEditorAdd" :freeCouponData="freeCouponData" :startTime="startTime" :endTime="endTime" :activityType="activityType" ref="freeCoupon"></free-coupon>
        <cash-coupon v-if="isShowCashCoupon" :isEditorAdd="isEditorAdd" :cashCouponData="cashCouponData" :startTime="startTime" :activityType="activityType" ref="cashCoupon"></cash-coupon>
      </el-form>
      <div class="be_invited" v-if="activityType===5">
        <el-tag style="margin-top:20px">受邀人</el-tag>
        <beinvite :isEditorAdd="isEditorAdd" :couponHeaderDatatype="couponHeaderData.type" :beinviteForm="beinviteForm" :activityType="activityType" :startTime="startTime" :endTime="endTime" ref="beInviteFormData"></beinvite>
      </div>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </div>
    </el-dialog>
    <!-- 手动配置店铺信息 -->
    <el-dialog class="setshop-dialog" title="配置店铺" :visible.sync="isShowDialogShop" @close="isShowDialogShop = false">
      <div class="shop-box">
        <div class="shop-left">
          <el-input :disabled="isDisable" placeholder="请输入店铺名称/运营商账号" v-model="searchQuery" clearable></el-input>
          <span class="batch_add_shop" @click="isSetBatchAddShopModel = true">批量添加</span>
          <el-table :data="tableData" highlight-current-row style="width: 100%;" @row-click="handleSelectShop">
            <el-table-column prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operatorName" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div class="shop-right">
          <label>已选店铺({{selectShopData.length}})</label>
          <el-table :data="selectShopData" height="500" highlight-current-row style="width: 100%;">
            <el-table-column prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operatorName" show-overflow-tooltip></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <i @click="handleRemoveShop(scope.$index)" class="el-icon-circle-close" style="font-size:22px;color: #409EFF;"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="handleDialogsubmit">确认</el-button>
        <el-button type="primary" plain @click.native="isShowDialogShop = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 手动配置店铺中的批量添加店铺 -->
    <el-dialog :visible.sync="isSetBatchAddShopModel" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false" @close="isSetBatchAddShopModel = false" width="500px" class="set_batch_page">
      <set-batch-add-shop v-if="isSetBatchAddShopModel" @onBatchShop="onBatchShop" :isSetBatchAddShopModel="isSetBatchAddShopModel"></set-batch-add-shop>
    </el-dialog>
    <!-- 批量上传店铺信息 -->
    <el-dialog title="批量上传" class="upload-dialog" :visible.sync="isShowBulkUploadDialog" @close="isShowBulkUploadDialog = false">
      <div class="file-btn" type="primary">
        立即上传
        <input class="change-file" ref="referenceUpload" type="file" @change="tirggerFile($event)">
      </div>
      <a href="https://static.qiekj.com/images/template/shop.xlsx" class="down-mb">下载模板</a>
    </el-dialog>
    <!--  已配置店铺  -->
    <selected-shop :visible.sync="isShowDialogConfigShop" v-if="isShowDialogConfigShop" :couponHeaderDetail="couponHeaderDetail"></selected-shop>
    <!-- 中奖用户 -->
    <el-dialog title="中奖用户" :visible.sync="isShowWinUserDialog" @close="isShowWinUserDialog = false">
      <win-user :id="actId" v-if="isShowWinUserDialog"></win-user>
    </el-dialog>
    <!-- 参与用户 -->
    <el-dialog title="参与用户" :visible.sync="isShowJoinUserDialog" @close="isShowJoinUserDialog = false">
      <join-user :id="actId" v-if="isShowJoinUserDialog"></join-user>
    </el-dialog>
    <!--活动详情 -->
    <act-detail :visible.sync="isShowActivtiyDetal" v-if="isShowActivtiyDetal" :showActivtiyDetailId="showActivtiyDetailId">
    </act-detail>
    <!-- 活动链接 -->
    <active-link-qr-code :visible.sync="isShowCopyLinkDialog" v-if="isShowCopyLinkDialog" :showActivtiyDetailId="showActivtiyDetailId" :activityLinkName="activityLinkName"></active-link-qr-code>
    <!-- 邀请列表 -->
    <invite-user-list :visible.sync="inviteUserListVisible" v-if="inviteUserListVisible" :eventId="actId"></invite-user-list>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import QShopSelect from '@/components/ShopSelect';
import QIndex from '@/components/Index';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { voucherType, ActType, ActStatus } from '@/utils/Mapping';
import selectedShop from './selectedShop';
import winUser from './winUser';
import joinUser from './joinUser';
import addHeader from './addHeader';
import fullCoupon from './fullCoupon';
import discountCoupon from './discountCoupon';
import freeCoupon from './freeCoupon';
import cashCoupon from './cashCoupon';
import actDetail from './actDetail';
import fullDetail from './fullDetail';
import discountDetail from './discountDetail';
import freeDetail from './freeDetail';
import cashDetail from './cashDetail';
import setBatchAddShop from './setBatchAddShop';
import beinvite from './beinvite';
import inviteUserList from './inviteUserList';
import activeLinkQrCode from './activeLinkQrCode';


export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    var checklimitSum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'));
      } else {
        let reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error('必须输入1-99999之间的数值，不允许输入小数'));
        } else if (value > 99999) {
          callback(new Error('必须输入1-99999之间的数值，不允许输入小数'));
        } else {
          callback();
        }
      }
    };
    var checklimitNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'));
      } else {
        let reg = /^\+?[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error('必须输入1-9之间的数值，不允许输入小数'));
        } else if (value > 9) {
          callback(new Error('必须输入1-9之间的数值，不允许输入小数'));
        } else {
          callback();
        }
      }
    };
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      searchData: {
        //头部搜索
        name: null,
        username: null,
        startTime: null,
        endTime: null,
        status: null,
        time: null
      },

      // 活动信息
      isShowAddEventDialog: false,
      couponHeaderData: {
        id: null,
        name: null,
        type: null,
        sponsor: null,
        platformRatio: 50,
        operatorRatio: 50,
        shopIds: [],
        conditionType: [],
        joinType: null,
        startTime: null,
        endTime: null,
        prizeType: null,
        prizeList: [],
        layerUrl: null,
      },

      // 优惠券信息
      fullCouponData: {
        type: 1,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowFullcoupon: false, // 满减券是否展示
      discountCouponData: {
        type: 5,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowDisCountDialog: false, // 折扣券是否展示
      freeCouponData: {
        type: 6,
        usePosition: null,
        useScope: 0,
        vouchers: []
      },
      isShowFreeCoupon: false, // 免费体验券是否展示
      cashCouponData: {
        vouchers: []
      },
      isShowCashCoupon: false, // 现金是否展示
      couponTypeData: {
        prizeType: []
      },
      couponInfoData: {
        usePosition: ['1', '2', '3', '4', '5', '6'], // 适用类型
        useScope: 0, // 适用店铺
        limitSum: null,
        limitNum: null
      },
      // 适用类型或适用店铺验证
      couponInfoDataRules: {
        usePosition: [{ required: true, message: '请选择适用类型', trigger: 'change' }],
        useScope: [{ required: true, message: '请选择适用店铺', trigger: 'change' }],
        limitSum: [{ validator: checklimitSum, trigger: 'blur' }],
        limitNum: [{ validator: checklimitNum, trigger: 'blur' }]
      },
      // 券类型验证
      couponHeaderDataRules: {
        prizeType: [
          {
            type: 'array',
            required: true,
            message: '请选择券类型',
            trigger: 'change'
          }
        ]
      },
      startTime: null, // 活动开始时间
      endTime: null, // 活动结束时间
      conditionType: null, // 活动参与对象
      activityType: null, // 活动类型
      fullCouponList: [], // 满减券数据
      discountCouponList: [], // 折扣券数据
      freeCouponList: [], // 免费体验券数据
      cashCouponList: [], // 现金数据
      lastOutID: null, // 免费体验券outID

      // 配置店铺信息
      isShowDialogShop: false, // 是否显示配置店铺弹出框
      searchQuery: null,
      tableData: [], // 店铺列表信息
      selectShopData: [], // 已选店铺信息
      selectAfterData: [], // 确认后的数组
      isShowDialogConfigShop: false,
      shopIds: [], // 店铺ids
      isShowBulkUploadDialog: false, // 批量上传文件

      // 中奖/参与用户
      actId: null, // 活动id
      isShowJoinUserDialog: false, // 是否展示参与用户数量
      isShowWinUserDialog: false, // 中奖用户弹出框
      isShowpartUserDialog: false, // 参与用户弹出框

      // 活动编辑
      isDisable: false, // 是否可编辑
      templates: null, //  优惠券金额
      fullEditList: [],
      freeEditList: [],
      discountEditList: [],
      cashEditList: [],
      isconfirm: false, // 是否确认已选店铺

      // 活动详情
      isShowActivtiyDetal: false,
      showActivtiyDetailId: null,
      couponValue: null, // 优惠券table金额
      shopDetail_id: null, // 详情信息的shopId
      isEditorAdd: false, // 是编辑or新增 true 新增 false 编辑

      isShowCopyLinkDialog: false, //活动链接
      activityLinkName: '',

      isSetBatchAddShopModel: false,
      shopCondition: {}, ////店铺筛选条件,json字符串
      isScanTypeToDisabledUseScope: false, //扫码领卷使用店铺为通用
      beinviteForm: {},
      inviteUserListVisible: false
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:event:list')) {
      this.getEventList();
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
    // 给用户奖品列表添加序号
    indexAssocMethos(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    // 获取活动列表
    getEventList() {
      this.apiUrl = Api.MEMBER_EVENT_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 查询活动列表
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
    // 查看活动详情
    openEventDetailDialog(id) {
      if (this.getPerm('dal:member:event:details')) {
        if (id != '') {
          this.showActivtiyDetailId = id;
          this.isShowActivtiyDetal = true;
        }
      }
    },
    // 新增活动弹出框
    async openAddOperatorDialog(id) {
      // 清空所有数据
      this.couponHeaderData = {
        id: null,
        name: null,
        type: null,
        sponsor: null,
        platformRatio: 50,
        operatorRatio: 50,
        shopIds: [],
        conditionType: null,
        joinType: null,
        startTime: null,
        endTime: null,
        file: null,
        prizeType: null,
        prizeList: [],
        layerUrl:null,
      };
      this.couponInfoData = {
        usePosition: ['1', '2', '3', '4', '5', '6'], // 适用类型
        useScope: 0, // 适用店铺
        limitSum: null,
        limitNum: null
      };
      this.couponTypeData = {
        prizeType: []
      };
      this.fullCouponData = {
        // 清空满减券数据
        type: 1,
        usePosition: null,
        useScope: null,
        vouchers: []
      };
      this.cashCouponData = {
        // 清空现金数据
        vouchers: []
      };
      this.discountCouponData = {
        // 清空折扣券数据
        type: 5,
        usePosition: null,
        useScope: null,
        vouchers: []
      };
      this.freeCouponData = {
        // 清空免费体验券数据
        type: 6,
        usePosition: null,
        useScope: null,
        vouchers: []
      };
      this.fullCouponList = []; // 满减券数据
      this.discountCouponList = []; // 折扣券数据
      this.freeCouponList = []; // 免费体验券数据
      this.cashCouponList = []; // 现金数据
      // 编辑或新增
      this.isShowFreeCoupon = false;
      this.isShowDisCountDialog = false;
      this.isShowFullcoupon = false;
      this.isShowCashCoupon = false;
      this.selectShopData = []; // 清空店铺数据
      this.selectAfterData = []; // 清空店铺数据
      this.isEditorAdd = true;
      this.activityType = null;
      if (id) {
        this.fullEditList = [];
        this.freeEditList = [];
        this.discountEditList = [];
        this.cashEditList = [];
        this.isEditorAdd = false;
        await this.getMemberEventDetails(id);
      }
      this.isShowAddEventDialog = true;
    },
    // // 获取活动详情
    getMemberEventDetails(id) {
      return this.$axios
        .post(Api.MEMBER_EVENT_DETAILS, {
          id: id
        })
        .then(resp => {
          this.beinviteForm = resp;
          this.couponHeaderData.id = resp.id;
          this.couponHeaderData.status = resp.status;
          this.couponHeaderData.name = resp.name;
          this.couponHeaderData.type = resp.type;
          this.couponHeaderData.sponsor = resp.sponsor;
          this.couponHeaderData.platformRatio = resp.platformRatio;
          this.couponHeaderData.operatorRatio = resp.operatorRatio;
          this.couponHeaderData.conditionType = resp.conditionType;
          this.couponHeaderData.startTime = resp.startTime;
          this.couponHeaderData.endTime = resp.endTime;
          this.couponHeaderData.prizeType = resp.prizeType;
          this.couponHeaderData.joinType = resp.joinType;
          this.couponHeaderData.shopIds = resp.shopIdList;
          this.couponTypeData.prizeType = resp.prizeType.split(',');
          this.couponHeaderData.limitSum = resp.limitSum;
          this.couponHeaderData.limitNum = resp.limitNum;
          this.couponHeaderData.layerUrl = resp.layerUrl;
          this.activityType = resp.type;
          this.startTime = resp.startTime;
          this.endTime = resp.endTime;
          this.conditionType = resp.conditionType;
          if (!this.isEditorAdd && this.couponHeaderData.joinType === 1 && !this.isconfirm) {
            this.getEditShopList(this.couponHeaderData.id);
          }
          // 赋值
          if (resp.prizes && resp.prizes.length > 0) {
            resp.prizes.map(item => {
              if (item.type === 1) {
                // 满减券
                // 编辑信息赋值
                this.isShowFullcoupon = true;
                this.couponInfoData.usePosition = item.usePosition.split(',');
                this.couponInfoData.useScope = item.useScope;
                this.fullEditList.push(item);
                this.fullEditList = this.fullEditList.map(item => {
                  let data = {
                    id: item.id,
                    type: item.type,
                    outId: item.outId,
                    dateType: item.dateType,
                    startDays: item.startDays,
                    day: item.day,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    prizeNum: item.prizeNum, // 已发放数量
                    num: item.num, // 发放数量
                    assocNum: item.assocNum, // 中奖次数/人
                    chance: item.chance, // 概率
                    //
                    time: [item.startTime, item.endTime],
                    isShowCouponAddBtn: false,
                    date: [item.startDate, item.endDate]
                  };
                  return data;
                });
              } else if (item.type === 5) {
                // 折扣券
                // 编辑信息赋值
                this.isShowDisCountDialog = true;
                this.discountCouponData.vouchers = [];
                this.couponInfoData.usePosition = item.usePosition.split(',');
                this.couponInfoData.useScope = item.useScope;
                this.discountEditList.push(item);
                this.discountEditList = this.discountEditList.map(item => {
                  let data = {
                    id: item.id,
                    type: item.type,
                    outId: item.outId,
                    dateType: item.dateType,
                    startDays: item.startDays,
                    day: item.day,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    maxDerate: item.maxDerate,
                    prizeNum: item.prizeNum, // 已发放数量
                    num: item.num, // 发放数量
                    assocNum: item.assocNum, // 中奖次数/人
                    chance: item.chance, // 概率
                    //
                    time: [item.startTime, item.endTime],
                    isShowCouponAddBtn: false,
                    date: [item.startDate, item.endDate]
                  };
                  return data;
                });
              } else if (item.type === 6) {
                // 免费体验券
                // 编辑信息赋值
                this.isShowFreeCoupon = true;
                this.freeCouponData.vouchers = [];
                this.couponInfoData.usePosition = item.usePosition.split(',');
                this.couponInfoData.useScope = item.useScope;
                this.freeEditList.push(item);
                this.freeEditList = this.freeEditList.map(item => {
                  let data = {
                    id: item.id,
                    type: item.type,
                    outId: item.outId,
                    dateType: item.dateType,
                    startDays: item.startDays,
                    day: item.day,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    prizeNum: item.prizeNum, // 已发放数量
                    num: item.num, // 发放数量
                    assocNum: item.assocNum, // 中奖次数/人
                    chance: item.chance, // 概率
                    //
                    time: [item.startTime, item.endTime],
                    isShowCouponAddBtn: false,
                    date: [item.startDate, item.endDate]
                  };
                  return data;
                });
              } else if (item.type === 2) {
                // 现金
                // 编辑信息赋值
                this.isShowCashCoupon = true;
                this.cashCouponData.vouchers = [];
                this.cashEditList.push(item);
                this.cashEditList = this.cashEditList.map(item => {
                  let data = {
                    id: item.id,
                    type: item.type,
                    value: item.value,
                    prizeNum: item.prizeNum, // 已发放数量
                    num: item.num, // 发放数量
                    assocNum: item.assocNum, // 中奖次数/人
                    chance: item.chance, // 概率
                    //
                    isShowCouponAddBtn: false
                  };
                  return data;
                });
              }
              this.fullCouponData.vouchers = [...this.fullEditList];
              this.discountCouponData.vouchers = [...this.discountEditList];
              this.freeCouponData.vouchers = [...this.freeEditList];
              this.cashCouponData.vouchers = [...this.cashEditList];
            });
          }
          this.couponInfoData.limitNum = resp.limitNum;
          this.couponInfoData.limitSum = resp.limitSum;
        });
    },
    // 添加活动提交
    handleAdd() {
      let actInfo = this.$refs.couponHeader.validateForm(); // 活动基本信息验证是否通过
      let voucherTypeValid = this.voucherValid(); // 券类型验证是否通过
      let couponTypeorShopValid = this.couponTypeorShopVaild(); // 适用类型或者适用店铺是否验证通过
      let beInviteVaild = this.activityType === 5 ? this.couponTypeorShopVaild() : true; // 受邀人校验
      var flag = true;
      var total_chance = 0;
      if (actInfo && voucherTypeValid && couponTypeorShopValid && beInviteVaild) {
        this.couponHeaderData = this.$refs.couponHeader.couponHeaderData;
        // 验证店铺
        if (this.couponHeaderData.joinType === 1) {
          // 指定店铺
          if (this.selectAfterData && this.selectAfterData.length > 0) {
            this.selectAfterData = Array.from(new Set(this.selectAfterData));
            this.couponHeaderData.shopIds = [];
            this.selectAfterData.map(item => {
              this.couponHeaderData.shopIds.push(item.id);
            });
          } else {
            this.couponHeaderData.shopIds = [];
          }
        }
        // 验证指定店铺不能为空
        if (this.couponHeaderData.joinType === 1) {
          if (!this.couponHeaderData.shopIds || !this.couponHeaderData.shopIds.length) {
            this.$message.error('请手动配置店铺或选择批量上传店铺');
            flag = false;
          }
        }
        if (this.couponTypeData.prizeType && this.couponTypeData.prizeType.length > 0) {
          // 根据券类型获取数据
          this.couponTypeData.prizeType.map(item => {
            if (item == 1) {
              // 满减券
              let total_num = 0;
              var fullData = this.$refs.fullCoupon.fullCouponData || null; // 满减券数据
              fullData.usePosition = this.couponInfoData.usePosition.join(',');
              fullData.useScope = this.couponInfoData.useScope;
              // 组装数据
              fullData.vouchers = fullData.vouchers.map(item => {
                total_chance += parseFloat(item.chance);
                total_num += parseFloat(item.num);
                let data = {
                  id: item.id,
                  type: item.type,
                  outId: item.outId,
                  dateType: item.dateType,
                  startDays: item.startDays,
                  day: item.day,
                  startDate: item.date ? item.date[0] : null,
                  endDate: item.date ? item.date[1] : null,
                  startTime: item.time ? item.time[0] : null,
                  endTime: item.time ? item.time[1] : null,
                  prizeNum: item.prizeNum, // 已发放数量
                  num: item.num, // 发放数量
                  assocNum: item.assocNum, // 中奖次数/人
                  chance: item.chance, // 概率
                  //
                  time: item.time,
                  isShowCouponAddBtn: false,
                  date: item.date
                };
                return data;
              });
              this.isShowBtn(fullData.vouchers);
              if (this.$refs.fullCoupon.validateFullForm()) {
                // 验证通过
                this.fullCouponList = [];
                this.fullCouponList.push(fullData);
              } else {
                flag = false;
              }
              // 验证发放次数的总和不能小于或者等于0
              if (this.couponHeaderData.type === 2) {
                let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
                if (total_num <= 0) {
                  this.$message.error('满减券' + addeditTest + '的总和必须大于0');
                  flag = false;
                }
              }
            } else if (item == 2) {
              // 现金
              let total_num = 0;
              var cashData = this.$refs.cashCoupon.cashCouponData || null; // 现金数据
              // 组装数据
              cashData.vouchers = cashData.vouchers.map(item => {
                total_chance += parseFloat(item.chance);
                total_num += parseFloat(item.num);
                let data = {
                  id: item.id,
                  type: item.type,
                  value: item.value,
                  prizeNum: item.prizeNum, // 已发放数量
                  num: item.num, // 发放数量
                  assocNum: item.assocNum, // 中奖次数/人
                  chance: item.chance, // 概率
                  //
                  isShowCouponAddBtn: false
                };
                return data;
              });
              this.isShowBtn(cashData.vouchers);
              if (this.$refs.cashCoupon.validateFullForm()) {
                // 验证通过
                this.cashCouponList = [];
                this.cashCouponList = [...cashData.vouchers];
              } else {
                flag = false;
              }
              // 验证发放次数的总和不能小于或者等于0
              if (this.couponHeaderData.type === 2) {
                let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
                if (total_num <= 0) {
                  this.$message.error('现金' + addeditTest + '的总和必须大于0');
                  flag = false;
                }
              }
            } else if (item == 5) {
              // 折扣券
              let total_num = 0;
              var discountData = this.$refs.discountCoupon.discountCouponData || null; // 折扣券数据
              discountData.usePosition = this.couponInfoData.usePosition.join(',');
              discountData.useScope = this.couponInfoData.useScope;
              // 组装数据
              discountData.vouchers = discountData.vouchers.map(item => {
                total_chance += parseFloat(item.chance);
                total_num += parseFloat(item.num);
                let data = {
                  id: item.id,
                  type: item.type,
                  outId: item.outId,
                  dateType: item.dateType,
                  startDays: item.startDays,
                  day: item.day,
                  startDate: item.date ? item.date[0] : null,
                  endDate: item.date ? item.date[1] : null,
                  startTime: item.time ? item.time[0] : null,
                  endTime: item.time ? item.time[1] : null,
                  maxDerate: item.maxDerate,
                  prizeNum: item.prizeNum, // 已发放数量
                  num: item.num, // 发放数量
                  assocNum: item.assocNum, // 中奖次数/人
                  chance: item.chance, // 概率
                  //
                  time: item.time,
                  isShowCouponAddBtn: false,
                  date: item.date
                };
                return data;
              });
              this.isShowBtn(discountData.vouchers);
              if (this.$refs.discountCoupon.validateFullForm()) {
                // 验证通过
                this.discountCouponList = [];
                this.discountCouponList.push(discountData);
              } else {
                flag = false;
              }
              // 验证发放次数的总和不能小于或者等于0
              if (this.couponHeaderData.type === 2) {
                let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
                if (total_num <= 0) {
                  this.$message.error('折扣券' + addeditTest + '的总和必须大于0');
                  flag = false;
                }
              }
            } else if (item == 6) {
              // 免费体验券
              let total_num = 0;
              var freeData = this.$refs.freeCoupon.freeCouponData || null; // 免费体验券数据
              freeData.usePosition = this.couponInfoData.usePosition.join(',');
              freeData.useScope = this.couponInfoData.useScope;
              // 组装数据
              freeData.vouchers = freeData.vouchers.map(item => {
                total_chance += parseFloat(item.chance);
                total_num += parseFloat(item.num);
                let data = {
                  id: item.id,
                  type: item.type,
                  outId: this.lastOutID,
                  dateType: item.dateType,
                  startDays: item.startDays,
                  day: item.day,
                  startDate: item.date ? item.date[0] : null,
                  endDate: item.date ? item.date[1] : null,
                  startTime: item.time ? item.time[0] : null,
                  endTime: item.time ? item.time[1] : null,
                  prizeNum: item.prizeNum, // 已发放数量
                  num: item.num, // 发放数量
                  assocNum: item.assocNum, // 中奖次数/人
                  chance: item.chance, // 概率
                  //
                  time: item.time,
                  isShowCouponAddBtn: false,
                  date: item.date
                };
                return data;
              });
              this.isShowBtn(freeData.vouchers);
              if (this.$refs.freeCoupon.validateFullForm()) {
                // 验证通过
                this.freeCouponList = [];
                this.freeCouponList.push(freeData);
              } else {
                flag = false;
              }
              // 验证发放次数的总和不能小于或者等于0
              if (this.couponHeaderData.type === 2) {
                let addeditTest = this.isEditorAdd ? '发放数量' : '剩余数量';
                if (total_num <= 0) {
                  this.$message.error('免费体验券' + addeditTest + '的总和必须大于0');
                  flag = false;
                }
              }
            }
          });
          // 验证中奖概率
          if (total_chance > 100) {
            this.$message.error('所有奖项中奖概率相加不能超过100%');
            flag = false;
          }
        }
      } else {
        flag = false;
      }
      if (!flag) {
        return;
      }
      this.couponHeaderData.prizeList = [];

      this.couponHeaderData.prizeList = [...this.fullCouponList, ...this.discountCouponList, ...this.freeCouponList, ...this.cashCouponList];
      this.couponHeaderData.prizeType = this.couponTypeData.prizeType.join(',');
      this.couponHeaderData.prizeList = this.couponHeaderData.prizeList.map(item => {
        return JSON.stringify(item);
      });

      let data = DataUtils.clone(this.couponHeaderData);
      data.type = this.activityType;
      if (this.activityType === 5) {
        //邀友活动
        let res = this.$refs.beInviteFormData.formatBeInvitedData() || {};
        data.inviteePrizeType = res.inviteePrizeType.join(',');
        data.inviteeJoinType = res.inviteeJoinType;
        data.inviteePrizeList = res.inviteePrizeList.map(item => {
          return JSON.stringify(item);
        });
      }
      if (this.activityType === 4) {
        //限制条件
        data.limitSum = this.couponInfoData.limitSum;
        data.limitNum = this.couponInfoData.limitNum;
      }
      data.shopCondition = JSON.stringify(this.shopCondition); //手动配置店铺筛选条件
      let apiUrl = data.id ? Api.MEMBER_EVENT_EDIT : Api.MEMBER_EVENT_ADD;
      this.$axios.post(apiUrl, data).then(_ => {
        this.isShowAddEventDialog = false;
        this.getEventList();
        // 新增成功后 清空店铺数据
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.$refs['couponTypeData'].resetFields();
        this.$refs['couponInfoData'].resetFields();
        this.$refs.couponHeader.clearValidate();
      });
    },
    // 活动参与对象
    setConditionType(data) {
      this.conditionType = data;
    },
    // 获取活动开始时间
    setStartTime(value) {
      this.startTime = value;
    },
    // 获取活动结束时间
    setEndTime(value) {
      this.endTime = value;
    },
    // 新增窗口关闭 清空所有验证
    handleCancel() {
      this.isShowAddEventDialog = false;
      this.$refs.couponHeader.clearValidate();
      this.$refs['couponTypeData'].resetFields();
      this.$refs['couponInfoData'].resetFields();
      this.isShowFreeCoupon = false;
      this.isShowFullcoupon = false;
      this.isShowDisCountDialog = false;
      this.isShowCashCoupon = false;
      this.isconfirm = false;
    },

    // 券类型是否验证通过
    voucherValid() {
      let flag = false;
      this.$refs['couponTypeData'].validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 适用类型和适用店铺是否验证通过
    couponTypeorShopVaild() {
      let flag = false;
      this.$refs['couponInfoData'].validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 受邀人校验
    beInviteVaild() {
      let flag = false;
      this.$refs['beInviteFormData'].validate(valid => {
        flag = valid;
      });
      return flag;
    },
    // 打开参与用户列表
    openMemberJoinDialog(id, number, type) {
      if (this.getPerm('dal:member:event:assoc:list') && number > 0) {
        type !== 5 ? (this.isShowJoinUserDialog = true) : (this.inviteUserListVisible = true);
        this.actId = id;
      }
    },
    // 打开中奖用户列表
    openMemberPrizeDialog(id, number, type) {
      if (this.getPerm('dal:member:event:assoc:list') && number > 0) {
        type !== 5 ? (this.isShowWinUserDialog = true) : (this.inviteUserListVisible = true);
        this.actId = id;
      }
    },
    // 获取优惠券金额
    getVoucherSelect() {
      this.$axios.post(Api.VOUCHER_SELECT, { type: 2 }).then(resp => {
        if (resp && resp.length > 0) {
          this.lastOutID = resp[resp.length - 1].id || null;
        }
      });
    },
    formatterType(row, column) {
      return ActType[row.type];
    },
    formatterStatus(row, column) {
      return ActStatus[row.status];
    },
    setActivityType(data) {
      this.isScanTypeToDisabledUseScope = data.isScanType;
      this.couponInfoData.useScope = 0;
      this.activityType = data.activityType;
      this.couponTypeData.prizeType = [];
      this.fullCouponData = {
        // 清空数据
        type: 1,
        usePosition: null,
        useScope: 0,
        vouchers: []
      };
      this.isShowFullcoupon = false;
      this.cashCouponData = {
        vouchers: []
      };
      this.isShowCashCoupon = false;
      this.discountCouponData = {
        type: 5,
        usePosition: null,
        useScope: 0,
        vouchers: []
      };
      this.isShowDisCountDialog = false;
      this.freeCouponData = {
        type: 6,
        usePosition: null,
        useScope: 0,
        vouchers: []
      };
      this.isShowFreeCoupon = false;
    },
    // 选择券类型
    handleVoucherType(value, flag) {
      if (flag && value === 1) {
        // 满减券
        this.fullCouponData = {
          // 清空数据
          type: 1,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 1,
          outId: null, // 金额
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.fullCouponData.vouchers.push(coupon);
        this.isShowBtn(this.fullCouponData.vouchers);
        this.isShowFullcoupon = true;
      } else if (!flag && value === 1) {
        this.fullCouponData = {
          // 清空数据
          type: 1,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowFullcoupon = false;
      } else if (flag && value === 2) {
        // 现金
        this.cashCouponData = {
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 2,
          price: null, // 金额
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.cashCouponData.vouchers.push(coupon);
        this.isShowBtn(this.cashCouponData.vouchers);
        this.isShowCashCoupon = true;
      } else if (!flag && value === 2) {
        this.cashCouponData = {
          vouchers: []
        };
        this.isShowCashCoupon = false;
      } else if (flag && value === 5) {
        // 折扣券
        this.discountCouponData = {
          type: 5,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 5,
          outId: null, // 金额
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          maxDerate: null, // 减免上限
          //
          isShowCouponAddBtn: false
        };
        this.discountCouponData.vouchers.push(coupon);
        this.isShowBtn(this.discountCouponData.vouchers);
        this.isShowDisCountDialog = true;
      } else if (!flag && value === 5) {
        this.discountCouponData = {
          type: 5,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowDisCountDialog = false;
      } else if (flag && value === 6) {
        // 免费体验券
        this.getVoucherSelect();
        this.freeCouponData = {
          type: 6,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        let coupon = {
          id: null,
          type: 6,
          dateType: 0, // 时间类型
          startDays: 0, // 生效日
          day: null, // 有效期
          date: null, // 有效期
          time: ['00:00', '23:59'],
          num: null, // 发放数量
          assocNum: null, // 中奖次数/人
          chance: null, // 概率
          //
          isShowCouponAddBtn: false
        };
        this.freeCouponData.vouchers.push(coupon);
        this.isShowBtn(this.freeCouponData.vouchers);
        this.isShowFreeCoupon = true;
      } else if (!flag && value === 6) {
        this.freeCouponData = {
          type: 6,
          usePosition: null,
          useScope: 0,
          vouchers: []
        };
        this.isShowFreeCoupon = false;
      }
    },
    // 判断'+ - '按钮显示
    isShowBtn(list) {
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          list[i].isShowCouponAddBtn = true;
        } else {
          list[i].isShowCouponAddBtn = false;
        }
      }
    },
    // 批量上传店铺
    tirggerFile(event) {
      this.couponHeaderData.file = event.target.files[0];
      let formData = new FormData();
      formData.append('file', this.couponHeaderData.file);
      this.$axios.post(Api.SHOP_CHECKLIST, formData).then(resp => {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.isShowBulkUploadDialog = false;
        resp.map(item => {
          let data = {
            id: item.shopId,
            name: item.shopName,
            operatorId: item.operatorId,
            operatorName: item.operatorName
          };
          this.selectShopData.unshift(data);
          let obj = {};
          // 数组去重
          this.selectShopData = this.selectShopData.reduce((cur, next) => {
            obj[next.id] ? '' : (obj[next.id] = true && cur.push(next));
            return cur;
          }, []);
          this.shopIds.push(item.id);
        });
        this.selectAfterData = [...this.selectShopData];
      });
      // 解决input change事件无法上传相同文件问题
      this.$refs.referenceUpload.value = null;
      this.couponHeaderData.file = null;
    },
    // 手动配置店铺信息
    setManualShop() {
      if (this.shopIds == []) {
        this.selectShopData = [];
      }
      this.selectShopData = [];
      this.selectAfterData.map(item => {
        this.selectShopData.push(item);
      });
      this.searchQuery = null;

      this.getShopList();
    },
    handleSetShop(value) {
      // if(value === 1){
      // 	this.isconfirm = false
      // }
    },
    // 批量上传店铺信息
    setBatchShop() {
      this.isShowBulkUploadDialog = true;
    },
    // 选择左边的店铺
    handleSelectShop(row) {
      if (!this.isDisable) {
        let obj = {};
        this.selectShopData.unshift(row);
        // 数组去重
        this.selectShopData = this.selectShopData.reduce((cur, next) => {
          obj[next.id] ? '' : (obj[next.id] = true && cur.push(next));
          return cur;
        }, []);
      }
    },
    // 移除已选店铺
    handleRemoveShop(index) {
      this.selectShopData.splice(index, 1);
    },
    // 手动配置店铺-》批量添加店铺
    onBatchShop(data) {
      this.shopCondition = data.shopCondition;
      let list = [...this.selectShopData, ...data.shopList];
      let obj = {};
      // 数组去重
      this.selectShopData = list.reduce((cur, next) => {
        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);

      this.isSetBatchAddShopModel = data.isSetBatchAddShopModel;
    },
    // 确认已选店铺
    handleDialogsubmit() {
      this.selectAfterData = [];
      this.selectAfterData = [...this.selectShopData];
      // 组装店铺id
      if (this.selectShopData != [] && this.selectShopData.length > 0) {
        this.selectShopData.map(item => {
          this.shopIds.push(item.id);
        });
      }
      this.isconfirm = true;
      this.isShowDialogShop = false;
    },
    // 获取店铺列表信息
    getShopList(keyword) {
      // 最多取100条
      this.$axios
        .post(Api.SHOP_GETFORKEYWORD, {
          keyword: keyword
        })
        .then(resp => {
          this.isShowDialogShop = true;
          this.tableData = resp;
        });
    },
    // 编辑时获取已选店铺列表
    getEditShopList(id) {
      this.$axios
        .post(Api.MEMBER_EVENT_SHOP, {
          eventId: id,
          page: 0,
          pageSize: 0
        })
        .then(resp => {
          let total = resp.total;
          this.$axios
            .post(Api.MEMBER_EVENT_SHOP, {
              eventId: id,
              page: 0,
              pageSize: total
            })
            .then(resp => {
              this.selectShopData = resp.items ? resp.items : [];
              this.selectAfterData = [...this.selectShopData];
              // 组装店铺id
              if (this.selectShopData != [] && this.selectShopData.length > 0) {
                this.selectShopData.map(item => {
                  this.shopIds.push(item.id);
                });
              }
              this.isconfirm = true;
            });
        });
    },
    // 活动暂停或启动
    handleToggleWxPay(event) {
      let w = event.status === 1 ? '暂停' : '启动';
      this.$confirm(`是否需要${w}活动?`, '提示', {
        type: 'warning'
      }).then(_ => {
        let event_status = null;
        if (event.status === 1) {
          event_status = 3;
        } else {
          event_status = 1;
        }
        this.$axios
          .post(Api.MEMBER_EVENT_PAUSE, {
            id: event.id,
            status: event_status
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: `活动已${w}！`,
              type: 'success'
            });
            this.getEventList();
          });
      });
    },
    // 删除活动信息
    hanleDelete(id) {
      this.$confirm('您确定要删除该活动？', '删除确认').then(_ => {
        this.$axios
          .post(Api.MEMBER_EVENT_DELETE, {
            id: id
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getEventList();
          });
      });
    },
    hanleCopyLink(id, name) {
      //复制链接
      if (id != '') {
        this.showActivtiyDetailId = id;
        this.activityLinkName = name;
        this.isShowCopyLinkDialog = true;
      }
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
          exportExcel(Api.MEMBER_EVENT_ExCEL, '活动列表总览.xlsx', query);
        }
      });
    }
  },
  watch: {
    searchQuery(newVal, oldVal) {
      this.getShopList(newVal);
    },
    conditionType(newVal, oldVal) {
      if (newVal == 1 || newVal == 3) {
        if (this.activityType === 2) {
          this.couponInfoData.useScope = 0;
          this.isShowShop = false;
        } else {
          this.isShowShop = true;
        }
      }else {
        this.isShowShop = true;
      }
    },
    activityType(newVal, oldVal) {
      if (newVal == 2) {
        if (this.conditionType == 1 || this.conditionType == 3) {
          this.couponInfoData.useScope = 0;
          this.isShowShop = false;
        }else {
          this.isShowShop = true;
        }
      }else {
        this.isShowShop = true;
      }
    },
  },
  computed: {
    // isShowShop() {
    //   if (this.conditionType === 1 || this.conditionType === 3) {
    //     if (this.activityType === 2) {
    //       // this.couponInfoData.useScope = 0;
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   } else {
    //     return true;
    //   }
    // },
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    QShopSelect,
    winUser,
    joinUser,
    addHeader,
    fullCoupon,
    discountCoupon,
    cashCoupon,
    freeCoupon,
    actDetail,
    fullDetail,
    discountDetail,
    freeDetail,
    cashDetail,
    selectedShop,
    setBatchAddShop,
    beinvite,
    inviteUserList,
    activeLinkQrCode
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
.shop-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .shop-left {
    flex: 1;
    width: 45%;
    border-right: 1px solid #dcdfe6;
    padding-right: 10px;
    position: relative;
    .el-table {
      height: 500px;
      overflow-y: auto;
    }
    .batch_add_shop {
      position: absolute;
      right: 19px;
      top: 1px;
      height: 38px;
      background: #fff;
      line-height: 38px;
      color: #409eff;
      cursor: pointer;
    }
  }
  .shop-right {
    width: 55%;
    flex: 1;
    padding-left: 10px;
  }
}
.add-activity-dialog {
  .el-dialog {
    width: 80% !important;
  }
}
.set-shop {
  margin-left: 30px;
}
.setshop-dialog {
  .el-dialog {
    width: 60% !important;
  }
}
.upload-dialog {
  .el-dialog {
    width: 380px !important;
  }
  .down-mb {
    display: block;
    text-align: center;
    color: #409eff;
    margin-top: 35px;
  }
}
.file-btn {
  position: relative;
  width: 300px;
  height: 60px;
  line-height: 60px;
  color: #fff;
  border-radius: 5px;
  background-color: #409eff;
  border-color: #409eff;
  text-align: center;
  margin: 35px auto 0;
  font-size: 28px;
  .change-file {
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    opacity: 0;
    width: 300px;
    height: 60px;
  }
}

.coupon_activity_detail {
  .el-dialog {
    width: 70% !important;
  }
}
.copylink_title {
  font-weight: 700;
}
.copylink_con {
  padding-left: 70px;
  .short_title {
    padding-top: 30px;
  }
  button {
    margin-top: 50px !important;
  }
}
.set_batch_page .el-dialog__body {
  padding: 20px;
}
.set_batch_page .el-dialog {
  top: 11%;
}
.set_batch_page .el-dialog__header {
  border-bottom: none;
  padding: 0;
}
.set_batch_page .el-dialog__headerbtn {
  top: 10px;
  right: 10px;
}
.coupon_activity_detail .set-shop {
  margin-left: 30px;
}
</style>