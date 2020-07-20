import { axios } from '@/plugins/Http';
import Api from '@/utils/Api';


//运营商返利列表
export const getRebateList = (url, payload) => axios.post(url, payload);

//运营商设备返利详情列表
export const getRebateDetailsList = (url, payload) => axios.post(url, payload);

//运营商返利标准查看
export const getRebateDetail = payload => axios.post(Api.REBATE_GET_DETAIL, payload);

//运营商返利金额结算
export const statusUpdate = payload => axios.post(Api.REBATE_STATUS_APDATE, payload);
