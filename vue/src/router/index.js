
const Index = r => require.ensure([], () => r(require('@/pages/Index')), 'Index');
const Login = r => require.ensure([], () => r(require('@/pages/Login')), 'Login');
const Home = r => require.ensure([], () => r(require('@/pages/Home')), 'Home');
const Shop = r => require.ensure([], () => r(require('@/pages/shop/ShopList')), 'Shop');
const Operator = r => require.ensure([], () => r(require('@/pages/operator/OperatorList')), 'Operator');
const Device = r => require.ensure([], () => r(require('@/pages/device/DeviceList')), 'Device');
const Order = r => require.ensure([], () => r(require('@/pages/order/OrderList')), 'Order');
const OrderRefund = r => require.ensure([], () => r(require('@/pages/order/OrderRefund')), 'OrderRefund');
const OrderCompensate = r => require.ensure([], () => r(require('@/pages/order/OrderCompensate')), 'OrderCompensate');
const alirisk = r => require.ensure([], () => r(require('@/pages/order/Riskgo')), 'alirisk');
const Withdraw = r => require.ensure([], () => r(require('@/pages/financeManage/withdraw/index')), 'Withdraw');
const MoneyList = r => require.ensure([], () => r(require('@/pages/financeManage/moneyList/index')), 'MoneyList');
const User = r => require.ensure([], () => r(require('@/pages/user/UserList')), 'User');
const VipList = r => require.ensure([], () => r(require('@/pages/user/VipList')), 'VipList');
const CreditList = r => require.ensure([], () => r(require('@/pages/user/CreditList')), 'CreditList');
const Password = r => require.ensure([], () => r(require('@/pages/Password')), 'Password');
const ChangePwd = r => require.ensure([], () => r(require('@/pages/ChangePwd')), 'ChangePwd');
const Member = r => require.ensure([], () => r(require('@/pages/member/MemberList')), 'Member');
const RoleList = r => require.ensure([], () => r(require('@/pages/member/RoleList')), 'RoleList');
const BDList = r => require.ensure([], () => r(require('@/pages/erp/BDList')), 'BDList');
const FirstList = r => require.ensure([], () => r(require('@/pages/setting/FirstList')), 'FirstList');
const SecondList = r => require.ensure([], () => r(require('@/pages/setting/SecondList')), 'SecondList');
const ModelList = r => require.ensure([], () => r(require('@/pages/setting/model/ModelList')), 'ModelList');
const ModelFunction = r => require.ensure([], () => r(require('@/pages/setting/model/ModelFunction')), 'ModelFunction');
const StandFeaList = r => require.ensure([], () => r(require('@/pages/setting/StandFeaList')), 'StandFeaList');
const AddFeaList = r => require.ensure([], () => r(require('@/pages/setting/AddFeaList')), 'AddFeaList');
const helpList = r => require.ensure([], () => r(require('@/pages/setting/helpCenter/index')), 'helpList');
const opinionList = r => require.ensure([], () => r(require('@/pages/setting/opinionList')), 'opinionList');
const AnviteList = r => require.ensure([], () => r(require('@/pages/setting/AnviteList')), 'AnviteList');
const QrcodeList = r => require.ensure([], () => r(require('@/pages/setting/qrcode/QrcodeList')), 'QrcodeList');
const newQrcodeList = r => require.ensure([], () => r(require('@/pages/setting/newQrcode/QrcodeList')), 'newQrcodeList');
// gaoqing
const DeviceCmd = r => require.ensure([], () => r(require('@/pages/device/Cmd')), 'DeviceCmd');

//营销管理
const Activity = r => require.ensure([], () => r(require('@/pages/marketing/Activity')), 'Activity');
const NewActivity = r => require.ensure([], () => r(require('@/pages/marketing/NewActivity')), 'NewActivity');
const CouponList = r => require.ensure([], () => r(require('@/pages/marketing/CouponList')), 'CouponList');
const CouponSet = r => require.ensure([], () => r(require('@/pages/marketing/CouponSet')), 'CouponSet');
const newCouponList = r => require.ensure([], () => r(require('@/pages/marketing/coupon/index')), 'newCouponList');

//数据统计

const OrderStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/index')), 'OrderStatis');
const firmorderStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/FirmOrder')), 'firmorderStatis');
const newuserorderStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/NewUser')), 'newuserorderStatis');
const areaStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/ArerOrder')), 'areaStatis');
const paymentStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/Payment')), 'paymentStatis');
const refundStatis = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/refund')), 'refundStatis');
const liquid = r => require.ensure([], () => r(require('@/pages/statistics/orderStatis/liquid')), 'liquid');

