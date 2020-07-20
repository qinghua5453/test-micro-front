/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

export const brandListApi = "brand/list"; //品牌列表
const storeListApi = "erp/warehouse/list"; //仓库列表
const companyListApi = "erp/company/list"; //供应商列表

const typeListApi = "erp/inventory/list"; //供应商列表
const typeAddApi = "erp/goods/category/add"; //新增存货分类
const typeEditApi = "erp/goods/category/update"; //编辑存货分类
export const typeDelApi = "erp/goods/category/delete"; //编辑存货分类
const treeDataApi = "erp/goods/category/tree"; //存货分类
const searchListApi = "erp/goods/category/byKeywords?keywords=4"; //存货分类

const typeStockListApi = "erp/goods/list"; //存货分类

export const changeStockApi = "erp/goods/update/status/"; //修改存货状态
const addStockApi = "erp/goods/consumables/add"; //新增消耗品存货
const addAssetApi = "erp/goods/asset/add"; //新增资产存货
const delAssetApi = "erp/goods/delete"; //删除存货
const editAssetApi = "erp/goods/update"; //编辑存货
const stockCodeApi = "erp/goods/unique/code"; //获取存货唯一编码

//库存列表
const stockListApi = "erp/inventory/list"; //入库单列表
//出入库流水
const stockAllApi = "erp/inventory/order/item/list"; //出入库流水

//入库
const wareListApi = "erp/inventory/order/in/list"; //入库单列表

const addWareApi = "erp/inventory/order/in/add"; //新增入库
const getWareCodeApi = "erp/goods/byDeviceCodes"; //根据设备编码获取商品
export const getWareHouseCodeApi = "erp/goods/byWarehouseIdAndDeviceCodes/"; //入库单详情
export const wareDetailApi = "erp/inventory/order/in/detail/"; //入库单详情

//出库
const outListApi = "erp/inventory/order/out/list"; //出库单列表

const addOutApi = "erp/inventory/order/out/add"; //新增出库

export const outDetailApi = "erp/inventory/order/out/detail/"; //出库单详情

const wareTypeApi = "erp/inventoryOrder/list"; //入库单类别

const erpTypeApi = "erp/goods/keywords"; //存货名称


export const assetListApi = "erp/asset/list"; //资产列表
const brandDetailApi = "brand/detail"; //编辑品牌->获取详情
const operationListApi = "brand/operation/list"; //操作记录
const moreDetailApi = "/erp/goods/list/inventoryOrderId"; //操作记

export const inventoryExportApi = "erp/inventory/excel"; //库存导出
export const inventoryInExportApi = "erp/inventory/order/in/excel"; //入库单导出
export const inventoryOutExportApi = "erp/inventory/order/out/excel"; //出库单导出
export const inventoryDetailExportApi = "erp/inventory/order/item/excel"; //出入库明细导出

export const assetOutApi = "erp/inventory/order/out/dingding/detail/"; //获取钉钉出库单详情

//资产列表
export const storeListFun = payload => axios.post(storeListApi, payload);
//资产列表
export const companyListFun = payload => axios.post(companyListApi, payload);
//存货分类列表
export const typeListFun = payload => axios.post(typeListApi, payload);
//存货分类列表
export const searchListFun = payload => axios.post(searchListApi, payload);
//存货分类列表
export const treeDataFun = payload => axios.post(treeDataApi, payload);
//新增存货分类
export const addTypeFun = payload => axios.post(typeAddApi, payload);
//编辑存货分类
export const editTypeFun = payload => axios.post(typeEditApi, payload);
//删除存货分类
export const delTypeFun = (url,payload) => axios.post(url, payload);

//删除存货分类
export const typeStockListFun = payload => axios.post(typeStockListApi, payload);

//修改存货状态存货
export const changeStockFun = (url,payload) => axios.post(url, payload);
//新增消耗品存货
export const addStockFun = payload => axios.post(addStockApi, payload);
//新增资产存货
export const addAssetFun = payload => axios.post(addAssetApi, payload);
//删除存货
export const delAssetFun = payload => axios.post(delAssetApi, payload);
//编辑存货
export const editAssetFun = payload => axios.post(editAssetApi, payload);
//获取存货唯一编码
export const getStockCodeFun = payload => axios.post(stockCodeApi, payload);

//获取详情
export const brandDetailFun = payload => axios.post(brandDetailApi, payload);

//操作记录
export const operationListFun = payload => axios.post(operationListApi, payload);

//库存列表
export const stockListFun = payload => axios.post(stockListApi, payload);

//出入库流水
export const stockAllFun = payload => axios.post(stockAllApi, payload);

export const wareTypeListFun = payload => axios.post(wareTypeApi, payload);


//根据设备编码获取存货（商品）列表
export const getWareCodeFun = payload => axios.post(getWareCodeApi, payload);

export const getWareHouseCodeFun = (url,payload) => axios.post(url, payload);


//入库单列表
export const wareListFun = payload => axios.post(wareListApi, payload);

//新增入库
export const addWareFun = payload => axios.post(addWareApi, payload);

//入库单详情
export const wareDetailFun = (url,payload) => axios.post(url, payload);

//出库单列表
export const outListFun = payload => axios.post(outListApi, payload);

//出增入库
export const addOutFun = payload => axios.post(addOutApi, payload);

//出库单详情
export const outDetailFun = (url,payload) => axios.post(url, payload);

//出库单详情
export const moreDetailFun = payload => axios.post(moreDetailApi, payload);

//获取存货名称
export const erpNameFun = payload => axios.post(erpTypeApi, payload);

//获取钉钉出库单详情
export const scrapOutFun = (url,payload) => axios.post(url, payload);

