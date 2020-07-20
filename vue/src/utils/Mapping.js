/**
 * 数据映射类
 */

//========= 机器 ==========//
// 机器状态
export const MachineStatus = {
  1: '空闲',
  2: '工作',
  3: '暂停',
  4: '故障',
  5: '参数设置',
  6: '自检',
  7: '预约',
  8: '离线',
  9: '删除',
  10: '阿里未激活',
  11: '阿里不存在'
};

// 机器阿里状态
export const MachineAliStatus = {
  0: '未激活',
  1: '在线',
  2: '离线',
  3: '未注册',
  4: '禁用'
};

// 机器模块公司
export const MachineCompany = {
  huiren: '慧人',
  youfang: '有方',
  hezhou: '合宙',
  qiekj: '企鹅'
};

//通信类型
export const MachineType = {
  '0': '脉冲',
  '1': '串口'
};

//============订单============//
// 支付方式
export const PayType = {
  1: '支付宝-生活号',
  11: '支付宝-小程序',
  12: '支付宝-网页',
  13: '支付宝-app',
  2: '余额支付',
  3: '微信-公众号',
  31: '微信-小程序',
  32: '微信-app',
  4: '受限余额支付'
};

export const BDRole = {
  1: '城市经理',
  2: '商务BD',
  3: '大客户',
  4: '富磊',
  5: '其他',
  6: '运维大区经理',
  7: '一级运维',
  8: '二级运维',
  9: '二级运维子账号',
  10: '厂测工程师'
};

export const AddBDRole = {
  1: '城市经理',
  2: '商务BD',
  3: '大客户',
  4: '富磊',
  5: '其他',
  6: '运维大区经理',
  7: '一级运维',
  10: '厂测工程师'
};

export const Orderstatus = {
  0: '未支付',
  1: '已失效',
  2: '已支付',
  3: '已完成',
  4: '申请退款',
  5: '已退款'
};

export const HelpType = {
  1: '用户端',
  2: '运营商端',
  3: '刷脸屏'
};
export const feedbackType = {
  1: '功能意见',
  2: '页面意见',
  3: '操作意见',
  4: '新需求意见',
  5: '其他'
};

//============优惠券============//
export const voucherType = {
  0: '通用',
  1: '洗衣券',
  2: '烘干券',
  3: '洗鞋券',
  4: '吹风机券',
  5: '充电桩券'
};
export const CouponType = {
  0: '未使用',
  1: '已使用',
  2: '已过期',
  3: '冻结'
};

//============vip============//
export const VipType = {
  1: '年卡',
  2: '半年卡',
  3: '季卡'
};

//============shop============//
export const ShopType = {
  1: '未开放',
  2: '营业中',
  3: '关店',
  4: '删除'
};

//============operator============//
export const ConfirmStatus = {
  0: '未认证',
  1: '审核中',
  2: '已认证',
  3: '未通过'
};

// 活动
export const ActType = {
  1: '手动领取',
  2: '抽奖',
  3: '自动发放',
  4: '扫码领券',
  5: '邀友活动',
  6: '弹窗活动'
};
// 活动
export const ActDiscountType = {
  1: '满减劵',
  2: '免费体验券',
  3: '折扣券'
};

export const AttributeType = {
  0: '非联营',
  1: '联营',
  2: '荣事达'
};

export const ActStatus = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
  3: '已暂停'
};

export const ApplyCreditStatus = {
  0: '审核中',
  1: '待发货',
  2: '待收货',
  3: '已完成',
  4: '未通过',
  5: '已退还',
  6: '退还中'
};

export const BDInviteStatus = {
  0: '未使用',
  1: '已使用'
};

export const GenderStatus = {
  0: '男',
  1: '女'
};

export const riskStatus = {
  0: '待处理',
  1: '已处理'
};

export const riskTypeStatus = {
  1: '欺诈 ',
  2: '赌博 ',
  3: '套现 ',
  4: '投诉 '
};

export const riskResultStatus = {
  6: '其他',
  7: '已联系客户，安排退款',
  8: '跟用户沟通后，用户撤诉'
};
export const VindTranStatus = {
  1: '待备料',
  2: '待派单',
  3: '待接单',
  4: '待处理',
  5: '待结单',
  6: '已结单'
};

export const VindTranType = {
  1: '安装单',
  2: '维修单'
};

export const VindCommunicationType = {
  1: '脉冲',
  2: '串口',
  3: '串口(主板+模块)'
};

