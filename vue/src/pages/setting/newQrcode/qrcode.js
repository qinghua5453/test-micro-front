/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const codeListApi = "goods/qr/list"; //二维码列表
const addCodesApi = "goods/qr/add"; //新增商品类目
export const excelCodesApi = "goods/qr/excel"; //生成excel
const zipCodesApi = "goods/qr/zip"; //删除商品类目

//商品列表
export const codeListFun = payload => axios.post(codeListApi, payload);
//新增商品类目
export const addCodesFun = payload => axios.post(addCodesApi, payload);
//编辑商品类目
export const excelCodesFun = payload => axios.post(excelCodesApi, payload);
//删除商品类目
export const zipCodesFun = payload => axios.post(zipCodesApi, payload);
