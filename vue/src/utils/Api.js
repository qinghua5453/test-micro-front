/**
 *
 * Api 接口常量
 */

const Api = {
  // COMMON
  LOGIN: 'sys/login',
  GET_AUTH_MENU: 'sys/menu/perms',
  COMMON_UPLOAD: 'common/uploadFile',

  // 运营商管理
  OPERATOR_LIST: 'operator/list',
  OPERATOR_DETAILS: 'operator/details',
  ADD_OPERATOR: 'operator/add',
  UPDATE_OPERATOR: 'operator/update',
  RESET_PWD: 'operator/resetPWD',
  OPERATOR_EXAMINE: 'operator/examine',
  EXPORT_OPERATOR: 'operator/excel',
  OPERATOR_NAME: 'operator/getForName',
  OPERATOR_DELETE: 'operator/delete',
  OPERATOR_APPROVE: 'operator/approve',
  SYS_USER_SELECT: 'sys/user/select',

  // 店铺管理
  SHOP_LIST: 'shop/list',
  SHOP_DETAILS: 'shop/details',
  AREA_LIST: 'common/areaList',
  WECHATPAY_OPEN: 'shop/wechatPayOpen',
  SHOP_DELETE: 'shop/delete',
  SHOP_ADD: 'shop/add',
  SHOP_GETFORNAME: 'shop/getForName',
  SHOP_UPDATE: 'shop/update',
  GET_SHOP_TYPE: 'shop/getShopTypeList',
  EXPORT_SHOP: 'shop/excel',
  PROFIT_LIST: 'shop/profitList',
  SHOP_relationBD: 'shop/relationBD',
  SHOP_CHECKLIST: 'shop/checkList',
  SHOP_GETFORLDSBYPAGE: 'shop/getForIdsByPage',
  MEMBER_EVENT_SHOPLIST: 'member-event/shopList',

  // 设备管理
  MACHINE_LIST: 'machine/list',
  MACHINE_GETTYPELIST: 'machine/getTypeList',
  MACHINE_BATCHUPDATE: 'machine/batchUpdate',
  MACHINE_DETAILS: 'machine/details',
  MACHINE_UPDATE: 'machine/update',
  MACHINE_WECHATPAY: 'machine/wechatPayOpen',
  MACHINE_DELETE: 'machine/delete',
  EXPORT_MACHINE: 'machine/excel',
  MACHINE_BATCHTYPE: 'machine/batchType', // 类型批量操作
  MACHINE_BATCHSHOP: 'machine/batchShop', // 店铺批量操作
  MACHINE_BATCHWECHAT: 'machine/batchWechat', // 微信批量操作
  MACHINE_BATCHDELETE: 'machine/batchDelete', // 删除批量操作
  MACHINE_IMEILOG: 'machine/imeiLog', // 删除批量操作

  // gaoqing
  MACHINE_IOT: 'machine/iot', // 发送iot指令

  // 订单管理
  ORDER_LSIT: 'order/list',
  ORDER_COMPENSATE: 'order/compensate',
  ORDER_REFUND: 'order/refund',
  ORDER_DETAILS: 'order/details',
  EXPORT_ORDER: 'order/excel',
  ORDER_HISTORY: 'order/history/select',
  //退款记录
  REFUND_LIST: 'order/refundList',
  REFUND_DETAILS: 'order/refunDetails',
  REFUND_EXPORT: 'order/refundExcl',
  ORDER_PAYTYPE: 'order/payType/list',

  //补偿记录
  COMPENSATE_LIST: 'order/compensateList',
  COMPENSATE_DETAILS: 'order/compensateDetails',
  COMPENSATE_EXPORT: 'order/compensateExcl',

  //BD
  BD_LIST: 'vind/user/list',
  BD_ADD: 'vind/user/add',
  BD_DELETE: 'vind/user/delete',
  BD_UPDATE: 'vind/user/update',
  BDINVITE_LIST: 'invite/list',
  BDINVITE_ADD: 'invite/add',
  BD_MACHINE_TYPE: '/machineType/list',
  BD_DETAIL: '/vind/user/details',

  //帮助中心
  HELP_LIST: 'help/list',
  HELP_ADD: 'help/add',
  HELP_DELETE: 'help/delete',
  HELP_UPDATE: 'help/update',
  HELP_DETAIL: 'help/detail',
  HELP_TAG_LIST: 'tag/list',
  HELP_TAG_CREATE: 'tag/create',

  // 获取各自常量状态
  COMMON_CONSTANT: 'common/constant',
  // 发送验证码
  COMMON_CODE: 'common/smsCode',

  MACHINE_RESETMACHINE: 'machine/resetMachine',
  MACHINE_STAUTSMACHINE: 'machine/stautsMachine',
  MEMBER_LIST: 'member/list',
  MEMBER_TRIGGER: 'member/trigger',
  EXPORT_MEMBER: '/member/excel',
  // 用户vip
  VIP_MEMBER_LIST: 'vip/member-list',
  VIP_MEMBER_ExCEL: 'vip/member-excel',
  VIP_MEMBER_SHOPs: 'vip/shops',

  // 设备列表
  MACHINETYPE_LIST: 'machineType/list',
  // 设置 --一级类型
  MACHINETYPE_STAIRS: 'machineType/stairs',
  MACHINETYPE_STAIRS_ADD: 'machineType/stairsAdd',
  MACHINETYPE_STAIRS_EDIT: 'machineType/stairsEdit',
  MACHINETYPE_DELETE: 'machineType/delete',
  MACHINETYPE_DETAILS: 'machineType/details',

  // 设置 --二级类型
  MACHINETYPE_SECONDS: 'machineType/seconds',
  MACHINETYPE_SECONDSDETAILS: 'machineType/secondsDetails',
  MACHINETYPE_EDIT: 'machineType/secondsEdit',
  MACHINETYPE_ADD: 'machineType/secondsAdd',

  // 设置 -- 标准功能模块
  FUNCTION_LIST: 'funtion/list',
  FUNCTION_ADD: 'funtion/add',
  FUNCTION_EDIT: 'funtion/edit',
  FUNCTION_DETAILS: 'funtion/details',
  FUNCTION_DELETE: 'funtion/delete',
  FUNCTION_ORIGINALS: 'funtion/originals',

  // 设置 -- 附加功能
  ATTACH_LIST: 'attach/list',
  ATTACH_ADD: 'attach/add',
  ATTACH_EDIT: 'attach/edit',
  ATTACH_DELETE: 'attach/delete',

  // 提现管理
  MONEY_LIST: 'money/list',
  MONEY_CHANGE: 'money/change',
  MONEY_PAYLIST: 'money/payList',
  MONEY_CHANGENEW: 'money/changeNew',
  MONEY_EXPORT: 'money/excel',
  PAYLIST_EXPORT: 'money/payListExcel',
  PAYLIST_HANDLE_TRANSFER: 'money/handleTransfer',

  // 成员管理
  GET_MEMBER_LIST: 'sys/user/list',
  GET_MEMBER_DETAIL: 'sys/user/info',
  ADD_MEMBER: '/sys/user/save',
  UPDATE_MEMBER: '/sys/user/update',
  REMOVE_MEMBER: '/sys/user/delete',
  USER_RESET: '/sys/user/reset',

  // 修改密码
  USER_CHANGE_PWD: '/sys/user/password',

  // 角色管理
  GET_ROLE_LIST: 'sys/role/list',
  GET_ROLE_DETAIL: 'sys/role/info',
  ADD_ROLE: 'sys/role/save',
  UPDATE_ROLE: 'sys/role/update',
  REMOVE_ROLE: 'sys/role/delete',
  GET_MENU_LIST: 'sys/menu/list',

  // 部门

  // 优惠券配置
  VOUCHER_LIST: 'voucher/list',
  VOUCHER_ADD: 'voucher/add',
  VOUCHER_UPDATE: 'voucher/update',
  VOUCHER_DELETE: 'voucher/delete',
  VOUCHER_DETAILS: 'voucher/details',
  VOUCHER_SELECT: 'voucher/select',
  VOUCHER_ExCEL: 'voucher/excel',

  EVENT_LIST: 'event/list',
  EVENT_ADD: 'event/add',
  EVENT_DETAILS: 'event/details',
  EVENT_ExCEL: 'event/excel',

  VOUCHERUSER_LIST: 'voucheruser/list',
  VOUCHERUSER_ExCEL: 'voucheruser/excel',
  VOUCHERUSER_DELETE: 'voucheruser/delete',
  VOUCHERUSER_USABLE: 'voucheruser/usable',

  // 活动
  MEMBER_EVENT_LIST: 'member-event/list',
  MEMBER_EVENT_ExCEL: 'member-event/excel',
  MEMBER_EVENT_ADD: 'member-event/add',
  MEMBER_EVENT_EDIT: 'member-event/update',
  SHOP_GETFORKEYWORD: 'shop/getForKeyword',
  MEMBER_EVENT_DETAILS: 'member-event/details',
  SHOP_GETFORIDS: 'shop/getForIds',
  MEMBER_EVENT_DELETE: 'member-event/delete',
  MEMBER_ASSOC_LIST: 'member-assoc/list',
  MEMBER_ASSOC_ExCEL: 'member-assoc/excel',
  MEMBER_EVENT_PAUSE: 'member-event/pause',
  MEMBER_EVENT_LINK: 'member-event/link',
  SHOP_GET_CONDTION: 'shop/getForCondition',
  MEMBER_EVENT_SHOP: 'member-event/shops',
  MEMBER_INVITE_LIST: 'member-invite/list',

  // 信用租
  APPLY_LIST: 'userApply/listApplyOrder',
  APPLY_INFOR: 'userApply/getApplyOrderInfo',
  APPLY_LOG: 'userApply/getApplyOrderLog',
  APPLY_ExCEL: 'userApply/excel',
  APPLY_SNED: 'userApply/send',
  APPLY_REBVIEW: 'userApply/review',
  APPLY_CONFIRM: 'userApply/confirm',
  APPLY_BACK: 'userApply/back',

  //二维码管理
  QRCODE_LIST: 'qrCode/list',
  ADD_NQT: 'qrCode/add',
  QRCODE_DOWNLOAD: 'qrCode/detailsExcel',
  QRCODE_GENERATE: 'qrCode/generate',
  //统计
  HOME_TOTAL: 'statis/total',
  HOME_ORDER: 'statis/indexOrder',
  HOME_DEVICE: 'statis/indexDevice',
  HOME_USER: 'statis/indexUser',
  ORDER_STATIS_LIST: 'statis/listValidOrder',
  ORDER_NEW_USER_STATIS: 'statis/listNewValidOrder',
  ORDER_AREA_STATIS: 'statis/listAreaValidOrder',
  ORDER_PAY_STATIS: 'statis/listPayTypeOrder',
  ORDER_REFUND_STATIS: 'statis/listRefundCompensateOrder',
  USER_NEW_USER_STATIS: 'statis/listAddUser',
  USER_ACTIVE_STATIS: 'statis/listActiveUser',
  USER_REBUY_STATIS: 'statis/listRebuyUser',
  USER_VIP_STATIS: 'statis/listVipUser',
  USER_FREQUENCY_STATIS: 'statis/listFrequencyUser',
  DEVICE_NEW_STATIS: 'statis/listAddDevice',
  DEVICE_ACTIVE_STATIS: 'statis/listActiveDevice',
  DEVICE_STATUS_STATIS: 'statis/getStatusDevice',
  DEVICE_FREQUENCY_STATIS: 'statis/listFrequencyDevice',
  LIQUID_PAY_STATIS: 'settlement/detergent/incomeStats',
  LIQUID_EXPORT_STATIS: 'settlement/detergent/incomeStatsExport',

  //支付宝订单客诉
  RISK_LIST: 'risk/list',
  RISK_HANDLE: 'risk/handle',
  RISK_EXCEL: 'risk/excel',
  //工单管理
  VIND_LIST: 'vind/trans/list',
  VIND_DETAILS: 'vind/trans/details',

  //新类型
  CLOUD_CATEGORY: 'cloud/model/category/list',
  CLOUD_SUB_CATEGORY: 'cloud/model/list',
  CLOUD_SUB_CATEGORY_DETAIL: 'cloud/model/detail/',
  CLOUD_SUB_CATEGORY_ADD: 'cloud/model/add',
  CLOUD_SUB_CATEGORY_EDIT: 'cloud/model/edit',
  CLOUD_MACHINE_START: 'cloud/machine/module/start', //模块下发指令(串口)
  CLOUD_MODULE_DETAIL: 'cloud/machine/module/', //设备分类详情
  CLOUD_MODEL_FUNCTION_LIST: 'cloud/model/function/list', //设备型号功能列表((串口)
  CLOUD_MODEL_FUNCTION_DETAIL: 'cloud/model/function/detail/', //设备型号功能列表((串口)
  CLOUD_MODEL_FUNCTION_ADD: 'cloud/model/function/add',
  CLOUD_MODEL_FUNCTION_EDIT: 'cloud/model/function/edit',
  CLOUD_MACHINE_LIST: 'cloud/machine/list', //获取设备列表
  CLOUD_MODULE_LIST: 'cloud/module/list', //获取模块列表
  CLOUD_MODULE_CCID: 'cloud/module/ccid', //模块网卡详情


  UPDATE_APP: 'common/updateApp', //设备型号功能列表((串口)


  //广告
  SOLT_APP_LIST: 'slot/app/list',
  SOLT_CONFIG_LIST: 'slot/config/list',
  SOLT_LIST: 'slot/list',
  SOLT_CONFIG_ADD: 'slot/config/add/form',
  SOLT_CONFIG_EDIT: 'slot/config/edit/form',
  SOLT_CONFIG_CHANGE: 'slot/config/status',
  SOLT_CONFIG_GET: '/slot/config/get',

  //发货管理
  SHIP_LIST: '/ship/list',
  SHIP_BD_CONFIRM: '/ship/bd/confirm',
  SHIP_ADD: '/ship/add',
  SHIP_DETAILS: '/ship/shipDetails',
  SHIP_RETURN_ADD: '/ship/return/add',

  //返利
  REBATE_LIST: 'module/rebate/statistics/list',
  REBATE_LIST_EXPORT: 'module/rebate/statistics/list/export',
  REBATE_DETAILS: 'module/rebate/statistics/detail',
  REBATE_DETAILS_EXPORT: 'module/rebate/statistics/detail/export',
  REBATE_GET_DETAIL: 'module/rebate/standard/detail',
  REBATE_CONFIG_LIST: 'module/rebate/standard/list',
  REBATE_CONFIG_EDIT: 'module/rebate/standard/edit',
  REBATE_STATUS_APDATE: 'module/rebate/statistics/update',

  //提成
  BD_PROFIT_LIST: 'module/bd/statistics/list',
  BD_PROFIT_LIST_EXPORT: 'module/bd/statistics/list/export',
  //费率
  WITHDRAWAL_RATE: 'withdrawal/list',
  WITHDRAWAL_RATE_SET: 'withdrawal/setting/rate',
  WITHDRAWAL_RATE_LIST: 'withdrawal/rates',
  WITHDRAWAL_EXPORT: 'withdrawal/excel',
  NEW_COUPON_CREATE: 'coupon/create',
  NEW_COUPON_SEND:'coupon/activate',
  NEW_COUPON_DETAIL:'coupon/get',
  NEW_COUPON_LIST:'coupon/find',
  NEW_COUPON_UPDATE:'coupon/update',
  SHOP_ORG: 'shop/org/area',
  //模块流量费
  TRAFFIC_SET_LIST:'withdrawal/traffic/amounts',
  TRAFFIC_SET:'withdrawal/setting/traffic/amount',
  MODULE_TRAFFIC_LIST:'module/traffic/list',
  MODULE_TRAFFIC_RESET:'module/traffic/order/reset',
  MODULE_TRAFFIC_DETAILS_LIST:'module/traffic/details/list',
  MODULE_TRAFFIC_EXPORT:'module/traffic/excel',
  MODULE_TRAFFIC_DETAILS_EXPORT:'module/traffic/details/excel',


};

export default Api;
