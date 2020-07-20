/**
 *  投放器
 */
import { axios } from '@/plugins/Http';

const dispenserDelApi = 'dispenser/device/delete'; //删除投放器
const dispenserDetailApi = 'dispenser/device/detail'; //投放器详情
const dispenserDditApi = 'dispenser/device/edit/form'; //编辑投放器
export  const dispenserListApi = 'dispenser/device/list'; //投放器列表
const dispenserResetApi = 'dispenser/device/reset'; //复位
const dispenserTzjApi = 'dispenser/device/selfCleaning'; //桶自洁
const dispenserValveApi = 'dispenser/device/valve'; //停用/启用
const dispenserReductionApi = 'dispenser/device/reduction'; //恢复出厂值
const dispenserChannelSwitchApi = 'dispenser/device/channel/switch'; //投放器通道开关



//删除投放器
export const dispenserDelFun = (payload) => axios.post(dispenserDelApi,payload);

//投放器详情
export const dispenserDetailFun = (payload) => axios.post(dispenserDetailApi,payload);

//编辑投放器
export const dispenserDditFun = (payload) => axios.post(dispenserDditApi,payload);

//投放器列表
export const dispenserDeviceListFun = (url, payload) => axios.post(url, payload);

//复位
export const dispenserResetFun = (payload) => axios.post(dispenserResetApi,payload);

//桶自洁
export const dispenserTzjFun = (payload) => axios.post(dispenserTzjApi,payload);

//停用/启用
export const dispenserValveFun = (payload) => axios.post(dispenserValveApi,payload);

//恢复出厂值
export const dispenserReductionFun = (payload) => axios.post(dispenserReductionApi,payload);

//投放器通道开关
export const dispenserChannelSwitchFun = (payload) => axios.post(dispenserChannelSwitchApi,payload);