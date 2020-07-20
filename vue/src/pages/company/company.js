/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const companyEditApi = "erp/company/edit"; //编辑供应商
const companyDelApi = "erp/company/remove"; //删除供应商
const companyAddApi = "erp/company/add"; //添加供应商
const companyDetailApi = "erp/company/detail"; //添加供应商

export const companyListApi = "erp/company/list"; //供应商列表


//编辑供应商
export const companyEditFun = payload => axios.post(companyEditApi, payload);

//删除供应商
export const companyDelFun = payload => axios.post(companyDelApi, payload);

//添加供应商
export const companyAddFun = payload => axios.post(companyAddApi, payload);

//生成激活码
export const generateCodeFun = payload => axios.post(generateCodeApi, payload,{
  responseType: 'blob',
  timeout: 60000
});

//供应商列表
export const companyListFun = (url, payload) => axios.post(url, payload);

export const changeStatusFun = payload => axios.post(statueApi, payload);

//获取详情
export const companyDetailFun = payload => axios.post(companyDetailApi, payload);
