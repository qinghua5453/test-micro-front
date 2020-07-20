<template>
  <section v-if="getPerm('dal:operator:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['运营商管理', '运营商列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="运营商账号：" prop="userName">
            <el-input size="small" clearable v-model="searchData.userName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="phone">
            <el-input size="small" clearable v-model="searchData.phone" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input size="small" clearable v-model="searchData.realName" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-select size="small" v-model="searchData.property" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="主账号" value="1"></el-option>
              <el-option label="子账号" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实名认证：">
            <el-select size="small" v-model="searchData.status" style="width: 140px;" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="未认证" value="0"></el-option>
              <el-option label="审核中" value="1"></el-option>
              <el-option label="已认证" value="2"></el-option>
              <el-option label="未通过" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.isLock" placeholder="请选择" style="width: 140px;margin-left:12px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="可用" value="0"></el-option>
              <el-option label="锁定" value="1"></el-option>
              <el-option label="待审批" value="2"></el-option>
              <el-option label="驳回" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:operator:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--新增弹出框-->
          <el-button v-if="getPerm('dal:operator:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddOperatorDialog">新增运营商</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="运营商账号" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openOperatorDialog(scope.row.id)">{{scope.row.userName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realName" label="姓名" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="balance" label="账户余额" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="状态" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.isLock == 0">可用</span>
                <span v-if="scope.row.isLock == 1">锁定</span>
                <span v-if="scope.row.isLock == 2">待审批</span>
                <span v-if="scope.row.isLock == 3">驳回</span>
              </template>
            </el-table-column>
            <el-table-column label="账号类型" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.property == 1 ? '主账号' : '子账号'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="负责人" prop="refereeName" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="邀请码" width="120" prop="refereePhone" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{String(scope.row.refereePhone).length > 5 ? '' : scope.row.refereePhone}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属账号" width="120" prop="parentUserName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="子账号数量" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="opensubAcctDialog(scope.row.id)">{{scope.row.sonCount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shopCount" label="店铺数量" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openShopList(scope.row.userName,scope.row.shopCount)">{{scope.row.shopCount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" :formatter="formatterStatus" label="实名认证" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="isAllowService" label="允许平台代服务项" show-overflow-tooltip width="200">
              <template slot-scope="scope" v-if="scope.row.property === 1">
                <span>{{scope.row.isAllowService | isAllowService}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-tooltip v-if="getPerm('dal:operator:resetPassword')" content="重置密码" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openRepeatPwdDialog(scope.row.id)">
                    <use xlink:href="#icon-key"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:operator:update')" content="编辑" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" @click="openEditOperatorDialog(scope.row.id, scope.row.refereeName)">
                    <use xlink:href="#icon-document-edit"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:operator:examine')" content="审核" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.status == 1" @click="openReviewDialog(scope.$index,scope.row.id)">
                    <use xlink:href="#icon-clipboard"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:operator:approve')" content="注册审核" placement="top" effect="dark">
                  <svg class="icon" aria-hidden="true" v-if="scope.row.isLock == 2" @click="openRegDialog(scope.$index,scope.row.id)">
                    <use xlink:href="#icon-clipboard"></use>
                  </svg>
                </el-tooltip>
                <el-tooltip v-if="getPerm('dal:operator:delete')" content="删除" placement="top" effect="dark">
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
              <q-pager :total="total" />
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!--////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->
    <!--新增运营商 -->
    <el-dialog class="min-dialog" title="新增运营商" :visible.sync="isShowAddOperatorDialog" @close="isShowAddOperatorDialog = false">
      <el-form :model="addOperator" label-width="94px" :rules="addOperatorRules" ref="addOperator">
        <el-form-item label="手机号码：" prop="phone">
          <el-input clearable v-model="addOperator.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="realName">
          <el-input clearable v-model="addOperator.realName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleAdd('addOperator')">确认</el-button>
        <el-button type="primary" plain @click.native="isShowAddOperatorDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!--编辑运营商 -->
    <el-dialog class="min-dialog" title="编辑运营商" :visible.sync="isShowUpdateDialog" @close="isShowUpdateDialog = false">
      <el-form :model="editoperatorData" label-width="180px" :rules="editOperatorRules" ref="editoperatorData">
        <el-form-item label="姓名：" prop="realName">
          <el-input clearable v-model="editoperatorData.realName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="isShowRefere" label="负责人：" prop="refereeId">
          <el-select style="width:100%;" :disabled="isBdid" v-model="editoperatorData.refereeId" filterable remote :remote-method="getBdList" placeholder="请选择">
            <el-option v-for="item in selectItem" :key="item.code" :label="item.fullName" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许平台代服务项：" prop="isAllowService" v-if="editoperatorData.property === 1">
          <el-checkbox-group v-model="editoperatorData.isAllowService">
            <el-checkbox :label="4">复位及启动</el-checkbox>
            <el-checkbox :label="2">补偿</el-checkbox>
            <el-checkbox :label="1">退款</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click="handleEdit('addOperator')">确认</el-button>
        <el-button type="primary" plain @click.native="isShowUpdateDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!--审核资料-->
    <el-dialog class="min-dialog" title="审核认证资料" :visible.sync="isShowReviewDialog" @close="isShowReviewDialog = false;exmainImageUrl = null;Deg=0">
      <div v-if="!isTurn">
        <el-form label-width="96px" :model="resonForm" v-if="resonForm.licenseType == 1">
          <el-form-item label="姓名：">
            <span>{{resonForm.cardName}}</span>
          </el-form-item>
          <el-form-item label="身份证号码：">
            <span>{{resonForm.idCardNo}}</span>
          </el-form-item>
          <el-form-item label="证件照：">
            <img width="60" :src="resonForm.idCardFont" height="60" @click="exmain(resonForm.idCardFont)" />
            <img width="60" :src="resonForm.idCardReverse" height="60" @click="exmain(resonForm.idCardReverse)" />
            <img width="60" :src="resonForm.idCardImg" height="60" @click="exmain(resonForm.idCardImg)" />
          </el-form-item>
        </el-form>
        <el-form label-width="96px" :model="resonForm" v-if="resonForm.licenseType == 2">
          <el-form-item label="公司名称：">
            <span>{{resonForm.companyName}}</span>
          </el-form-item>
          <el-form-item label="公司执照：">
            <img width="60" :src="resonForm.companyLicense" height="60" @click="exmain(resonForm.companyLicense)" />
          </el-form-item>
        </el-form>
      </div>
      <div class="exam-model-pic" v-if="resonForm.licenseType == 1">
        <img @click="Rotate" :src="exmainImageUrl?exmainImageUrl:resonForm.idCardFont" :style="'transform: rotate('+0+Deg+'deg)'" />
      </div>
      <div class="exam-model-pic" v-if="resonForm.licenseType == 2">
        <img @click="Rotate" :src="exmainImageUrl?exmainImageUrl:resonForm.companyLicense" :style="'transform: rotate('+0+Deg+'deg)'" />
      </div>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goConfirm()">通过</el-button>
        <el-button type="primary" v-if="!isTurn" @click.native="handleRefuse">驳回</el-button>
      </div>
    </el-dialog>
    <el-dialog class="min-dialog" title="审核认证资料" :visible.sync="isRefuseDialog" @close="close()">
      <el-form label-width="96px" :model="resonForm" :rules="rules" ref="resonForm">
        <el-form-item label="审核意见：" prop="reason">
          <el-input type="textarea" v-model="resonForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goRefuse('resonForm')">确认</el-button>
      </div>
    </el-dialog>
    <!--注册审核-->
    <el-dialog class="min-dialog" title="注册审核" :visible.sync="isRegVisable" @close="isRegVisable = false">
      <el-form label-width="96px" :model="resonForm">
        <el-form-item label="账号：">
          <span>{{resonForm.userName}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{resonForm.realName}}</span>
        </el-form-item>
        <el-form-item label="所在区域">
          <span>{{resonForm.address}}</span>
        </el-form-item>
        <el-form-item label="推荐人姓名">
          <span>{{resonForm.refereeName}}</span>
        </el-form-item>
        <el-form-item label="推荐人手机号">
          <span>{{resonForm.refereePhone}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goRegConfirm()">通过</el-button>
        <el-button type="primary" @click.native="isRegRefuseVisable=true;isRegVisable = false">驳回</el-button>
      </div>
    </el-dialog>
    <el-dialog class="min-dialog" title="注册审核" :visible.sync="isRegRefuseVisable" @close="refuseReg">
      <el-form label-width="96px" :model="regExmainForm" :rules="regExmainRules" ref="regExmainForm">
        <el-form-item label="审核意见：" prop="reason">
          <el-input type="textarea" v-model="regExmainForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goRegRefuse('regExmainForm')">确认</el-button>
      </div>
    </el-dialog>
    <!--运营商信息-->
    <el-dialog class="diaolog-ope" title="运营商信息" :visible.sync="isShowOperatorDetailDialog" @close="isShowOperatorDetailDialog = false">
      <el-form :inline="true" :model="opeform" class="carrier-detail">
        <div class="border-b">
          <h2><i class="header-icon el-icon-goods"></i>基本信息</h2>
          <el-form-item label="运营商账号：">
            <span>{{opeform.userName ? opeform.userName : '---'}}</span>
          </el-form-item>
          <el-form-item label="店铺数量：">
            <span>{{opeform.shopCount ? opeform.shopCount : '---'}}</span>
          </el-form-item>
          <el-form-item label="联系方式：">
            <span>{{opeform.phone ? opeform.phone : '---'}}</span>
          </el-form-item>
          <el-form-item label="机器数量：">
            <span>{{opeform.machineCount ? opeform.machineCount : '---'}}</span>
          </el-form-item>
          <el-form-item label="姓名：">
            <span>{{opeform.realName ? opeform.realName : '---'}}</span>
          </el-form-item>
          <el-form-item label="账户余额：">
            <span>{{opeform.balance ? opeform.balance : '---'}}</span>
          </el-form-item>
          <el-form-item label="账号状态：">
            <span v-if="opeform.isLock == 0">可用</span>
            <span v-if="opeform.isLock == 1">锁定</span>
            <span v-if="opeform.isLock == 2">待审批</span>
            <span v-if="opeform.isLock == 3">驳回</span>
          </el-form-item>
          <el-form-item label="账号类型：">
            <span>{{opeform.property == 1 ? '主账号' : '子账号'}}</span>
          </el-form-item>
          <el-form-item label="子账号数量：">
            <span>{{opeform.sonCount ? opeform.sonCount : '---'}}</span>
          </el-form-item>
          <el-form-item label="所在区域：">
            <span>{{opeform.address ? opeform.address : '---'}}</span>
          </el-form-item>
          <el-form-item label="负责人：">
            <span>{{opeform.refereeName ? opeform.refereeName : '---'}}</span>
          </el-form-item>
          <el-form-item label="邀请码：">
            <span>{{opeform.refereePhone ? opeform.refereePhone : '---'}}</span>
          </el-form-item>
          <el-form-item label="创建时间：">
            <span>{{opeform.createTime ? opeform.createTime : '---'}}</span>
          </el-form-item>
          <el-form-item label="审核意见：">
            <span>{{opeform.registerReason ? opeform.registerReason : '---'}}</span>
          </el-form-item>
          <el-form-item label="允许平台代服务项：" v-if="opeform.property === 1">
            <span>{{opeform.isAllowService | isAllowService}}</span>
          </el-form-item>
        </div>
        <div class="border-b">
          <h2><i class="header-icon el-icon-goods"></i>实名认证信息<span v-if="opeform.licenseType == 2">(企业认证)</span></h2>
          <el-form v-if="opeform.licenseType == 1">
            <el-form-item label="认证状态：">
              <span v-if="opeform.status == 0">未认证</span>
              <span v-else-if="opeform.status == 1">审核中</span>
              <span v-else-if="opeform.status == 2">已认证</span>
              <span v-else-if="opeform.status == 3">未通过</span>
            </el-form-item>
            <el-form-item label="姓名：">
              <span>{{opeform.cardName}}</span>
            </el-form-item>
            <el-form-item label="身份证号：">
              <span>{{opeform.idCardNo}}</span>
            </el-form-item>
            <el-form-item label="证件照：" class="operator-img">
              <template v-if="opeform.status != 0">
                <img :src="opeform.idCardFont" @click="showImg(opeform.idCardFont)">
                <img :src="opeform.idCardReverse" @click="showImg(opeform.idCardReverse)">
                <img :src="opeform.idCardImg" @click="showImg(opeform.idCardImg)">
              </template>
            </el-form-item>
            <el-form-item label="审核意见：">
              <span>{{opeform.reason ? opeform.reason : '---'}}</span>
            </el-form-item>
          </el-form>
          <el-form v-if="opeform.licenseType == 2">
            <el-row>
              <el-col :span="24">
                <el-form-item label="认证状态：">
                  <span v-if="opeform.status == 0">未认证</span>
                  <span v-else-if="opeform.status == 1">审核中</span>
                  <span v-else-if="opeform.status == 2">已认证</span>
                  <span v-else-if="opeform.status == 3">未通过</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="公司名称：">
              <span>{{opeform.companyName}}</span>
            </el-form-item>
            <el-form-item label="公司执照：">
              <img width="60" :src="opeform.companyLicense" height="60" @click="showImg(opeform.companyLicense)" />
            </el-form-item>
            <el-form-item label="审核意见：">
              <span>{{opeform.companyReason ? opeform.companyReason : '---'}}</span>
            </el-form-item>
          </el-form>
        </div>
      </el-form>
    </el-dialog>
    <!--店铺列表-->
    <el-dialog class="max-dialog" title="店铺列表" :visible.sync="isShowShopDialog" @close="isShowShopDialog = false">
      <el-table :data="shopData" border center="true" height="648" class="my-table">
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="店铺名称" show-overflow-tooltip prop="name">
        </el-table-column>
        <el-table-column prop="address" label="店铺地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopTypeName" label="店铺类型" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopState" :formatter="formatterState" label="店铺状态" width="80">
        </el-table-column>
        <el-table-column prop="operatorName" label="运营商" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
        </el-table-column>
        <el-table-column label="机器数量" show-overflow-tooltip width="80" prop="machineCount">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--子账号列表-->
    <el-dialog class="max-dialog" title="子账号列表" :visible.sync="isShowSubAcctDialog" @close="isShowSubAcctDialog = false">
      <el-table :data="subData" border tooltip-effect="dark" center="true" class="sub-tr my-table">
        <el-table-column prop="userName" label="运营商账号" width="120">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120">
        </el-table-column>
        <el-table-column prop="shopCount" label="店铺数量" width="80">
        </el-table-column>
        <el-table-column prop="machineCount" label="机器数量" width="80">
        </el-table-column>
        <el-table-column prop="balance" label="账户余额" width="80">
          <template slot-scope="scope">
            {{ scope.row.balance}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.isLock == 0 ? '可用' : '锁定'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="status" :formatter="formatterStatus" label="实名认证">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog class="big-img" :visible.sync="dialogVisible">
      <img style="width:100%" :src="dialogImageUrl" alt="">
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
import { ShopType, ConfirmStatus } from '@/utils/Mapping';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    return {
      loading: false,
      value9: null,
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      selectItem: [], // 获取BD列表信息
      isBdid: false, // 负责人是否可编辑
      isShowRefere: false, // 是否隐藏负责人
      refereeId: null, // 负责人id
      refereePhone: null, // 负责人邀请码

      //头部搜索
      searchData: {
        userName: null,
        phone: null,
        parentId: null,
        realName: null,
        status: null,
        isLock: null,
        startTime: null,
        endTime: null,
        property: null,

        //
        time: null
      },

      // 新增运营商
      addOperator: {
        phone: '',
        realName: ''
      },
      addOperatorRules: {
        //新增运营商验证
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号码格式',
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ]

        // bdId: [{
        // 	required: true,
        // 	message: '请填写负责人',
        // 	trigger: 'blur'
        // }]
      },
      isShowAddOperatorDialog: false, // 新增运营商,

      // 编辑运营商信息
      isShowUpdateDialog: false, // 编辑运营商
      editoperatorData: {
        id: null,
        realName: null,
        refereeId: null,
        isAllowService: [],
        property: null
      },
      // 编辑信息验证
      editOperatorRules: {
        realName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ]
      },

      // 审核
      resonForm: {
        //审核资料
        id: '',
        userName: '',
        realName: '',
        shopCount: '',
        machineCount: '',
        sonCount: '',
        phone: '',
        isLock: '',
        property: '',
        status: '',
        cardName: '',
        idCardNo: '',
        idCardFont: '',
        idCardReverse: '',
        idCardImg: '',
        createTime: '',
        operateShopIds: '',
        reason: ''
      },
      rules: {
        reason: [
          {
            required: true,
            message: '请输入审核意见',
            trigger: 'blur'
          }
        ]
      },
      id: '', // 运营商id
      isShowReviewDialog: false,
      isRefuseDialog: false,
      isTurn: false,

      //运营商详情
      opeform: {},
      isShowOperatorDetailDialog: false, //运营商详情

      //子账号列表
      subData: [], // 子账号列表信息
      isShowSubAcctDialog: false, //子账号列表
      isShowShopDialog: false, // 店铺数量
      shopData: [], // 店铺数据

      ispwdVisible: false, // 重置密码
      // 显示原图
      dialogImageUrl: null,
      dialogVisible: false,
      exmainImageUrl: null,
      Deg: 0,

      //注册审核
      isRegVisable: false,
      isRegRefuseVisable: false,
      regExmainForm: {
        reason: ''
      },
      regExmainRules: {
        //新增运营商验证
        reason: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }]
      }
    };
  },
  filters: {
    isAllowService(val) {
      if (val) {
        val = Array.from(val);
        let tmp = [];
        if (Object.prototype.toString.call(val).slice(8, -1) === 'Array') {
          val.forEach(item => {
            if (item === 1) {
              tmp.push('退款');
            }
            if (item === 2) {
              tmp.push('补偿');
            }
            if (item === 4) {
              tmp.push('复位及启动');
            }
          });
          return tmp.join(',');
        }
      } else {
        return val;
      }
    }
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:operator:list')) {
      this.getOperatorList();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
  },
  methods: {
    //序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    //获取运营商列表
    getOperatorList() {
      this.apiUrl = Api.OPERATOR_LIST;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },

    async getBdList(keywords) {
      if (keywords === '') {
        let resp = await this.$axios.post(Api.SYS_USER_SELECT);
      } else {
        this.loading = true;
        let resp = await this.$axios.post(Api.SYS_USER_SELECT, { fullName: keywords });
        this.selectItem = resp || [];
        this.loading = false;
      }
    },
    //根据条件查询运营商列表信息
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
    //店铺状态
    formatterState(row, column) {
      return ShopType[row.status];
    },

    //获取运营商详情
    getOperatorDetails(id) {
      return this.$axios.post(Api.OPERATOR_DETAILS, { id: id }).then(resp => {
        this.opeform = resp;
        this.resonForm = resp;
        this.addOperator.phone = resp.phone;
        this.addOperator.realName = resp.realName;

        this.editoperatorData.id = resp.id;
        this.editoperatorData.realName = resp.realName;
        this.editoperatorData.refereeId = resp.refereeId;
        this.editoperatorData.isAllowService = resp.isAllowService ? resp.isAllowService : [];
        this.editoperatorData.property = resp.property;
        this.refereeId = resp.refereeId;
        this.refereePhone = resp.refereePhone;

        // 判断负责人姓名展示
        if (resp.refereeId) {
          this.editoperatorData.refereeId = resp.refereeId;
        } else if (!resp.refereeId && resp.refereePhone) {
          this.editoperatorData.refereeId = resp.refereeName;
        }

        // 判断负责人是否可编辑
        if (resp.refereeId || resp.refereePhone) {
          this.isBdid = true;
        } else {
          this.isBdid = false;
        }
        // 判断负责人是否显示
        if (resp.property === 2) {
          // 1 运营商负责人 2 运营商管理员
          this.isShowRefere = false;
        } else {
          this.isShowRefere = true;
        }
      });
    },

    // 打开编辑弹窗
    openEditOperatorDialog(id, refereeName) {
      if (this.getPerm('dal:operator:update')) {
        this.getBdList();
        this.getOperatorDetails(id).then(_ => {
          if (this.$refs.addOperator) this.$refs.addOperator.resetFields();
          this.isShowUpdateDialog = true;
        });
      }
    },

    // 打开新增弹窗
    openAddOperatorDialog() {
      if (this.getPerm('dal:operator:add')) {
        this.addOperator = {
          phone: null,
          realName: null
        };
        if (this.$refs.addOperator) this.$refs.addOperator.resetFields();
        this.isShowAddOperatorDialog = true;
      }
    },

    // 进入店铺列表
    openShopList(operatorName, shopCount) {
      if (this.getPerm('dal:shop:list')) {
        if (shopCount > 0) {
          // 最多取2000条
          this.$axios
            .post(Api.SHOP_LIST, {
              operatorName: operatorName,
              page: 1,
              pageSize: 2000
            })
            .then(resp => {
              this.isShowShopDialog = true;
              this.shopData = resp.items;
            });
        }
      }
    },

    //新增运营商
    handleAdd() {
      this.$refs.addOperator.validate(valid => {
        if (valid) {
          let data = DataUtils.clone(this.addOperator);
          this.$axios.post(Api.ADD_OPERATOR, data).then(_ => {
            this.$message({
              showClose: true,
              message: '新增运营商成功！',
              type: 'success'
            });
            this.getOperatorList();
            this.isShowAddOperatorDialog = false;
            this.addOperator = {
              phone: null,
              realName: null
            };
          });
        }
      });
    },
    // 编辑运营商
    handleEdit() {
      this.$refs.editoperatorData.validate(valid => {
        if (valid) {
          if (this.editoperatorData.property === 2) {
            this.editoperatorData.isAllowService = [];
          } else {
            this.editoperatorData.isAllowService.length <= 0 ? (this.editoperatorData.isAllowService = [0]) : this.editoperatorData.isAllowService;
          }
          let data = DataUtils.clone(this.editoperatorData);
          if (this.refereeId) {
            data.refereeId = data.refereeId;
          } else if (!this.refereeId && this.refereePhone) {
            data.refereeId = null;
          }
          this.$axios.post(Api.UPDATE_OPERATOR, data).then(_ => {
            this.$message({
              showClose: true,
              message: '编辑运营商成功！',
              type: 'success'
            });
            this.getOperatorList();
            this.isShowUpdateDialog = false;
          });
        }
      });
    },
    //重置密码
    openRepeatPwdDialog(id) {
      this.$confirm('您确定要重置密码吗？').then(_ => {
        this.$axios
          .post(Api.RESET_PWD, {
            id: id
          })
          .then(_ => {
            this.$message({
              showClose: true,
              message: '恭喜你，重置密码成功！',
              type: 'success'
            });
            this.getOperatorList();
          });
      });
    },

    //审核
    openReviewDialog(index, id) {
      if (id != '') {
        this.getOperatorDetails(id).then(_ => (this.isShowReviewDialog = true));
      }
    },
    //审核认证信息
    opeartorExamine(status) {
      let params = {
        id: this.resonForm.id || '',
        status: status || '',
        reason: this.resonForm.reason || '',
        licenseType: this.resonForm.licenseType || ''
      };
      this.$axios.post(Api.OPERATOR_EXAMINE, params).then(resp => {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.isShowReviewDialog = false;
        this.isRefuseDialog = false;
        this.getOperatorList();
      });
    },
    //通过
    goConfirm() {
      this.opeartorExamine(2);
    },
    //驳回
    goRefuse() {
      this.$refs.resonForm.validate(valid => {
        if (valid) {
          this.opeartorExamine(3);
        } else {
          return false;
        }
      });
    },

    //注册审核
    openRegDialog(index, id) {
      if (id != '') {
        this.getOperatorDetails(id).then(_ => (this.isRegVisable = true));
      }
    },
    //注册审核信息
    opeartorRegExamine(type) {
      let params = {
        operatorId: this.resonForm.id || '',
        type: type,
        reason: this.regExmainForm.reason || ''
      };
      if (type === 1) {
        params = {
          operatorId: this.resonForm.id || '',
          type: type
        };
      }
      this.$axios.post(Api.OPERATOR_APPROVE, params).then(resp => {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        });
        this.isRegVisable = false;
        this.$refs.regExmainForm.resetFields();
        this.isRegRefuseVisable = false;
        this.getOperatorList();
      });
    },
    //注册审核通过
    goRegConfirm() {
      this.opeartorRegExamine(1);
    },
    //注册审核驳回
    goRegRefuse() {
      this.$refs.regExmainForm.validate(valid => {
        if (valid) {
          this.opeartorRegExamine(0);
        } else {
          return false;
        }
      });
    },
    refuseReg() {
      this.isRegRefuseVisable = false;
      this.$refs.regExmainForm.resetFields();
    },

    //查看运营商详情
    openOperatorDialog(id) {
      if (this.getPerm('dal:operator:details')) {
        if (id != '') {
          this.getOperatorDetails(id).then(_ => (this.isShowOperatorDetailDialog = true));
        }
      }
    },
    //子账号列表
    opensubAcctDialog(id) {
      if (this.getPerm('dal:operator:list')) {
        return this.$axios
          .post(Api.OPERATOR_LIST, {
            parentId: id
          })
          .then(resp => {
            this.subData = resp.items;
            this.isShowSubAcctDialog = true;
          });
      }
    },
    //实名认证状态
    formatterStatus(row, column) {
      return ConfirmStatus[row.status];
    },
    // 查看原图
    showImg(imgUrl) {
      if (imgUrl != null) {
        this.dialogImageUrl = imgUrl;
        this.dialogVisible = true;
      }
    },
    exmain(url) {
      if (url != null) {
        //
        this.exmainImageUrl = url;
      }
    },
    // 图片旋转
    Rotate() {
      this.Deg = (this.Deg + 90) % 360;
    },
    // 驳回
    handleRefuse() {
      this.isRefuseDialog = true;
      this.isShowReviewDialog = false;
    },
    // 关闭驳回弹出框
    close() {
      this.isRefuseDialog = false;
      this.isShowReviewDialog = false;
    },

    // 删除
    handleDelete(id) {
      this.$confirm('您确定要删除？', '警告').then(_ => {
        this.$axios
          .post(Api.OPERATOR_DELETE, {
            operatorId: id
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getOperatorList();
          });
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
          exportExcel(Api.EXPORT_OPERATOR, '运营商总览.xlsx', query);
        }
      });
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
          .el-dialog__body {
            img {
              width: 100% !important;
            }
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
.exam-model-pic {
  text-align: center;

  width: 80%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>