const machineStatis = r => require.ensure([], () => r(require('@/pages/statistics/machineStatis/index')), 'machineStatis');
const newmachineStatis = r => require.ensure([], () => r(require('@/pages/statistics/machineStatis/NewMachine')), 'newmachineStatis');
const activemachineStatis = r => require.ensure([], () => r(require('@/pages/statistics/machineStatis/activeMachine')), 'activemachineStatis');
const machinestatusStatis = r => require.ensure([], () => r(require('@/pages/statistics/machineStatis/machineStatus')), 'machinestatusStatis');
const machinerangeStatis = r => require.ensure([], () => r(require('@/pages/statistics/machineStatis/frequency')), 'machinerangeStatis');

const userStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/index')), 'userStatis');
const newuserStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/newUser')), 'newuserStatis');
const activeuserStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/activeUser')), 'activeuserStatis');
const rebuyStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/reBuy')), 'rebuyStatis');
const vipuserStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/vip')), 'vipuserStatis');
const frequencyStatis = r => require.ensure([], () => r(require('@/pages/statistics/userStatis/frequency')), 'frequencyStatis');
const vindtranslist = r => require.ensure([], () => r(require('@/pages/erp/WorkOrder')), 'vindtranslist');
const appversion = r => require.ensure([], () => r(require('@/pages/appversion')), 'appversion');
const moduleList = r => require.ensure([], () => r(require('@/pages/device/moduleList')), 'moduleList');
const advertisList = r => require.ensure([], () => r(require('@/pages/advertising/advertisList/index')), 'advertisList');

const invoiceList = r => require.ensure([], () => r(require('@/pages/invoice/invoiceList/index')), 'invoiceList');
const invoiceDetails = r => require.ensure([], () => r(require('@/pages/invoice/invoiceDetails/index')), 'invoiceDetails');
const rebateList = r => require.ensure([], () => r(require('@/pages/financeManage/rebate/rebateList/index')), 'rebateList');
const rebateDetail = r => require.ensure([], () => r(require('@/pages/financeManage/rebate/rebateDetail/index')), 'rebateDetail');
const profitList = r => require.ensure([], () => r(require('@/pages/financeManage/profit/index')), 'profitList');
const rateList = r => require.ensure([], () => r(require('@/pages/financeManage/rate/index')), 'rateList');
const moduleTraffic = r => require.ensure([], () => r(require('@/pages/financeManage/moduleFlow/flowCharge/index')), 'moduleTraffic');
const trafficDetails = r => require.ensure([], () => r(require('@/pages/financeManage/moduleFlow/flowChargeDetail/index')), 'trafficDetails');
const detergentSet = r => require.ensure([], () => r(require('@/pages/detergentManage/detergentSet/index')), 'detergentSet');
const activationCode = r => require.ensure([], () => r(require('@/pages/detergentManage/activationCode/index')), 'activationCode');
const dispenserDevice = r => require.ensure([], () => r(require('@/pages/dispenserManage/dispenserDevice/index')), 'dispenserDevice');

const assetList = r => require.ensure([], () => r(require('@/pages/assetManage/assetList/index')), 'assetList');

const stockList = r => require.ensure([], () => r(require('@/pages/stockManage/stockList/index')), 'stockList');
const stockDetail = r => require.ensure([], () => r(require('@/pages/stockManage/stockList/detail')), 'stockDetail');

const warehouseList = r => require.ensure([], () => r(require('@/pages/stockManage/warehouse/index')), 'warehouseList');
const warehouseDetail = r => require.ensure([], () => r(require('@/pages/stockManage/warehouse/detail')), 'warehouseDetail');
const warehouseLog = r => require.ensure([], () => r(require('@/pages/stockManage/warehouse/log')), 'warehouseLog');
const addWarehouse = r => require.ensure([], () => r(require('@/pages/stockManage/warehouse/addWarehouse')), 'addWarehouse');

const outboundOrderList = r => require.ensure([], () => r(require('@/pages/stockManage/outboundOrder/index')), 'outboundOrderList');
const outboundOrderDetail = r => require.ensure([], () => r(require('@/pages/stockManage/outboundOrder/detail')), 'outboundOrderDetail');
const outboundOrderLog = r => require.ensure([], () => r(require('@/pages/stockManage/outboundOrder/log')), 'outboundOrderLog');
const addOutboundOrder = r => require.ensure([], () => r(require('@/pages/stockManage/outboundOrder/addOutboundOrder')), 'addOutboundOrder');

