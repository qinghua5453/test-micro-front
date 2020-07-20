import { axios } from '@/plugins/Http';
import Api from '@/utils/Api';


//发货单列表
export const getInvocieList = (url, payload) => axios.post(url, payload);

//BD列表
export const getBDList = payload => axios.post(Api.BD_LIST, payload);

//运营商列表
export const getOperatorList = payload => axios.post(Api.OPERATOR_NAME, payload);


//货认领/取消认领
export const shipConfirm = payload => axios.post(Api.SHIP_BD_CONFIRM, payload);

//新增发货
export const addShip = payload => axios.post(Api.SHIP_ADD, payload);

// ship/shipDetails
export const getShipDetails = (url, payload) => axios.post(url, payload);

//导入退货
export const addShipReturn = payload => axios.post(Api.SHIP_RETURN_ADD, payload);

//返利设置
export const getRebateConfigList = payload => axios.post(Api.REBATE_CONFIG_LIST, payload);
//返利编辑
export const editRebate = payload => axios.post(Api.REBATE_CONFIG_EDIT, payload);

//成员列表
export const getMemberList = payload => axios.post(Api.GET_MEMBER_LIST, payload);
