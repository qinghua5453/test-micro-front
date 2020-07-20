<template>
  <section v-if="getPerm('dal:order:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['订单管理', '订单列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline" ref="searchData">
          <el-form-item label="订单编号：">
            <el-input size="small" clearable v-model="searchData.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="用户账号：">
            <el-input size="small" clearable v-model="searchData.phone"></el-input>
          </el-form-item>
          <el-form-item label="运营商账号：">
            <el-input size="small" clearable v-model="searchData.operatorName"></el-input>
          </el-form-item>
          <el-form-item label="店铺名称：">
            <el-input size="small" clearable v-model="searchData.shopName"></el-input>
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="searchData.shopType" size="small" placeholder="全部">
              <el-option label="不限" :value="null" />
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in shopTypeList" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input size="small" clearable v-model="searchData.machineName"></el-input>
          </el-form-item>
          <el-form-item label="设备类型：" prop="firstTypeId">
            <el-cascader
              placeholder="试试搜索：洗衣机"
              :options="machineTypeData"
              :props="{ value: 'id', label: 'machineTypeName', children: 'nodes' }"
              v-model="searchData.machineTypeId"
              filterable
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="searchData.orderStatus" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in OrderStatusEnum" :label="item.msg" :value="item.code" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性：">
            <el-select size="small" v-model="searchData.isHidden" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="0"></el-option>
              <el-option label="删除" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式：">
            <el-select size="small" v-model="searchData.payType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in payTypeList" :key="index" :label="item.payTypeName" :value="item.payType"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域：">
            <q-area v-model="searchData.areaIds" size="small" default-option="不限" />
          </el-form-item>
          <el-form-item label="建单时间：">
            <el-date-picker size="small" v-model="searchData.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期时间"> </el-date-picker>
            <el-date-picker size="small" v-model="searchData.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期时间"> </el-date-picker>
            <!-- <el-date-picker size="small" :default-time="['00:00:00', '23：59：59']" v-model="searchData.time" type="datetimerange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker> -->
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch()">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:order:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--表格-->
          <el-table :data="list" border tooltip-effect="dark" center="true" class="my-table" height="648">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip> </el-table-column>
            <el-table-column fixed prop="orderNo" label="订单编号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openOrderDetailDialog(scope.row.orderNo, scope.row.userId)">{{ scope.row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="用户账号" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column label="区域" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.province + scope.row.city + scope.row.district }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="shopTypeName" label="店铺类型" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="machineName" label="设备名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="machineFirstTypeName" label="设备类型" width="150">
              <template slot-scope="scope">
                <p>{{ scope.row.machineFirstTypeName }}</p>
                <p>{{ scope.row.machineSecondTypeName }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="machineType" label="通信类型" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.machineType == 1 ? '串口' : '脉冲' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="machineFunctionName" label="功能名称" width="140" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="markMinutes" label="耗时（分钟）" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operatorName" label="运营商" width="140" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="payPrice" label="订单金额" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="markPrice" label="原价" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="discountPrice" label="优惠价" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="payPrice" label="实付价" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="dispenserName" label="洗衣液&除菌液" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.dispenserName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dispenserPrice" label="洗衣液&除菌液价格（元）" width="170" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.dispenserPrice || '-' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="discountType" :formatter="formatterDiscountType" label="优惠类型" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="payTypeName" label="支付方式" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="orderStatus" :formatter="formatterOrderStatus" label="订单状态" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="isHidden" label="属性" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.isHidden == 1 ? '删除' : '正常' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="建单时间" show-overflow-tooltip width="180"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope" v-if="scope.row.button === 0 && scope.row.orderStatus === 2">
                <div v-if="isAllowService(scope.row.isAllowService, 0)">
                  <span
                    class="rowstyle"
                    @click="
                      lookShopDetail(scope.row);
                      detailDialogVisible = true;
                    "
                    >禁止操作</span
                  >
                </div>
                <div v-else>
                  <el-tooltip v-if="getPerm('dal:machine:resetMachine') && scope.row.orderType != 3 && isAllowService(scope.row.isAllowService, 4)" content="复位" placement="top" effect="dark">
                    <svg class="icon" aria-hidden="true" @click="handleReset(scope.row)">
                      <use xlink:href="#icon-clockwise"></use>
                    </svg>
                  </el-tooltip>
                  <el-tooltip
                    v-if="getPerm('dal:machine:stautsMachine') && scope.row.orderType != 3 && isAllowService(scope.row.isAllowService, 4) && notAllowToStart(scope.row.support)"
                    content="启动"
                    placement="top"
                    effect="dark"
                  >
                    <svg class="icon" aria-hidden="true" @click="handleStartUp(scope.row)">
                      <use xlink:href="#icon-qidong"></use>
                    </svg>
                  </el-tooltip>
                  <el-tooltip
                    v-if="getPerm('dal:order:refund') && isAllowService(scope.row.isAllowService, 1) && scope.row.payType != 4 && scope.row.isRefund === 1"
                    content="退款"
                    placement="top"
                    effect="dark"
                  >
                    <svg class="icon" aria-hidden="true" @click="orderRefund(scope.row)">
                      <use xlink:href="#icon-tuikuan"></use>
                    </svg>
                  </el-tooltip>
                  <el-tooltip v-if="getPerm('dal:order:compensate') && isAllowService(scope.row.isAllowService, 2)" content="补偿" placement="top" effect="dark">
                    <svg class="icon" aria-hidden="true" @click="orderCompensate(scope.row)">
                      <use xlink:href="#icon-buchang"></use>
                    </svg>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-col :span="24" class="toolbar">
            <div class="block">
              <q-pager :total="total" />
            </div>
          </el-col>
          <el-dialog title="订单补偿" :visible.sync="isorderVisible" @close="isorderVisible = false">
            <el-form label-width="110px" :model="compensate" :rules="orderRules" ref="orderCompensate">
              <el-form-item label="订单编号：" class="form-item-m" prop="orderNo">
                <el-input class="el-input" v-model="compensate.orderNo" :disabled="true" clearable auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="补偿金额：" class="form-item-m" prop="price">
                <el-input class="el-input" v-model="compensate.price" clearable></el-input>
              </el-form-item>
              <el-form-item label="故障描述：" class="form-item-m" prop="desc">
                <el-select size="small" v-model="compensate.desc" placeholder="请选择" style="width:100%" @change="compensatemark">
                  <el-option v-for="(item, index) in desctext" :label="`${index + 1}、${item}`" :value="item" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客服备注" prop="mark" v-if="compensatemarkFlag">
                <el-input type="textarea" v-model="compensate.mark" placeholder="请输入内容（不超过300字）"></el-input>
              </el-form-item>
              <el-form-item label="上传故障图片：" class="form-item-m">
                <q-upload v-model="compensate.urls" :limit="3" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer btn-footer">
              <el-button type="primary" @click="saveCompensate()">提交</el-button>
              <el-button type="primary" plain @click.native="isorderVisible = false">取消</el-button>
            </div>
          </el-dialog>
          <el-dialog class="refuse-dialog" title="订单退款" :visible.sync="isOrderRefund" @close="isOrderRefund = false">
            <el-form label-width="110px" :model="compensate" :rules="rules" ref="compensate">
              <el-form-item label="订单编号：" class="form-item-m">
                <el-input class="el-input" v-model="compensate.orderNo" :disabled="true" clearable auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="退款金额：" class="form-item-m" prop="price">
                <el-input class="el-input" v-model="compensate.price" clearable></el-input>
              </el-form-item>
              <el-form-item label="故障描述：" class="form-item-m" prop="desc">
                <el-select size="small" v-model="compensate.desc" placeholder="请选择" style="width:100%" @change="refundmark">
                  <el-option v-for="(item, index) in desctext" :label="`${index + 1}、${item}`" :value="item" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客服备注" prop="mark" v-if="refundmarkFlag">
                <el-input type="textarea" v-model="compensate.mark" placeholder="请输入内容（不超过300字）"></el-input>
              </el-form-item>
              <el-form-item label="上传故障图片：" class="form-item-m">
                <q-upload v-model="compensate.urls" :limit="3" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer btn-footer">
              <el-button type="primary" @click="saveRefund()">提交</el-button>
              <el-button type="primary" plain @click.native="isOrderRefund = false">取消</el-button>
            </div>
          </el-dialog>
          <el-dialog class="order-detail" title="订单详情" :visible.sync="orderDesVisible" @close="orderDesVisible = false">
            <el-form :inline="true" :model="orderData" class="carrier-detail">
              <div class="border-b" v-if="orderData.compensate">
                <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>补偿信息</h2>
                <el-form-item label="补偿时间：">
                  <span>{{ orderData.compensate.createTime ? orderData.compensate.createTime : '---' }}</span>
                </el-form-item>
                <el-form-item label="补偿金额：">
                  <span>{{ orderData.compensate.sum ? orderData.compensate.sum : '---' }}</span>
                </el-form-item>
                <el-form-item label="操作人：">
                  <span>{{ orderData.compensate.createUserName ? orderData.compensate.createUserName : '---' }}</span>
                </el-form-item>
                <el-form-item label="故障描述：">
                  <span>{{ orderData.compensate.description ? orderData.compensate.description : '---' }}</span>
                </el-form-item>
                <el-form-item label="故障图片：">
                  <img v-if="orderData.compensate.urls" v-for="(item, index) in orderData.compensate.urls" :key="index" :src="item" @click="showImg(item)" width="146" height="146" />
                </el-form-item>
              </div>
              <div class="border-b" v-if="orderData.refund">
                <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>退款信息</h2>
                <el-form-item label="退款时间：">
                  <span>{{ orderData.refund.createTime ? orderData.refund.createTime : '---' }}</span>
                </el-form-item>
                <el-form-item label="退款金额：">
                  <span>{{ orderData.refund.sum ? orderData.refund.sum : '---' }}</span>
                </el-form-item>
                <el-form-item label="操作人：">
                  <span>{{ orderData.refund.createUserName ? orderData.refund.createUserName : '---' }}</span>
                </el-form-item>
                <el-form-item label="故障描述：">
                  <span>{{ orderData.refund.description ? orderData.refund.description : '---' }}</span>
                </el-form-item>
                <el-form-item label="故障图片：">
                  <img v-if="orderData.refund.urls" v-for="(item, index) in orderData.refund.urls" :key="index" :src="item" @click="showImg(item)" width="146" height="146" />
                </el-form-item>
              </div>
              <div class="border-b">
                <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>基本信息</h2>
                <el-form-item label="订单编号：">
                  <span>{{ orderData.orderNo }}</span>
                </el-form-item>
                <el-form-item label="支付状态：">
                  <span v-if="orderData.orderStatus == 0">未支付</span>
                  <span v-else-if="orderData.orderStatus == 1">已失败</span>
                  <span v-else-if="orderData.orderStatus == 2">已支付</span>
                  <span v-else-if="orderData.orderStatus == 3">已完成</span>
                  <span v-else-if="orderData.orderStatus == 4">申请退款</span>
                  <span v-else-if="orderData.orderStatus == 5">已退款</span>
                </el-form-item>
                <el-form-item label="创建时间：">
                  <span>{{ orderData.createTime }}</span>
                </el-form-item>
                <el-form-item label="支付时间：">
                  <span>{{ orderData.payTime }}</span>
                </el-form-item>
                <el-form-item label="用户账号：">
                  <span>{{ orderData.phone }}</span>
                </el-form-item>
                <el-table border :data="orderinfoData" class="my-table">
                  <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="machineName" label="设备名称" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="machineType" label="通信类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ scope.row.machineType == 0 ? '脉冲' : '串口' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="machineFunctionName" label="功能名称" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="operator" label="运营商" show-overflow-tooltip> </el-table-column>
                  <el-table-column prop="payPrice" label="订单金额"> </el-table-column>
                  <el-table-column prop="markPrice" label="原价"> </el-table-column>
                  <el-table-column prop="discountPrice" label="优惠价"> </el-table-column>
                  <el-table-column prop="payPrice" label="实付价"> </el-table-column>
                  <el-table-column prop="discountType" :formatter="formatterDiscountType" label="优惠类型"> </el-table-column>
                </el-table>
              </div>
            </el-form>
            <div style="margin-top:30px;" v-if="orderData.revenueSharingLogs">
              <h2 class="detail-info-title"><i class="header-icon el-icon-goods"></i>分账信息</h2>
              <el-table :data="orderData.revenueSharingLogs" style="width: 100%" border class="my-table">
                <el-table-column prop="shareOperatorUsername" label="运营商账号"></el-table-column>
                <el-table-column prop="shareOperatorRealName" label="运营商姓名"></el-table-column>
                <el-table-column label="分账比例">
                  <template slot-scope="scope">{{ scope.row.proportion }}%</template>
                </el-table-column>
                <el-table-column prop="amount" label="分账金额"></el-table-column>
              </el-table>
            </div>
          </el-dialog>
          <!-- 查看大图 -->
          <el-dialog class="big-img" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import Api from '@/utils/Api';
import QBreadcrumb from '@/components/Breadcrumb';
import QArea from '@/components/Area';
import DataUtils from '@/utils/Data';
import QUpload from '@/components/Upload';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import { Orderstatus } from '@/utils/Mapping';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    var checkPrice = (rule, value, callback) => {
      if (parseFloat(value) > this.orderPrice) {
        return callback(new Error('填写的金额不能大于订单金额！'));
      } else {
        callback();
      }
    };
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,
      orderPrice: '', // 订单金额
      compensate: {
        orderNo: '',
        price: '',
        desc: '',
        urls: []
      },
      desctext: [
        '支付不启动，责任无法明确，已退款',
        '丢脉冲（支付功能与实际功能不一致），已退款',
        '需按红色键启动（我司提示贴未贴），已退款',
        '支付后显示离线，已退款',
        '设备不启动显示FC或FC5，模块问题，已退款',
        '同台设备重复支付，已退款',
        '机器故障（含故障代码、外观明显破损），有照片为证，直接退款',
        '学校停水、停电，已通知商户，我司已退款',
        '其他'
      ],
      orderData: {
        orderNo: null,
        orderStatus: null,
        orderType: null,
        createTime: null,
        payTime: null,
        userId: null,
        phone: null,
        shopName: null,
        machineName: null,
        machineType: null,
        machineFunctionName: null,
        operator: null,
        payPrice: null,
        compensate: [],
        refund: [],
        revenueSharingLogs: []
      },
      // 头部搜索
      searchData: {
        orderNo: null,
        phone: null,
        operatorName: null,
        shopName: null,
        orderStatus: null,
        payType: null,
        startTime: null,
        endTime: null,
        isHidden: null,
        shopType: null,

        //
        areaIds: null,

        // 机器类型
        machineTypeId: [null]
      },
      // 机器类型cascader数据
      machineTypeData: [{ value: null, label: '不限' }],
      rules: {
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: '^\\d{0,10}([.]{1}[0-9]{1,4})?$', message: '价格最多不超过10位整数且最多带4位小数', trigger: 'blur' }
        ],
        orderNo: [{ required: true, message: '请填写订单号', trigger: 'blur' }],
        desc: [{ required: true, message: '故障描述不能为空', trigger: 'change' }],
        mark: [{ max: 300, message: '备注内容不超过300字', trigger: 'blur' }]
      },
      orderRules: {
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { pattern: '^\\d{0,10}([.]{1}[0-9]{1,4})?$', message: '价格最多不超过10位整数且最多带4位小数', trigger: 'blur' }
        ],
        orderNo: [{ required: true, message: '请填写订单号', trigger: 'blur' }],
        desc: [{ required: true, message: '故障描述不能为空', trigger: 'blur' }],
        mark: [{ max: 300, message: '备注内容不超过300字', trigger: 'blur' }]
      },
      isOrderRefund: false, //订单退款
      isorderVisible: false,
      orderDesVisible: false,
      resetMachineVisible: false,
      statusMachineVisible: false,
      machineId: '',
      orderNo: '',
      machineFunctionId: '',
      orderinfoData: [],
      activeName: '3',

      OrderStatusEnum: [], // 订单状态
      firstTypes: [], // 一级类型
      // 店铺类型
      shopTypeList: [],

      // 显示原图
      dialogImageUrl: null,
      dialogVisible: false,

      compensatemarkFlag: false,
      refundmarkFlag: false,
      payTypeList: []
    };
  },
  created() {
    if (this.getPerm('dal:order:list')) {
      this.getCommonConstant();
      this.getTypeStart();
      this.getShopType();
      this.getPayType();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 地区转换
      this.searchData.areaIds = [this.$route.query.provinceId || null, this.$route.query.cityId || null, this.$route.query.districtId || null];
      // 机器类型转换
      this.searchData.machineTypeId = [this.$route.query.machineFirstTypeId || null, this.$route.query.machineSecondTypeId || null];
      this.getOrderList();
    }
  },
  methods: {
    // 给table添加序号
    indexMethod(index) {
      return index + (this.apiParams.page - 1) * this.apiParams.pageSize + 1;
    },
    //订单列表
    getOrderList() {
      this.apiUrl = Api.ORDER_LSIT;
      let query = this.$route.query;
      this.setApiParams(query);
      this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items || [];
        this.list.forEach(item => {
          item.isAllowService = item.isAllowService ? String(item.isAllowService) : '';
        });
      });
    },
    // 支付类型列表
    getShopType() {
      this.$axios.post(Api.GET_SHOP_TYPE).then(resp => {
        this.shopTypeList = resp.items;
      });
    },
    // 获取店铺类型
    getPayType() {
      this.$axios.post(Api.ORDER_PAYTYPE).then(resp => {
        this.payTypeList = resp.items;
      });
    },
    //根据条件查询店铺列表信息
    goSearch() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          // 地区转换
          query.provinceId = query.areaIds ? query.areaIds[0] : null;
          query.cityId = query.areaIds ? query.areaIds[1] : null;
          query.districtId = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          // 二级类型转换
          if (query.machineTypeId[0]) {
            query.machineFirstTypeId = query.machineTypeId[0];
            if (query.machineTypeId[1]) {
              query.machineSecondTypeId = query.machineTypeId[1];
            }
          }
          query.machineTypeId = null;
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },

    //查看订单详情
    getOrderDetails(orderNo, userId) {
      let payload = { orderNo: orderNo, userId: userId };
      return this.$axios.post(Api.ORDER_DETAILS, payload).then(resp => {
        this.orderData = resp;
        this.orderinfoData = [
          {
            shopName: resp.shopName,
            machineName: resp.machineName,
            machineType: resp.machineType,
            machineFunctionName: resp.machineFunctionName,
            operator: resp.operator,
            payPrice: resp.payPrice,
            markPrice: resp.markPrice,
            discountPrice: resp.discountPrice,
            discountType: resp.discountType
          }
        ];
        this.activeName = '';
      });
    },
    // 获取头部搜索的订单状态
    getCommonConstant() {
      return this.$axios.post(Api.COMMON_CONSTANT).then(resp => {
        this.OrderStatusEnum = resp.OrderStatusEnum.datas;
        let searchData = Object.assign({}, this.$route.query);
        let pac = this.OrderStatusEnum.find(item => Number(searchData.orderStatus) === Number(item.code));
        if (pac) {
          this.searchData.orderStatus = pac.code;
        }
      });
    },
    // 优惠类型
    formatterDiscountType(row, column) {
      if (!row.discountType) return '';
      let typeArr = row.discountType.split(',');
      var type = '';
      for (let i = 0; i < typeArr.length; i++) {
        if (typeArr[i] == 1) {
          type += 'vip ';
        } else if (typeArr[i] == 2) {
          type += '限时优惠 ';
        } else if (typeArr[i] == 3) {
          type += '优惠券 ';
        } else {
          type = '';
        }
      }
      return type;
    },

    //订单状态
    formatterOrderStatus(row, column) {
      return Orderstatus[row.orderStatus];
    },
    //订单补偿
    orderCompensate(row) {
      return this.$axios
        .post(Api.ORDER_DETAILS, {
          orderNo: row.orderNo,
          userId: row.userId
        })
        .then(resp => {
          this.isorderVisible = true;
          this.compensate = Object.assign({}, row);
          this.compensate.price = row.payPrice;
          this.orderPrice = row.payPrice;
        });
    },
    compensatemark(val) {
      val === '其他' ? (this.compensatemarkFlag = true) : (this.compensatemarkFlag = false);
    },
    refundmark(val) {
      val === '其他' ? (this.refundmarkFlag = true) : (this.refundmarkFlag = false);
    },
    //保存补偿信息
    saveCompensate() {
      this.$refs.orderCompensate.validate(valid => {
        if (valid) {
          this.isorderVisible = false;
          let payload = {
            orderNo: this.compensate.orderNo || '',
            price: this.compensate.price || '',
            desc: this.compensate.desc || '',
            urls: this.compensate.urls || ''
          };
          if (this.compensate.mark) {
            payload.desc = `${payload.desc}(${this.compensate.mark})`;
          }
          this.$axios.post(Api.ORDER_COMPENSATE, payload).then(resp => {
            this.getOrderList();
            this.$message({
              showClose: true,
              message: '恭喜你，订单补偿成功！',
              type: 'success'
            });
          });
        }
      });
    },
    //订单退款
    orderRefund(row) {
      return this.$axios
        .post(Api.ORDER_DETAILS, {
          orderNo: row.orderNo,
          userId: row.userId
        })
        .then(resp => {
          this.isOrderRefund = true;
          this.compensate = Object.assign({}, row);
          this.compensate.price = row.payPrice;
          this.orderPrice = row.payPrice;
        });
    },
    saveRefund() {
      this.$refs.compensate.validate(valid => {
        if (valid) {
          this.isOrderRefund = false;
          let payload = {
            orderNo: this.compensate.orderNo || '',
            price: this.compensate.price || '',
            desc: this.compensate.desc || '',
            urls: this.compensate.urls || ''
          };
          if (this.compensate.mark) {
            payload.desc = `${payload.desc}(${this.compensate.mark})`;
          }
          this.$axios.post(Api.ORDER_REFUND, payload).then(resp => {
            this.getOrderList();
            this.$message({
              showClose: true,
              message: '恭喜你，订单退款成功！',
              type: 'success'
            });
          });
        }
      });
    },
    //设备复位
    handleReset(row) {
      this.$confirm('是否复位设备', '提示').then(_ => {
        this.$axios
          .post(Api.MACHINE_RESETMACHINE, {
            machineId: row.machineId,
            orderNo: row.orderNo || ''
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '恭喜你，设备复位成功！',
              type: 'success'
            });
            this.getOrderList();
          });
      });
    },
    //设备启动
    handleStartUp(row) {
      this.$confirm('是否启动设备', '提示').then(_ => {
        this.$axios
          .post(Api.MACHINE_STAUTSMACHINE, {
            orderId: row.id || '',
            shopId: row.shopId || ''
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '恭喜你，设备启动成功！',
              type: 'success'
            });
            this.getOrderList();
          });
      });
    },
    openOrderDetailDialog(orderNo, userId) {
      if (this.getPerm('dal:order:details')) {
        this.getOrderDetails(orderNo, userId).then(_ => (this.orderDesVisible = true));
      }
    },
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          // 地区转换
          query.provinceId = query.areaIds ? query.areaIds[0] : null;
          query.cityId = query.areaIds ? query.areaIds[1] : null;
          query.districtId = query.areaIds ? query.areaIds[2] : null;
          query.areaIds = null;
          exportExcel(Api.EXPORT_ORDER, '订单总览.xlsx', query);
        }
      });
    },
    //获取一级类型
    getTypeStart() {
      return this.$axios.post(Api.MACHINETYPE_LIST).then(res => {
        this.machineTypeData = [...this.machineTypeData, ...DataUtils.tree(res, 'id', 'parentTypeId')];
      });
    },
    // 查看原图
    showImg(imgUrl) {
      if (imgUrl != null) {
        this.dialogImageUrl = imgUrl;
        this.dialogVisible = true;
      }
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm']),
    notAllowToStart: function() {
      //不允许启动
      return function(value) {
        if ((value & 16) == 16) {
          return false;
        } else {
          return true;
        }
      };
    },
    isAllowService: function() {
      return function(value, num) {
        if (value && value.includes(num)) {
          return true;
        } else {
          return false;
        }
      };
    }
  },
  components: {
    QBreadcrumb,
    QUpload,
    QArea
  }
};
</script>

<style lang="less">
.order-detail {
  .el-collapse {
    border-top: none;
  }
  .el-dialog {
    width: 75%;
  }
}

.refuse-dialog {
  .el-textarea__inner {
    line-height: 3.5;
  }
}

.border-b {
  border-bottom: 1px solid #e3e1e1;
  margin-bottom: 10px;
}
.detail-info-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  i {
    margin-right: 8px;
  }
}

.carrier-detail {
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
