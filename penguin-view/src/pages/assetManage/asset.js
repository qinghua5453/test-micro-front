/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

export const assetListApi = "erp/asset/list"; //资产列表
export const delAssetApi = "erp/asset/delete/"; //删除资产
export const assetExportApi = "erp/asset/excel"; //资产导出
const scrapApi = "erp/asset/scrap"; //删除资产
const assetLogApi = "erp/asset/assetStatusLog/list"; //日志列表

export const assetReasonsApi = "erp/asset/scrapReasons/"; //资产导出

//资产列表
export const assetListFun = (url, payload) => axios.post(url, payload);
//资产列表
export const assetLogFun = payload => axios.post(assetLogApi, payload);

//删除资产
export const delAssetFun = (url, payload) => axios.post(url, payload);
//删除资产
export const scrapFun = payload => axios.post(scrapApi, payload);

//获取钉钉报废原因
export const scrapReasonsFun = (url, payload) => axios.post(url, payload);
