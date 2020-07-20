/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const changeRateApi = "dispenser/revenue/update"; //店铺列表
const changeMoreRateApi = "dispenser/revenue/batch/edit"; //店铺列表
export const subsListApi = "dispenser/revenue/list"; //商品列表
const shopListApi = "dispenser/revenue/shop/list"; //获取商品详情

//更换所在店铺/浴室
export const changeRateFun = payload => axios.post(changeRateApi, payload);
//更换所在店铺/浴室
export const changeMoreRateFun = payload => axios.post(changeMoreRateApi, payload);
//商品列表
export const subsListFun = payload => axios.post(subsListApi, payload);
//编辑商品
export const shopListFun = payload => axios.post(shopListApi, payload);
