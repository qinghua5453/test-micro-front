<template>
  <div v-if="getPerm('dal:machine:list')">
    <!--表单-->
    <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline device-wrapper">
      <el-form-item label="设备名称：" prop="name">
        <el-input clearable v-model="searchData.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="一级类型：" prop="firstTypeId">
        <el-select size="small" v-model="searchData.firstTypeId" placeholder="全部" @change="choseFirstType($event)">
          <el-option label="不限" :value="null"></el-option>
          <el-option v-for="item in firstTypes" :key="item.id" :label="item.machineTypeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级类型：" prop="subTypeId">
        <el-select size="small" v-model="searchData.subTypeId" placeholder="全部">
          <el-option label="不限" :value="null"></el-option>
          <el-option v-for="item in subTypes" :key="item.id" :label="item.machineTypeName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopName">
        <el-input size="small" clearable v-model="searchData.shopName"></el-input>
      </el-form-item>
      <el-form-item label="运营商账号：" prop="operatorName">
        <el-input size="small" clearable v-model="searchData.operatorName"></el-input>
      </el-form-item>
      <el-form-item label="设备状态：" prop="status">
        <el-select size="small" v-model="searchData.status" placeholder="全部">
          <el-option label="不限" :value="null"></el-option>
          <el-option label="空闲" value="1"></el-option>
          <el-option label="预约" value="7"></el-option>
          <el-option label="使用中" value="2"></el-option>
          <el-option label="故障" value="4"></el-option>
          <el-option label="离线" value="8"></el-option>
          <el-option label="删除" value="9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式：" prop="payType">
        <el-select size="small" v-model="searchData.payType" placeholder="全部">
          <el-option label="不限" :value="null"></el-option>
          <el-option label="支付宝" value="1"></el-option>
          <el-option label="余额支付 " value="2"></el-option>
          <el-option label="微信支付" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区：" prop="areaId">
        <el-select size="small" v-model="searchData.areaId" placeholder="全部">
          <el-option label="不限" :value="null"></el-option>
          <el-option v-for="item in proviceTypes" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="NQT：" prop="NQT">
        <el-input clearable size="small" v-model="searchData.NQT"></el-input>
      </el-form-item>
      <el-form-item label="IMEI：" prop="imei">
        <el-input clearable size="small" v-model="searchData.imei"></el-input>
      </el-form-item>
      <el-form-item label="BD：" prop="bdName">
        <el-input clearable size="small" v-model="searchData.bdName"></el-input>
      </el-form-item>
      <el-form-item label="VER：" prop="version">
        <el-input clearable size="small" v-model="searchData.version"></el-input>
      </el-form-item>
      <el-form-item label="添加时间：">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="公司：" prop="company">
        <el-select size="small" v-model="searchData.company" placeholder="全部">
          <el-option label="不限" :value="null"></el-option>
          <el-option label="慧人" value="huiren"></el-option>
          <el-option label="有方" value="youfang"></el-option>
          <el-option label="合宙" value="hezhou"></el-option>
          <el-option label="企鹅" value="qiekj"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <a class="el-button el-button--primary" type="primary" @click="goSearchList()">查询</a>
      </el-form-item>
      <el-form-item v-if="getPerm('dal:machine:excel')">
        <a class="el-button el-button--primary" type="primary" @click="exportTable()">导出</a>
      </el-form-item>
    </el-form>
    <div class="tab-s">
      <el-button class="btn-add" icon="el-icon-sold-out" type="primary" @click="isbtnVisible = !isbtnVisible" v-if="
					getPerm('dal:machine:batchUpdate:type') ||
					getPerm('dal:machine:batchUpdate:shop') ||
					getPerm('dal:machine:batchUpdate:wechatPay') ||
					getPerm('dal:machine:batchUpdate:delete')
				">{{isbtnVisible ? '取消操作' : '批量操作' }}</el-button>
      <div class="select-all" v-if="isbtnVisible">
        <el-button class="dev-button" type="primary" @click="isAllChecked = !isAllChecked">{{this.isAllChecked == false ? '全选' : '取消全选'}}</el-button>
        <el-button v-if="getPerm('dal:machine:batchUpdate:type')" class="dev-button" type="primary" :disabled="this.sels.length === 0" @click="changeDevType()">更换设备类型</el-button>
        <el-button v-if="getPerm('dal:machine:batchUpdate:shop')" class="dev-button" type="primary" :disabled="this.sels.length === 0" @click="changeShop()">更换所在店铺</el-button>
        <el-button v-if="getPerm('dal:machine:batchUpdate:wechatPay')" class="dev-button" type="primary" :disabled="this.sels.length === 0" @click="goWxpay()">开通微信支付</el-button>
        <el-button v-if="getPerm('dal:machine:batchUpdate:delete')" class="dev-button" type="primary" :disabled="this.sels.length === 0" @click="delGroup()">删除</el-button>
      </div>
      <!--表格-->
      <el-table border :data="list" ref="list" style="width: 100%" :fit="true" @selection-change="selsChange" height="603" class="my-table">
        <el-table-column v-if="isbtnVisible" type="selection">
        </el-table-column>
        <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed prop="name" label="设备名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="parentTypeName" label="一级类型" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="subTypeName" label="二级类型" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="shopName" label="所属店铺" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="operatorName" label="运营商" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="设备状态" :formatter="formatterStatus" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isDetergent" label="是否支持洗衣液" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.parentTypeId == 'c9892cb4-bd78-40f6-83c2-ba73383b090a' || scope.row.parentTypeId == 'ef5b8f13-36ec-44fb-8179-38627abd9be0'">
              <span v-if="scope.row.isDetergent || scope.row.isDetergent == 0">{{scope.row.isDetergent == 0 ? '否' : '是'}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isOpenDetergent" label="是否开通洗衣液" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.parentTypeId == 'c9892cb4-bd78-40f6-83c2-ba73383b090a' || scope.row.parentTypeId == 'ef5b8f13-36ec-44fb-8179-38627abd9be0'">
              <span v-if="scope.row.isOpenDetergent || scope.row.isOpenDetergent == 0">{{scope.row.isOpenDetergent == 0 ? '否' : '是'}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="firmware" label="imei版本号" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signal" label="信号值" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{signalred:scope.row.signal < 18}">{{scope.row.signal}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="通信类型" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.type == 0 ? '脉冲' : '串口'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="company" :formatter="formatterCompany" label="公司" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="allowPayType" :formatter="formatterType" label="支付方式" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="订单数" width="80">
          <template slot-scope="scope">
            <div>{{scope.row.orderCount ? scope.row.orderCount : 0}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="orderMoney" label="订单金额" width="80" show-overflow-tooltip>
				</el-table-column> -->
        <el-table-column prop="NQT" label="NQT" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="imei" label="IMEI" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="version" label="VER" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="aliDeviceStatus" :formatter="formatterDevStatus" label="阿里状态" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip width="180">
        </el-table-column>
        <el-table-column prop="bdName" label="BD" width="100">
        </el-table-column>
        <el-table-column prop="province" label="省" width="100">
        </el-table-column>
        <el-table-column prop="city" label="市" width="100">
        </el-table-column>
        <el-table-column prop="district" label="区" width="100">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope" v-if="scope.row.status != 9">
            <el-tooltip v-if="getPerm('dal:machine:update')" content="编辑" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="editDevice(scope.index,scope.row)">
                <use xlink:href="#icon-document-edit"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:machine:wechatPayOpen')" content="开通微信支付" placement="top" effect="dark">
              <svg style="font-size: 24px;" v-if="scope.row.wechatPayStauts == 0" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                <use xlink:href="#icon-kaiguankai"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:machine:wechatPayOpen')" content="关闭微信支付" placement="top" effect="dark">
              <svg style="font-size: 24px;" v-if="scope.row.wechatPayStauts == 1" class="icon weiixn-icon" aria-hidden="true" @click="handleToggleWxPay(scope.row)">
                <use xlink:href="#icon-kaiguanguan"></use>
              </svg>
            </el-tooltip>
            <el-tooltip v-if="getPerm('dal:machine:delete')" content="删除" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="handleDelete(scope.row.id)">
                <use xlink:href="#icon-trashcopy"></use>
              </svg>
            </el-tooltip>
            <el-tooltip content="IOT日志" placement="top" effect="dark">
              <svg class="icon" aria-hidden="true" @click="openIOTModle(scope.row.imei)">
                <use xlink:href="#icon-shenhe"></use>
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
    <!--////////////////////////////////////////////////////   以下为dialog   ////////////////////////////////////////-->
    <!-- 编辑设备 -->
    <el-dialog title="编辑设备 " :visible.sync="editDeviceVisible" @close="editDeviceVisible = false">
      <el-form class="edit-machine" :model="editData" :rules="machineRules" ref="editData" v-if="editData">
        <el-form-item label="设备名称：" class="form-item-m" prop="name">
          <el-input v-model="editData.name" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="通信类型：" class="form-item-m" prop="type">
          <el-select style="width:100%;" v-model="editData.type" :disabled="true" placeholder="请选择">
            <el-option label="串口" :value="1"></el-option>
            <el-option label="脉冲" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类：" class="form-item-m" prop="parentTypeName">
          <el-input v-model="editData.parentTypeName" :disabled="true" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="二级分类：" class="form-item-m" prop="subTypeId">
          <el-input v-model="editData.subTypeName" :disabled="true" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="所属店铺：" class="form-item-m" prop="shopId">
          <q-shop-select v-model="editData.shopId" :defaultList="[{ id: editData.shopId, name: editData.shopName }]" :width="100" />
        </el-form-item>
        <el-form-item label="NQT：" class="form-item-m" prop="NQT">
          <el-input v-model="editData.NQT" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-form-item label="IMEI：" class="form-item-m" prop="imei">
          <el-input v-model="editData.imei" clearable auto-complete="off" class="input-w"></el-input>
        </el-form-item>
        <el-table border :data="editData.setFunctionList" style="width: 100%" class="my-table edit-machine-table">
          <el-table-column prop="functionName" label="功能">
          </el-table-column>
          <el-table-column label="时间(分钟)" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'setFunctionList.' + scope.$index + '.needMinutes'" :rules='machineRules.needMinutes'>
                <el-input v-model="scope.row.needMinutes" clearable auto-complete="off" class="input-w"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'setFunctionList.' + scope.$index + '.price'" :rules='machineRules.price'>
                <el-input v-model="scope.row.price" clearable auto-complete="off" class="input-w"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="洗衣液用量" width="150" v-if="editData.parentTypeName == '洗衣机' || editData.parentTypeName == '洗鞋机'">
            <template slot-scope="scope">
              <el-form-item prop="detergentLiquid">
                <el-select v-model="scope.row.detergentLiquid" @change="changeDetergentPrice(scope.$index)" placeholder="请选择">
                  <el-option v-for="item in detergentList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="洗衣液价格" width="200" v-if="editData.parentTypeName == '洗衣机' || editData.parentTypeName == '洗鞋机'">
            <template slot-scope="scope">
              <el-form-item :prop="'setFunctionList.' + scope.$index + '.detergentPrice'" :rules='machineRules.detergentPrice'>
                <el-input v-model="scope.row.detergentPrice" clearable auto-complete="off" class="input-w"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="ifOpen" label="状态" width="200">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.ifOpen">
                <el-radio :label="0">开启</el-radio>
                <el-radio :label="1">关闭</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="saveEditMechine()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 更换类型 -->
    <el-dialog class="min-dialog" title="更换类型 " :visible.sync="changeTypeisible" @close="changeTypeisible = false">
      <el-form label-width="96px" :model="batchUpadteDataType" :rules="changeTypeFormRules" ref="changeTypeForm">
        <el-form-item label="二级类型：" class="form-item-m" prop="DeviceType">
          <el-select style="width:100%;" v-model="batchUpadteDataType.DeviceType" filterable placeholder="请选择">
            <el-option v-for="item in subTypes" :key="item.id" :label="item.machineTypeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="goSubtype('changeTypeForm')">确认</el-button>
        <el-button type="primary" plain @click.native="changeTypeisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 更换店铺 -->
    <el-dialog class="min-dialog" title="更换店铺" :visible.sync="changeShopVisible" @close="changeShopVisible = false">
      <el-form>
        <el-form-item label="店铺名称：" class="form-item-m">
          <q-shop-select v-model="shopId" :defaultList="shops" :width="80" />
          <div class="el-form-item__error" v-if="shopId == ''">请选择店铺</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="primary" @click.native="editShop()">确认</el-button>
        <el-button type="primary" plain @click.native="changeShopVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--IOT日志-->
    <IOT :visible.sync="isShowSetShopDialog" v-if="isShowSetShopDialog" :imei="iotLogId"></IOT>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import QBreadcrumb from '@/components/Breadcrumb';
import QArea from '@/components/Area';
import QShopSelect from '@/components/ShopSelect';
import Api from '@/utils/Api';
import DataUtils from '@/utils/Data';
import { MachineStatus, PayType, MachineCompany, MachineAliStatus } from '@/utils/Mapping';
import PagerMixin from '@/mixins/PagerMixin';
import { exportExcel } from '@/utils/tool';
import IOT from './components/IOT.vue';
import moment from 'moment';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    // 验证时间
    var validateMineParamsValueInput = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('时间不能为空'));
      } else {
        callback();
      }
    };
    // 验证价格
    var checkPrice = (rule, value, callback) => {
      let reg = /^([0-9]\d*)(\s|$|\.\d{1,2}\b)/; // 验证概率大于或者等于0，并且包含两位小数
      if (!reg.test(value)) {
        return callback(new Error('最多允许两位小数'));
      } else {
        callback();
      }
    };
    // 验证洗衣液价格
    var checkdetergentPrice = (rule, value, callback) => {
      let reg = /^(\d|[1-9]\d|99)(\.\d{1,2})?$/; // 验证概率大于或者等于0，并且包含两位小数
      if (value && !reg.test(value)) {
        return callback(new Error('金额0-99，最多允许两位小数'));
      } else {
        callback();
      }
    };

    return {
      list: [], // 数据
      total: 0,

      //头部搜索
      searchData: {
        firstTypeId: null,
        subTypeId: null,
        shopName: null,
        operatorName: null,
        name: null,
        NQT: null,
        imei: null,
        company: null,
        status: null,
        payType: null,
        areaId: null,
        aliStatus: null,
        startTime: moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        bdName: null,
        version: null,

        //
        time: null
      },
      firstTypes: [], // 一级类型
      subTypes: [], // 二级类型
      shops: [], // 店铺列表
      proviceTypes: [],

      //批量操作
      sels: [], //选中的值显示
      shopId: '',
      isbtnVisible: false, // 是否显示批量操作
      isAllChecked: false, // 是否全选
      changeTypeisible: false,
      changeShopVisible: false,

      //编辑设备信息
      editData: {
        id: '',
        subTypeId: '',
        parentTypeName: '',
        shopId: '',
        shopName: '',
        type: '',
        name: '',
        NQT: '',
        imei: '',
        setFunctionList: []
      },
      // 洗衣液用量
      detergentList: [
        {
          value: '0',
          label: '0'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '12',
          label: '12'
        }
      ],
      batchUpadteDataType: {
        DeviceType: ''
      },
      changeTypeFormRules: {
        // 编辑的表单验证
        DeviceType: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'change'
          }
        ]
      },
      machineRules: {
        // 编辑的表单验证
        name: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择通讯类型',
            trigger: 'blur'
          }
        ],
        parentTypeName: [
          {
            required: true,
            message: '一级分类不能为空',
            trigger: 'blur'
          }
        ],
        subTypeId: [
          {
            required: true,
            message: '二级分类不能为空',
            trigger: 'blur'
          }
        ],
        shopId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        imei: [
          {
            required: true,
            message: '请填写IMEI',
            trigger: 'blur'
          }
        ],
        NQT: [
          {
            required: true,
            message: '请填写NQT',
            trigger: 'blur'
          }
        ],
        needMinutes: [{ required: true, message: '请填写时间', trigger: 'blur' }],
        price: [{ required: true, message: '请填写价格', trigger: 'blur' }, { validator: checkPrice, trigger: 'blur' }],
        detergentPrice: [{ validator: checkdetergentPrice, trigger: 'blur' }]
      },
      editDeviceVisible: false,

      isShowSetShopDialog: false, //IOT日志
      iotLogId: ''
    };
  },
  created() {
    // 判断该用户是否有查看权限
    if (this.getPerm('dal:machine:list')) {
      let arr = [];
      arr.push(this.getTypeId(0));
      if (this.$route.query.firstTypeId) {
        arr.push(this.getTypeId(this.$route.query.firstTypeId));
      }
      this.$axios.all(arr);
      this.getMachineList();
      this.getCommonProvice();
      this.searchData = Object.assign(this.searchData, this.$route.query);
      // 时间转换
      if (this.searchData.startTime && this.searchData.endTime) {
        this.searchData.time = [this.searchData.startTime, this.searchData.endTime];
      }
    }
    /*// 地区转换
			this.searchData.areaIds = [
				this.$route.query.provinceId || null,
				this.$route.query.cityId || null,
				this.$route.query.districtId || null
			]*/
  },
  methods: {
    //获取设备列表
    getMachineList() {
      this.apiUrl = Api.MACHINE_LIST;
      let query = Object.assign(this.searchData, this.$route.query);
      this.setApiParams(query);
      console.log(this.apiParams)
      return this.$axios.post(this.apiUrl, this.apiParams).then(resp => {
        this.total = resp.total;
        this.list = resp.items;
      });
    },
    // 获取省份
    getCommonProvice() {
      return this.$axios
        .post(Api.AREA_LIST, {
          parentId: 0
        })
        .then(resp => {
          this.proviceTypes = resp;
        });
    },
    //根据搜索条件查询设备列表
    goSearchList() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          /*// 地区转换
						query.provinceId = query.areaIds ? query.areaIds[0] : null
						query.cityId = query.areaIds ? query.areaIds[1] : null
						query.districtId = query.areaIds ? query.areaIds[2] : null
						query.areaIds = null
						*/
          query = DataUtils.filter(query);
          query['t'] = +new Date();
          this.$router.push({
            query: query
          });
        }
      });
    },
    //获取设备详情
    getMachineDetail(id) {
      return this.$axios.post(Api.MACHINE_DETAILS, {
        id: id
      });
    },
    //获取二级类型
    getTypeId(id) {
      return this.$axios
        .post(Api.MACHINE_GETTYPELIST, {
          parentId: id
        })
        .then(resp => {
          if (id === 0) {
            this.firstTypes = resp;
          } else {
            this.subTypes = resp;
          }
        });
    },
    //获取所有店铺信息
    getForshop() {
      return this.$axios.post(Api.SHOP_GETFORNAME).then(resp => {
        this.shops = resp;
      });
    },

    // 设备状态
    formatterStatus(row, column) {
      return MachineStatus[row.status];
    },
    //支付方式
    formatterType(row, column) {
      if (!row.allowPayType) return '';
      let typeArr = row.allowPayType.split(',');
      return typeArr.join(' ');
    },

    // 公司名称
    formatterCompany(row, column) {
      return MachineCompany[row.company];
    },

    // 阿里状态
    formatterDevStatus(row, column) {
      return MachineAliStatus[row.aliDeviceStatus];
    },

    //当选择一级类型之后触发 获取二级类型
    choseFirstType(item) {
      if (item) {
        this.getTypeId(item);
      } else {
        this.searchData.subTypeId = null;
        this.subTypes = [];
      }
    },
    //将勾选的id保存在数组中
    selsChange(sels) {
      this.sels = sels;
    },
    // 批量删除
    delGroup() {
      this.$confirm('您确定要删除吗？', '警告').then(_ => {
        var ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
        let params = {
          machineIds: ids,
          isDelete: 1
        };
        return this.$axios.post(Api.MACHINE_BATCHDELETE, params).then(_ => {
          this.$message({
            showClose: true,
            message: '恭喜你，操作成功！',
            type: 'success'
          });
          this.getMachineList();
        });
      });
    },
    //更换设备二级类型
    changeDevType() {
      if (this.sels.length > 1) {
        for (var i = 0; i < this.sels.sort().length - 1; i++) {
          if (this.sels[i].parentTypeId != this.sels[i + 1].parentTypeId) {
            this.$message({
              showClose: true,
              message: '一级类型不同，不能更换！',
              type: 'error'
            });
            return false;
          }
        }
      }
      this.getTypeId(this.sels[0].parentTypeId).then(_ => {
        this.changeTypeisible = true;
      });
    },
    // 批量更换设备类型
    goSubtype(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let DeviceType = this.batchUpadteDataType.DeviceType ? this.batchUpadteDataType.DeviceType : '';
          var ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
          let params = {
            machineIds: ids,
            subTypeId: DeviceType
          };
          return this.$axios.post(Api.MACHINE_BATCHTYPE, params).then(_ => {
            this.$message({
              showClose: true,
              message: '恭喜你，操作成功！',
              type: 'success'
            });
            this.getMachineList();
            this.changeTypeisible = false;
          });
        }
      });
    },
    //更换店铺
    changeShop() {
      this.getForshop().then(_ => {
        this.changeShopVisible = true;
      });
    },
    // 批量更换店铺
    editShop() {
      let shopId = this.shopId ? this.shopId : '';
      if (!shopId) {
        this.$message.error('信息未填写完整');
        return false;
      }
      var ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
      let params = {
        machineIds: ids,
        shopId: shopId
      };
      return this.$axios.post(Api.MACHINE_BATCHSHOP, params).then(_ => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功！',
          type: 'success'
        });
        this.getMachineList();
        this.changeShopVisible = false;
      });
      // this.batchUpadte('', shopId, '', '')
    },
    // 批量开通微信支付
    goWxpay() {
      this.$confirm('是否批量开通微信支付？', '提示', {
        type: 'warning'
      }).then(_ => {
        var ids = this.sels.map(item => item.id).join(); //获取所有选中行的id组成的字符串，以逗号分隔
        let params = {
          machineIds: ids,
          wechatPayOpen: 1
        };
        return this.$axios.post(Api.MACHINE_BATCHWECHAT, params).then(_ => {
          this.$message({
            showClose: true,
            message: '恭喜你，操作成功！',
            type: 'success'
          });
          this.getMachineList();
        });
      });
    },
    //编辑
    async editDevice(index, row) {
      this.editData = null;
      let machine = await this.getMachineDetail(row.id);
      this.editData = machine;
      this.editData.nqt = machine.NQT;
      this.editDeviceVisible = true;
      this.isShowDetergent = false;
    },
    saveEditMechine() {
      this.$refs.editData.validate(valid => {
        if (valid) {
          let params = {
            id: this.editData.id,
            subTypeId: this.editData.subTypeId,
            shopId: this.editData.shopId,
            type: this.editData.type,
            name: this.editData.name,
            NQT: this.editData.NQT,
            imei: this.editData.imei,
            functionListForm: JSON.stringify(this.editData.setFunctionList)
          };
          this.$axios.post(Api.MACHINE_UPDATE, params).then(_ => {
            this.getMachineList();
            this.editDeviceVisible = false;
            this.$message({
              showClose: true,
              message: '更新成功！',
              type: 'success'
            });
          });
        }
      });
    },
    // 开通微信支付
    handleToggleWxPay(device) {
      let w = device.wechatPayStauts === 1 ? '关闭' : '开通';
      this.$confirm(`是否需要${w}微信支付功能?`, '提示', {
        type: 'warning'
      }).then(_ => {
        this.$axios
          .post(Api.MACHINE_WECHATPAY, {
            machineId: device.id,
            status: device.wechatPayStauts
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: `恭喜你，微信支付已经${w}！`,
              type: 'success'
            });
            this.getMachineList();
          });
      });
    },

    // 删除某个设备
    handleDelete(machineId) {
      this.$confirm('您确定要删除该设备', '删除确认').then(_ => {
        this.$axios
          .post(Api.MACHINE_DELETE, {
            machineId: machineId
          })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '设备已删除成功！',
              type: 'success'
            });
            this.goSearchList();
          });
      });
    },
    exportTable() {
      this.$refs.searchData.validate(valid => {
        if (valid) {
          // 时间转换
          let query = DataUtils.clone(this.searchData);
          query.startTime = query.time ? query.time[0] : null;
          query.endTime = query.time ? query.time[1] : null;
          query.time = null;
          exportExcel(Api.EXPORT_MACHINE, '设备总览.xlsx', query);
        }
      });
    },
    //iot日志
    openIOTModle(id) {
      this.iotLogId = id;
      this.isShowSetShopDialog = true;
    },
    // 改变洗衣液用量
    changeDetergentPrice(index) {
      if (this.editData.setFunctionList[index].detergentLiquid == 0) {
        this.editData.setFunctionList[index].detergentPrice = '0';
      } else if (this.editData.setFunctionList[index].detergentLiquid == 8) {
        this.editData.setFunctionList[index].detergentPrice = '0.8';
      } else if (this.editData.setFunctionList[index].detergentLiquid == 10) {
        this.editData.setFunctionList[index].detergentPrice = '1';
      } else if (this.editData.setFunctionList[index].detergentLiquid == 12) {
        this.editData.setFunctionList[index].detergentPrice = '1.2';
      }
    }
  },
  watch: {
    // 全选和取消全选
    isAllChecked(flag) {
      if (flag) {
        this.list.forEach(row => {
          this.$refs.list.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.list.clearSelection();
      }
    },
    '$route.query': function(query, oldQuery) {
      this.isbtnVisible = false;
      this.isAllChecked = false;
    }
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  components: {
    QBreadcrumb,
    QArea,
    QShopSelect,
    IOT
  }
};
</script>

<style lang="less">
.device-wrapper {
  .el-form-item__label {
    font-size: 12px;
  }
}

.ck-all {
  margin-right: 30px;
  margin-left: 15px;
}

.dev-button {
  margin-bottom: 15px;
}
.edit-machine {
  .el-form-item__label {
    width: 96px;
  }
  .el-form-item__content {
    margin-left: 96px;
  }
  .my-table table td {
    padding: 15px 0;
  }
  .edit-machine-table {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item {
      margin-top: 22px !important;
    }
  }
}
.signalred {
  color: #f54949;
}
</style>
