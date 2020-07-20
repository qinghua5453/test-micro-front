
<template>
  <section v-if="getPerm('dal:event:list')">
    <el-row>
      <el-col :span="24">
        <!-- 面包屑导航 -->
        <q-breadcrumb :data="['营销管理', '发放列表']" />
        <!--表单-->
        <el-form :inline="true" :model="searchData" ref="searchData" class="demo-form-inline">
          <el-form-item label="活动名称：">
            <el-input size="small" clearable v-model="searchData.name" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input size="small" clearable v-model="searchData.username" style="width: 140px;"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <a class="el-button el-button--primary" type="primary" @click="goSearch">查询</a>
          </el-form-item>
          <el-form-item v-if="getPerm('dal:event:excel')">
            <a class="el-button el-button--primary" type="primary" @click="exportTable">导出</a>
          </el-form-item>
        </el-form>
        <div class="tab-s">
          <!--新增弹出框-->
          <el-button v-if="getPerm('dal:event:add')" type="primary" class="el-icon-circle-plus btn-add" @click="openAddOperatorDialog">新增活动</el-button>
          <!--表格-->
          <el-table border :data="list" style="width: 100%" height="648" class="my-table">
            <el-table-column fixed label="序号" width="60" type="index" :index="indexMethod" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="活动名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="name-active" @click="openEventDetailDialog(scope.row.id)">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="优惠方式" width="100" show-overflow-tooltip :formatter="formatterDiscountType"></el-table-column>
            <el-table-column show-overflow-tooltip prop="userPositionList" label="设备类型" width="80" :formatter="formatterStatus">
            </el-table-column>
            <el-table-column show-overflow-tooltip label="有效期" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.startDate}}至{{scope.row.endDate}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="sonCount" label="有效时段" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="userNum" label="受益用户量" width="120">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="makeNum" label="发放数量(张)" width="120">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="useScope" label="适用范围">
              <template slot-scope="scope">
                <span>{{scope.row.useScope === 0 ? '通用' : '指定店铺'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="createUserName" label="创建人">
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
    <el-dialog class="addActivity-dialog" title="新增活动" :visible.sync="isShowAddEventDialog" @close="handleCancel">
      <el-form :model="addEvent" label-width="94px" :rules="addEventRules" ref="addOperator">
        <el-form-item label="活动名称：" prop="name">
          <el-input clearable v-model="addEvent.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="优惠方式：" prop="type">
          <el-radio-group v-model="addEvent.type" @change="handleType">
            <el-radio :label="id" :key="id" v-for="(name, id) in ActDiscountType">{{ name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="费用承担：" prop="sponsor">
          <el-radio-group v-model="addEvent.sponsor">
            <el-radio :label="1">平台</el-radio>
            <el-radio :label="2">运营商</el-radio>
            <el-radio :label="3">平台&nbsp;&nbsp;
              <el-input style="width:100px;" clearable v-model="addEvent.platformRatio" auto-complete="off"></el-input>&nbsp;&nbsp;% &nbsp;&nbsp;+&nbsp;&nbsp; 运营商&nbsp;&nbsp;
              <el-input clearable style="width:100px;" v-model="addEvent.operatorRatio" auto-complete="off"></el-input>&nbsp;&nbsp;%
              <div v-if="isshowrRatio" class="el-form-item__error">平台或运营商百分比必须是大于0小于100的整数</div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用范围：" prop="useScope">
          <el-radio-group v-model="addEvent.useScope" @change="handleUseScope">
            <el-radio :label="0">通用</el-radio>
            <el-radio :label="1">指定店铺</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店铺名称：" class="form-item-m" prop="shopId" v-if="isShowShop">
          <el-select style="width:100%" v-model="addEvent.shopId" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getAreaList" :loading="loading">
            <el-option v-for="item in shops" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <div class="el-form-item__error" v-if="isShopId">
            请选择店铺名称
          </div>
        </el-form-item>
        <el-form-item label="适用类型：" prop="usePositions">
          <el-checkbox-group v-model="addEvent.usePositions">
            <el-checkbox label="0">通用</el-checkbox>
            <el-checkbox label="1">洗衣机</el-checkbox>
            <el-checkbox label="2">烘干机</el-checkbox>
            <el-checkbox label="3">洗鞋机</el-checkbox>
            <el-checkbox label="4">吹风机</el-checkbox>
            <el-checkbox label="5">充电桩</el-checkbox>
            <el-checkbox label="6">饮水机</el-checkbox>
          </el-checkbox-group>
          <!-- <el-radio-group v-model="addEvent.usePosition" >
						<el-radio :label="0">通用</el-radio>
						<el-radio :label="1">洗衣券</el-radio>
						<el-radio :label="3">洗鞋券</el-radio>
						<el-radio :label="2">烘干券</el-radio>
						<el-radio :label="4">吹风机券</el-radio>
						<el-radio :label="5">充电桩券</el-radio>
					</el-radio-group> -->
        </el-form-item>
        <el-form-item label="数量：" prop="num">
          <template slot-scope="scope">
            <el-table :data="addEvent.templates" border style="width: 100%" class="my-table">
              <el-table-column prop="faceValue" label="面额" width="180">
                <template slot-scope="scope">
                  {{ addEvent.templates[scope.$index].type === 2 ? '免费体验券' : addEvent.templates[scope.$index].type === 3 ? addEvent.templates[scope.$index].faceValue*10+'折' : addEvent.templates[scope.$index].faceValue + '元'}}
                </template>
              </el-table-column>
              <el-table-column prop="minGcoins" label="条件">
                <template slot-scope="scope">
                  <span>{{addEvent.templates[scope.$index].minGcoins == 0.00 || addEvent.templates[scope.$index].type !== 1 ? '无' : '满' + addEvent.templates[scope.$index].minGcoins + '元可用'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="减免上限" v-if="addEvent.type == 3">
                <template slot-scope="scope">
                  <el-input v-model="addEvent.templates[scope.$index].maxDerate" clearable auto-complete="off" class="input-w"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <el-input v-model="addEvent.templates[scope.$index].num" clearable auto-complete="off" class="input-w"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div class="el-form-item__error" v-if="isShowNum">发放数量至少有一个大于0且只能输入1-99999间的数值，不允许输入小数</div>
            <div style="color: #f56c6c;padding-top: 13px;" v-if="isMaxDerate">{{maxDerateErrorTxt}}</div>
          </template>
        </el-form-item>
        <el-form-item label="有效期：" class="form-item-m" prop="date">
          <el-date-picker v-model="addEvent.date" :picker-options="pickerBeginDateAfter" type="daterange" range-separator="至" value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效时段：" class="form-item-m" prop="time">
          <el-time-picker is-range v-model="addEvent.time" value-format="HH:mm" format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="发放用户：" class="form-item-m" prop="userType">
          <el-radio-group v-model="addEvent.userType" @change="changeType">
            <el-radio label="0">批量导入</el-radio>
            <el-radio label="1">单个输入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="form-item-m" v-if="isShowAllFile">
          <input type="file" @change="tirggerFile($event)">
          <a href="https://static.qiekj.com/images/template/user.xlsx">
            <el-button type="primary">下载模板</el-button>
          </a>
        </el-form-item>
        <el-form-item class="form-item-m" v-if="isShowoneFile">
          <el-input clearable v-model="addEvent.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer btn-footer">
        <el-button type="submit" @click="handleAdd('addOperator')">确定</el-button>
      </div>
    </el-dialog>

    <!--活动详情 -->
    <el-dialog class="detail-dialog" width="800" title="活动详情" :visible.sync="isShowActivtiyDetal" @close="isShowActivtiyDetal = false">
      <el-form :model="EventData" label-width="114px">
        <el-form-item label="活动名称：">
          <span>{{EventData.name}}</span>
        </el-form-item>
        <el-form-item label="优惠方式：">
          <span>{{EventData.type | ActDiscountType}}</span>
        </el-form-item>
        <el-form-item label="费用承担：">
          <span v-if="EventData.sponsor == 1">平台</span>
          <span v-else-if="EventData.sponsor == 2">运营商</span>
          <span v-else-if="EventData.sponsor == 3">共同承担{{'(平台: ' + EventData.platformRatio + '%, ' + '运营商: ' + EventData.operatorRatio + '%)'}}</span>
        </el-form-item>
        <el-form-item label="有效期：">
          <span>{{EventData.startDate}}至{{EventData.endDate}}</span>
        </el-form-item>
        <el-form-item label="有效时段：">
          <span>{{EventData.startTime}}-{{EventData.endTime}}</span>
        </el-form-item>
        <el-form-item label="类型：">
          <span>{{eventStatus}}</span>
        </el-form-item>
        <el-form-item label="受益用户量：">
          <span>{{EventData.userNum}}</span>
        </el-form-item>
        <el-form-item label="适用范围：">
          <span>{{EventData.useScope === 0 ? '通用' : '指定店铺'}}</span>
        </el-form-item>
        <el-form-item label="店铺名称：">
          <span>{{EventData.shopName ? EventData.shopName : '---'}}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span>{{EventData.createTime}}</span>
        </el-form-item>
        <el-form-item label="创建人：">
          <span>{{EventData.createUserName}}</span>
        </el-form-item>
        <el-form-item label="数量：" style="width:90%">
          <template slot-scope="scope">
            <el-table :data="EventData.templates" border style="width: 100%" class="my-table">
              <el-table-column label="面额" width="180">
                <template slot-scope="scope">
                  <!-- {{EventData.templates[scope.$index].minGcoins == '0.00' ? '免费体验券' : EventData.templates[scope.$index].faceValue + '元'}} -->
                  {{ EventData.type === 2 ? '免费体验券' : EventData.type === 3 ? EventData.templates[scope.$index].faceValue*10+'折' : EventData.templates[scope.$index].faceValue + '元'}}
                </template>
              </el-table-column>
              <el-table-column label="条件">
                <template slot-scope="scope">
                  <span>{{EventData.templates[scope.$index].minGcoins == '0.00' || EventData.type !== 1 ? '无' : '满' + EventData.templates[scope.$index].minGcoins + '元可用'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="减免上线" v-if="EventData.type === 3">
                <template slot-scope="scope">
                  <span>{{EventData.templates[scope.$index].minGcoins}}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  {{ EventData.templates[scope.$index].num }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
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
import { voucherType, ActDiscountType } from '@/utils/Mapping';

export default {
  name: 'page-operator-list',
  mixins: [PagerMixin],
  data() {
    return {
      list: [], // 数据
      total: 0,
      page: 0,
      pageSize: 0,

      //头部搜索
      searchData: {
        name: null,
        username: null,
        startTime: null,
        endTime: null,
        //
        time: null
      },

      // 新增活动
      addEvent: {
        name: null,
        type: null,
        useScope: null,
        shopId: '',
        usePositions: [],
        usePosition: [],
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        file: null,
        phone: null,
        templates: null,

        date: null, // 日期
        time: null, // 时间
        userType: null // 发放用户
      },
      isShopId: false, // 验证店铺
      pickerBeginDateAfter: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isshowrRatio: false,

      addEventRules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { max: 50, message: '活动名称长度不超过50个字符', trigger: 'blur' }],
        type: [{ required: true, message: '请选择优惠方式', trigger: 'change' }],
        useScope: [{ required: true, message: '请选择适用范围', trigger: 'change' }],
        usePositions: [
          {
            type: 'array',
            required: true,
            message: '请选择适用类型',
            trigger: 'change'
          }
        ],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        userType: [{ required: true, message: '请选择发放用户', trigger: 'change' }],
        sponsor: [{ required: true, message: '请选择费用承担', trigger: 'change' }]
      },
      shops: [], // 店铺信息
      formData: null,
      isShowAddEventDialog: false,
      isShowAllFile: false, // 批量导入
      isShowoneFile: false, // 单个导入
      isShowShop: false, // 是否显示店铺名称
      isOneClick: false, // 新增确认按钮是否第一次点击
      isShowNum: false, // 是否显示数量
      isMaxDerate: false, //减免上限校验
      maxDerateErrorTxt: '减免上限必须输入1-999间的数值，支持输入两位小数',
      loading: false,
      // 活动详情
      EventData: {},
      eventStatus: '',
      isShowActivtiyDetal: false
    };
  },
  filters: {
    ActDiscountType(value) {
      return ActDiscountType[value];
    }
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
    async getAreaList(keywords) {
      if (keywords === '') {
        return;
      }
      this.loading = true;
      let resp = await this.$axios.post(Api.SHOP_GETFORNAME, {
        name: keywords
      });
      this.shops = resp || [];
      this.loading = false;
    },
    // 格式化优惠方式
    formatterDiscountType(row, column) {
      return ActDiscountType[row.type];
    },
    // 格式化类型
    formatterStatus(row, column) {
      let status = '';
      if (row.userPositionList != null) {
        let usePosition_List = row.userPositionList.split(',');
        this.status = '';
        usePosition_List.map(item => {
          if (item == 1) {
            status += '洗衣机' + ' ';
          } else if (item == 2) {
            status += '烘干机' + ' ';
          } else if (item == 3) {
            status += '洗鞋机' + ' ';
          } else if (item == 4) {
            status += '吹风机' + ' ';
          } else if (item == 5) {
            status += '充电桩' + ' ';
          } else if (item == 6) {
            status += '饮水机' + ' ';
          } else {
            status = '通用';
          }
        });
      }
      return status;
    },
    // 获取活动列表
    getEventList() {
      this.apiUrl = Api.EVENT_LIST;
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
    // 选择适用类型
    handleType(value) {
      this.getVoucherSelect(value);
    },
    // 根据适用类型获取信息
    getVoucherSelect(usePosition) {
      this.isMaxDerate = false;
      this.isShowNum = false;
      this.$axios.post(Api.VOUCHER_SELECT, { type: this.addEvent.type }).then(resp => {
        resp.forEach((item, i) => {
          item.num = 0;
          item['maxDerate'] = '';
        });
        this.addEvent.templates = resp;
      });
    },
    // 选择发放用户
    changeType(value) {
      if (value == 1) {
        this.isShowoneFile = true;
        this.isShowAllFile = false;
      } else {
        this.isShowAllFile = true;
        this.isShowoneFile = false;
      }
    },
    // 是否选择指定店铺
    handleUseScope(value) {
      if (value == 1) {
        this.getForshop();
        this.isShowShop = true;
      } else {
        this.isShowShop = false;
      }
    },
    // 新增活动弹出框
    openAddOperatorDialog() {
      this.addEvent = {
        name: null,
        type: null,
        sponsor: 1,
        platformRatio: 50,
        operatorRatio: 50,
        useScope: null,
        shopId: null,
        usePositions: [],
        usePosition: [],
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        file: null,
        phone: null,
        templates: null,
        date: null, // 日期
        time: ['00:00', '23:59'],
        userType: null // 发放用户
      };
      this.isShowAddEventDialog = true;
    },
    // 导入excel文件
    tirggerFile(event) {
      var file = event.target.files;
      this.addEvent.file = file[0];
    },
    // 添加活动提交
    handleAdd() {
      this.$refs.addOperator.validate(valid => {
        if (valid) {
          var flag = true;
          var reg = /^[1-9]\d*$/; // 验证正整数
          var reg_phone = /^1\d{10}$/; // 验证手机号码
          let data = DataUtils.clone(this.addEvent);
          data.usePosition = data.usePositions.join(',');
          data.startTime = this.addEvent.time ? this.addEvent.time[0] : null;
          data.endTime = this.addEvent.time ? this.addEvent.time[1] : null;
          data.startDate = this.addEvent.date ? this.addEvent.date[0] : null;
          data.endDate = this.addEvent.date ? this.addEvent.date[1] : null;
          this.formData = new FormData();
          // 批量文件上传
          if (this.isShowAllFile) {
            if (this.addEvent.file === undefined || this.addEvent.file === null) {
              this.$message.error('文件不能为空，请重新上传');
              flag = false;
            } else {
              this.formData.append('file', this.addEvent.file);
            }
          }
          // 选择了单个输入
          if (this.isShowoneFile) {
            if (data.phone === undefined || data.phone === null) {
              this.$message.error('请输入手机号码');
              flag = false;
            } else if (!reg_phone.test(data.phone)) {
              this.$message.error('手机号码格式不正确，请重新输入');
              flag = false;
            } else {
              this.formData.append('phone', data.phone);
            }
          }
          // 数量总数
          let total = 0;
          let renum = /^[0-9]*$/;
          let regMaxDerate = /^([0-9]{1}\d*)(\.\d{0,2})?$/;
          for (let i = 0; i < data.templates.length; i++) {
            let item = data.templates[i];
            if (!renum.test(item.num)) {
              this.$message.error('发放数量至少有一个大于0且只能输入1-99999间的数值，不允许输入小数');
              flag = false;
              break;
            }
            if (item.num > 99999) {
              this.$message.error('发放数量至少有一个大于0且只能输入1-99999间的数值，不允许输入小数');
              flag = false;
              break;
            }
            if (data.type == 3 && item.num > 0 && item.maxDerate <= 0.0) {
              this.$message.error('发放数量不为0的折扣券，减免上限必填且大于0');
              flag = false;
              break;
            }
            if (item.maxDerate && !regMaxDerate.test(item.maxDerate)) {
              this.$message.error('减免上限必须输入1-999间的数值，支持输入两位小数');
              flag = false;
              break;
            }
            if (item.maxDerate && item.maxDerate > 999) {
              this.$message.error('减免上限必须输入1-999间的数值，支持输入两位小数');
              flag = false;
              break;
            }
            if (item.num) total += parseFloat(item.num);
            this.formData.append(`templates[${i}].tempId`, item.id);
            this.formData.append(`templates[${i}].num`, item.num);
            this.formData.append(`templates[${i}].maxDerate`, item.maxDerate);
          }
          if (flag && total <= 0) {
            this.$message.error('发放数量至少有一个大于0且只能输入1-99999间的数值，不允许输入小数');
            flag = false;
          }
          // 选择指定店铺，并选择了店铺
          if (data.useScope === 1 && data.shopId != null) {
            this.isShopId = false;
            this.formData.append('shopId', data.shopId);
          } else if (data.useScope === 1 && data.shopId == null) {
            this.isShopId = true;
          }
          // 验证平台+运营商的百分比
          if (data.sponsor === 3) {
            let total = 0;
            total = parseFloat(data.platformRatio) + parseFloat(data.operatorRatio);
            if (data.platformRatio === undefined || data.platformRatio === null) {
              this.$message.error('平台百分比不能为空');
              flag = false;
            } else if (!reg.test(Number(data.platformRatio))) {
              this.$message.error('平台百分比必须为大于0的整数');
              flag = false;
            } else if (data.operatorRatio === undefined || data.operatorRatio === null) {
              this.$message.error('运营商百分比不能为空');
              flag = false;
            } else if (!reg.test(Number(data.operatorRatio))) {
              this.$message.error('运营商百分比必须为大于0的整数');
              flag = false;
            } else {
              if (total > 100 || total < 100) {
                this.$message.error('平台加运营商百分比必须等于100');
                flag = false;
              }
            }
          }
          if (!flag) {
            return;
          }
          this.formData.append('name', data.name);
          this.formData.append('type', data.type);
          this.formData.append('sponsor', data.sponsor);
          this.formData.append('platformRatio', data.platformRatio);
          this.formData.append('operatorRatio', data.operatorRatio);
          this.formData.append('useScope', data.useScope);
          this.formData.append('usePosition', data.usePosition);
          this.formData.append('startDate', data.startDate);
          this.formData.append('endDate', data.endDate);
          this.formData.append('startTime', data.startTime);
          this.formData.append('endTime', data.endTime);
          this.$axios.post(Api.EVENT_ADD, this.formData).then(_ => {
            this.isOneClick = true;
            this.isShowAddEventDialog = false;
            this.isShowAllFile = false;
            this.addEvent = {
              name: null,
              type: 1,
              useScope: null,
              shopId: null,
              usePosition: null,
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
              file: null,
              phone: null,
              templates: null,
              date: null, // 日期
              time: ['00:00', '23:59'],
              userType: null // 发放用户
            };
            this.$refs.addOperator.resetFields();
            this.getEventList();
            this.$message({
              showClose: true,
              message: '新增成功！',
              type: 'success'
            });
          });
        }
      });
    },

    // 新增窗口关闭
    handleCancel() {
      this.isShowAddEventDialog = false;
      this.$refs.addOperator.resetFields();
    },
    // 获取所有店铺信息
    getForshop() {
      return this.$axios.post(Api.SHOP_GETFORNAME).then(resp => {
        this.shops = resp;
      });
    },
    // 查看活动详情
    openEventDetailDialog(id) {
      if (this.getPerm('dal:event:details')) {
        if (id != '') {
          return this.$axios
            .post(Api.EVENT_DETAILS, {
              id: id
            })
            .then(resp => {
              this.isShowActivtiyDetal = true;
              this.EventData = resp;
              if (this.EventData.usePositionList && this.EventData.usePositionList.length > 0) {
                let usePosition_List = this.EventData.usePositionList.split(',');
                this.eventStatus = '';
                usePosition_List.map(item => {
                  if (item == 1) {
                    this.eventStatus += '洗衣券' + ' ';
                  } else if (item == 2) {
                    this.eventStatus += '烘干券' + ' ';
                  } else if (item == 3) {
                    this.eventStatus += '洗鞋券' + ' ';
                  } else if (item == 4) {
                    this.eventStatus += '吹风机券' + ' ';
                  } else if (item == 5) {
                    this.eventStatus += '充电桩券' + ' ';
                  } else if (item == 6) {
                    this.eventStatus += '饮水机' + ' ';
                  } else {
                    this.eventStatus = '通用';
                  }
                });
              }
            });
        }
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
          exportExcel(Api.EVENT_ExCEL, '活动列表总览.xlsx', query);
        }
      });
    }
  },
  computed: {
    platformRatio() {
      return this.addEvent.platformRatio;
    },
    operatorRatio() {
      return this.addEvent.operatorRatio;
    },
    ActDiscountType() {
      return ActDiscountType;
    },
    ...mapGetters('user', ['getPerm'])
  },
  watch: {
    platformRatio(newValue, oldValue) {
      let reg = /^[1-9]\d*$/;
      if (reg.test(newValue)) {
        if (0 < newValue < 100) {
          this.isshowrRatio = false;
          this.addEvent.operatorRatio = 100 - parseFloat(newValue);
        }
      } else {
        this.isshowrRatio = true;
        this.addEvent.operatorRatio = null;
      }
    },
    operatorRatio(newValue, oldValue) {
      let reg = /^[1-9]\d*$/;
      if (reg.test(newValue)) {
        if (0 < newValue < 100) {
          this.isshowrRatio = false;
          this.addEvent.platformRatio = 100 - parseFloat(newValue);
        }
      } else {
        this.isshowrRatio = true;
        this.addEvent.platformRatio = null;
      }
    }
  },
  components: {
    QBreadcrumb,
    QShopSelect
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
.detail-dialog {
  .el-dialog {
    width: 800px;
    .el-form {
      overflow: hidden;
      .el-form-item {
        width: 50%;
        float: left;
      }
    }
  }
}
.addActivity-dialog {
  .el-dialog {
    width: 60% !important;
  }
}
</style>
