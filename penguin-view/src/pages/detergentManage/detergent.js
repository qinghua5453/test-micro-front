/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

export const brandListApi = "brand/list"; //品牌列表
const brandNamesApi = "brand/name/list"; //添加品牌->品牌名称列表
const brandTypesApi = "brand/type/list"; //添加品牌->品牌类型列表
const brandEditApi = "brand/edit"; //编辑品牌
const brandDelApi = "brand/delete"; //删除品牌
const brandAddApi = "brand/add"; //添加品牌
const generateCodeApi = "brand/code/generate"; //生成激活码
export const codeListApi = "brand/code/list"; //激活码列表
const brandDetailApi = "brand/detail"; //编辑品牌->获取详情
const operationListApi = "brand/operation/list"; //操作记录

//品牌列表
export const brandListFun = (url, payload) => axios.post(url, payload);

//品牌名称列表
export const brandNamesFun = payload => axios.post(brandNamesApi, payload);

//品牌类型列表
export const brandTypesFun = payload => axios.post(brandTypesApi, payload);

//编辑品牌
export const brandEditFun = payload => axios.post(brandEditApi, payload);

//删除品牌
export const brandDelFun = payload => axios.post(brandDelApi, payload);

//添加品牌
export const brandAddFun = payload => axios.post(brandAddApi, payload);

//生成激活码
export const generateCodeFun = payload => axios.post(generateCodeApi, payload,{
    responseType: 'blob',
    timeout: 60000
  });

//激活码列表
export const codeListFun = payload => axios.post(codeListApi, payload);

//获取详情
export const brandDetailFun = payload => axios.post(brandDetailApi, payload);

//操作记录
export const operationListFun = payload => axios.post(operationListApi, payload);