const company = r => require.ensure([], () => r(require('@/pages/company/companyList/index')), 'company');
const classification = r => require.ensure([], () => r(require('@/pages/stockManage/classification/index')), 'classification');

const goodsList = r => require.ensure([], () => r(require('@/pages/goodsManage/goodsList/index')), 'goodsList');
const goodsType = r => require.ensure([], () => r(require('@/pages/goodsManage/goodsType/index')), 'goodsType');

const experience = r => require.ensure([], () => r(require('@/pages/businessManage/experience/index')), 'experience');
const editIndustry = r => require.ensure([], () => r(require('@/pages/businessManage/experience/editIndustry')), 'editIndustry');
const industryDetail = r => require.ensure([], () => r(require('@/pages/businessManage/experience/industryDetail')), 'industryDetail');

const bidding = r => require.ensure([], () => r(require('@/pages/businessManage/bidding/index')), 'bidding');
const editBiddings = r => require.ensure([], () => r(require('@/pages/businessManage/bidding/editBiddings')), 'editBiddings');
const biddingsDetail = r => require.ensure([], () => r(require('@/pages/businessManage/bidding/biddingsDetail')), 'biddingsDetail');
const demand = r => require.ensure([], () => r(require('@/pages/businessManage/demand/index')), 'demand');
const editDemand = r => require.ensure([], () => r(require('@/pages/businessManage/demand/editDemand')), 'editDemand');
const demandDetail = r => require.ensure([], () => r(require('@/pages/businessManage/demand/demandDetail')), 'demandDetail');

const billsList = r => require.ensure([], () => r(require('@/pages/billManage/billsList/index')), 'billsList');
const billsDetail = r => require.ensure([], () => r(require('@/pages/billManage/billsList/billsDetail')), 'billsDetail');

const incomeList = r => require.ensure([], () => r(require('@/pages/billManage/incomeList/index')), 'incomeList');

const subsList = r => require.ensure([], () => r(require('@/pages/subsManage/subsList/index')), 'subsList');

