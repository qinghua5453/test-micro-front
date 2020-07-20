/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const shopsListApi = "shop/getForName"; //店铺列表
const billsListApi = "settlement/detergent/monthBillList"; //洗衣液分账账单列表
const dellBillsApi = "settlement/detergent/monthBillSettle"; //洗衣液分账账单结算
export const exportBillsApi = "settlement/detergent/monthBillExport"; //洗衣液分账账单列表导出

const detailListApi = "settlement/detergent/billDetailList"; //洗衣液分账账单详情列表
export const exportDetailApi = "settlement/detergent/billDetailExport"; //洗衣液分账账单结算


const incomeListApi = "settlement/detergent/incomeBillList"; //洗衣液收入账单列表
const dellIncomeApi = "settlement/detergent/incomeBillSettle"; //洗衣液收入账单结算
export const exportIncomeApi = "settlement/detergent/incomeBillExport"; //洗衣液收入账单列表导出

const incomeDetailListApi = "settlement/detergent/incomeBillDetailList"; //洗衣液收入账单详情列表
export const incomeDetailexportApi = "settlement/detergent/incomeBillDetailExport"; //洗衣液收入账单详情列表导出


//洗衣液分账账单列表
export const billsListFun = payload => axios.post(billsListApi, payload);
//洗衣液分账账单结算
export const dellBillsFun = payload => axios.post(dellBillsApi, payload);
//洗衣液分账账单列表导出
export const exportBillsFun = payload => axios.post(exportBillsApi, payload);

//洗衣液分账账单详情列表
export const detailListFun = payload => axios.post(detailListApi, payload);
//洗衣液分账账单结算
export const exportDetailFun = payload => axios.post(exportDetailApi, payload);

//洗衣液收入账单列表
export const incomeListFun = payload => axios.post(incomeListApi, payload);
//洗衣液分账账单结算
export const dellIncomeFun = payload => axios.post(dellIncomeApi, payload);
//洗衣液收入账单列表导出
export const exportIncomeFun = payload => axios.post(exportIncomeApi, payload);

//洗衣液收入账单详情列表
export const incomeDetailListFun = payload => axios.post(incomeDetailListApi, payload);
//洗衣液收入账单详情列表导出
export const incomeDetailExportFun = payload => axios.post(incomeDetailexportApi, payload);

//店铺列表
export const shopsListFun = payload => axios.post(shopsListApi, payload);