export const VindremouldTypeType = {
  1: '盒子',
  2: '定制机'
};

// 机器类型
export const MachineTypes = {
  'c9892cb4-bd78-40f6-83c2-ba73383b090a': 1, // 洗衣机
  '4a245cde-538b-47d8-aa35-dd4a28c0e901': 2, // 烘干机
  'ef5b8f13-36ec-44fb-8179-38627abd9be0': 3, // 洗鞋机
  '4eeb1b0a-d006-49cc-bf17-73c20599057b': 4, // 吹风机
  '4eeb1b0a-d006-49cc-bf17-73c20599057c': 5, // 充电桩
  '4eeb1b0a-d006-49cc-bf17-73c20599057e': 6 // 饮水机
};

// 机器类型
export const cloudStatusTypes = {
  0: '不可用',
  1: '可用'
};

// 模块绑定状态
export const modelBindStatus = {
  0: '未绑定',
  1: '已绑定'
};
// 模块绑定状态
export const modelComputeStatus = {
  0: '未计算',
  1: '正常',
  2: '频繁离线',
  3: '长离线'
};
// 模块状态
export const modelImeiStatus = {
  1: '在线',
  2: '离线',
  4: '故障'
};
// 是否支持洗衣液和蓝牙
export const modelSupportStatus = {
  false: '不支持',
  true: '支持'
};
// 第三方状态
export const modelThirdStatus = {
  0: 'IOT已注册，没有激活',
  1: 'IOT在线',
  2: 'IOT离线',
  3: 'IOT未注册 ',
  4: 'IOT禁用 '
};

// 网络
export const netWorkStatus = {
  2: '2G',
  4: '4G',
};
// 网络
export const addvertiseSoltStatus = {
  1: '上架',
  0: '下架',
};
export const addvertiseLinkType = {
  1: '普通url',
  2: '站外小程序',
};


export const businessType = {
  1: '免费',
  2: '收费',
  3: '卖返',
  4: '维修',
  5: '改造',
  6: '研发测试',
  7: '退旧售新',
  8: '备用(样品)',
  9: '其他',
};

export const warehouseStatusType = {
  0: '已发货',
  1: '已退货',
};

export const tfqStatusType = {
  10: '空闲',
  20: '工作中',
  30: '故障',
};
export const tfqBindStatusType = {
  10: '停用',
  30: '启用',
};
export const tfqSoldStateType = {
  1: '启用',
  2: '停用',
};
export const tfqChannelStatusType = {
  1: '缺液',
  2: '关闭',
  3: '锁定',
};
export const skusStatus = {
  1: '开启',
  2: '关闭'
};
export const tfqDetailChannelStatus = {
  0: '关闭',
  1: '开启'
};
export const trafficOrderStatusType = {
  0: '未支付',
  2: '已支付',
};

export const activationCodeStatusType = {
  0: '未激活',
  1: '已激活',
};

export const detergentQtyType = {
  2000: '2000ml',
  3000: '3000ml',
};

export const assetStatusType = {
  0: '未入库',
  1: '已入库',
  2: '已出库',
  3: '已上线',
  4: '已报废',
  5: '维修中',
}

export const assetCurStatusType = {
  0: '未入库',
  1: '已入库',
  2: '已出库',
  9: '已报废',
  // 8: '维修中',
}

export const assetType = {
  10: '洗衣液投放器',
  // 100: '模块',

}

export const slotExhibitionType = {
  1:'单图',
  2:'轮播',
  3:'概率'
}


export const companystatus = {
  false:'停用',
  true:'启用',
}

export const companyType = {
  10:'供应商',
  20:'经销商',
}

// 商机
export const biddingStatus = {
  0:'未发布',
  1:'已发布',
  3:'待筛选',
  5:'已失效',
}

// 指令类型<0 模块请求 1 查询状态 2 无 3 设置参数 4 设置状态 5 启动 9 其他>
export const modelFunctionType = {
  0: '模块请求',
  1: '查询状态',
  3: '设置参数',
  4: '设置状态',
  5: '启动'
}
export const industryStatus = {
  0:'未发布',
  1:'已发布',
}
export const demandStatus = {
  2:'待审核',
  1:'已通过',
  4:'已驳回',
}
// 网络状态类型
export const networkSearchStatus = {
  1: '在线',
  3: '离线',
  2: '频繁离线',
  0: '未注册',
};