let routes = [
    // 登录
    { path: '/login', name: 'login', component: Login },

    // 忘记密码
    { path: '/password', name: 'password', component: Password },

    // 修改密码
    { path: '/changepwd', name: 'changepwd', component: ChangePwd },

    // 页面
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        // 主页面
        { path: 'home', component: Home },
        { path: 'shop', component: Shop },
        { path: 'operator', component: Operator },
        { path: 'device', component: Device },
        { path: 'order', component: Order },
        { path: 'refund', component: OrderRefund },
        { path: 'alirisk', component: alirisk },
        { path: 'compensate', component: OrderCompensate },
        { path: 'withdraw', component: Withdraw },
        { path: 'moneylist', component: MoneyList },
        { path: 'user', component: User },
        { path: 'viplist', component: VipList },
        { path: 'credit', component: CreditList },
        { path: 'member', component: Member },
        { path: 'rolelist', component: RoleList },
        { path: 'bdlist', component: BDList },
        { path: 'firstlist', component: FirstList },
        { path: 'secondlist', component: SecondList },
        { path: 'model/list', component: ModelList },
        { path: 'model/function/:code', component: ModelFunction },
        { path: 'standfealist', component: StandFeaList },
        { path: 'addfealist', component: AddFeaList },
        { path: 'help', component: helpList },
        { path: 'opinion', component: opinionList },
        { path: 'invite', component: AnviteList },
        { path: 'qrcode', component: QrcodeList },
        { path: 'newQrcode', component: newQrcodeList },
        { path: 'appversion', component: appversion },
        { path: 'module', component: moduleList },
        //营销管理
        { path: 'activity', component: Activity },
        { path: 'new/activity', component: NewActivity },
        { path: 'couponList', component: CouponList },
        { path: 'couponSet', component: CouponSet },
        //gaoqing
        { path: 'device/cmd', component: DeviceCmd },
        //广告列表
        { path: 'slot', component: advertisList },
        { path: 'ship', component: invoiceList },
        { path: 'shipdetail', name: 'invoiceDetails', component: invoiceDetails },
        {
          path: 'orderStatis',
          component: OrderStatis,
          redirect: 'orderStatis/firmorder',
          children: [
            {
              path: 'firmorder',
              name: 'firmorderStatis',
              component: firmorderStatis
            },
            {
              path: 'newuser',
              name: 'newuserorderStatis',
              component: newuserorderStatis
            },
            { path: 'area', name: 'areaStatis', component: areaStatis },
            {
              path: 'payment',
              name: 'paymentStatis',
              component: paymentStatis
            },
            { path: 'refund', name: 'refundStatis', component: refundStatis },
            { path: 'liquid', name: 'liquid', component: liquid }
          ]
        },
        {
          path: 'machineStatis',
          component: machineStatis,
          redirect: 'machineStatis/newmachine',
          children: [
            {
              path: 'newmachine',
              name: 'newmachineStatis',
              component: newmachineStatis
            },
            {
              path: 'activemachine',
              name: 'activemachineStatis',
              component: activemachineStatis
            },
            {
              path: 'machinestatus',
              name: 'machinestatusStatis',
              component: machinestatusStatis
            },
            {
              path: 'machinerange',
              name: 'machinerangeStatis',
              component: machinerangeStatis
            }
          ]
        },
        {
          path: 'userStatis',
          component: userStatis,
          redirect: 'userStatis/newuser',
          children: [
            {
              path: 'newuser',
              name: 'newuserStatis',
              component: newuserStatis
            },
            {
              path: 'activeuser',
              name: 'activeuserStatis',
              component: activeuserStatis
            },
            { path: 'rebuy', name: 'rebuyStatis', component: rebuyStatis },
            {
              path: 'vipuser',
              name: 'vipuserStatis',
              component: vipuserStatis
            },
            {
              path: 'frequency',
              name: 'frequencyStatis',
              component: frequencyStatis
            }
          ]
        },
        { path: 'vindtranslist', name: 'vindtranslist', component: vindtranslist },
        { path: 'rebate', name: 'rebateList', component: rebateList },
        { path: 'rebate/detail', name: 'rebateDetail', component: rebateDetail },
        { path: 'profit', name: 'profitList', component: profitList },
        { path: 'rote', name: 'rateList', component: rateList },
        { path: 'moduleTraffic', name: 'moduleTraffic', component: moduleTraffic },
        { path: 'trafficDetails', name: 'trafficDetails', component: trafficDetails },
        { path: 'new/couponSet', name: 'newCouponList', component: newCouponList },
        { path: 'dispenserList', name: 'dispenserDevice', component: dispenserDevice },
        { path: 'brandConfigList', name: 'detergentSet', component: detergentSet },
        // 激活码列表
        { path: 'activationCodeList', name: 'activationCode', component: activationCode },
        // 资产列表
        { path: 'assetlist', name: 'assetList', component: assetList },
        // 库存列表
        { path: 'stocklist', name: 'stockList', component: stockList },
        { path: 'stocklist/detail', name: 'stockDetail', component: stockDetail },
        // 入库
        { path: 'warehouselist', name: 'warehouseList', component: warehouseList },
        { path: 'warehouselist/detail', name: 'warehouseDetail', component: warehouseDetail },
        { path: 'warehouselist/log', name: 'warehouseLog', component: warehouseLog },
        { path: 'warehouse/add', name: 'addWarehouse', component: addWarehouse },

        // 出库
        { path: 'outboundOrderlist', name: 'outboundOrderList', component: outboundOrderList },
        { path: 'outboundOrderlist/detail', name: 'outboundOrderDetail', component: outboundOrderDetail },
        { path: 'outboundOrderlist/log', name: 'outboundOrderLog', component: outboundOrderLog },
        { path: 'outboundOrder/add', name: 'addOutboundOrder', component: addOutboundOrder },

        // 出库
        { path: 'company', name: 'company', component: company },
        // 存货分类
        { path: 'classification', name: 'classification', component: classification },

        // 网关一拖多-商品
        { path: 'goodsList', name: 'goodsList', component: goodsList },
        { path: 'goodsCategoryList', name: 'goodsCategoryList', component: goodsType },

        // 商机
        { path: 'industry', name: 'industry', component: experience },
        { path: 'editIndustry', name: 'editIndustry', component: editIndustry },
        { path: 'industryDetail', name: 'industryDetail', component: industryDetail },

        { path: 'bidding', name: 'bidding', component: bidding },
        { path: 'editBiddings', name: 'editBiddings', component: editBiddings },
        { path: 'biddingsDetail', name: 'biddingsDetail', component: biddingsDetail },
        { path: 'pairing', name: 'pairing', component: demand },
        { path: 'editDemand', name: 'editDemand', component: editDemand },
        { path: 'demandDetail', name: 'demandDetail', component: demandDetail },
        //洗衣液分账
        { path: 'billsList', name: 'billsList', component: billsList },
        { path: 'billsDetail', name: 'billsDetail', component: billsDetail },

        { path: 'incomeList', name: 'incomeList', component: incomeList },
        { path: 'dispenserRevenue', name: 'dispenserRevenue', component: subsList },
      ]
    }
]

export default routes;
