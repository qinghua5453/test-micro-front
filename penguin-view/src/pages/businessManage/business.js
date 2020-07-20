/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const tagsListApi = "article/tags"; //标签列表
const statusListApi = "article/status"; //状态列表
const previewApi = "article/preview"; //文章预览
const releaseApi = "article/release"; //文章发布
const fallbackApi = "article/fallback"; //文章撤回
const biddingListApi = "article/bidding/list"; //招投标列表
const deleteApi = "article/delete"; //文章删除
const coversListApi = "article/covers"; //默认封面图列表
const biddingDetailApi = "article/bidding/detail"; //招投标详情

const biddingFilterApi = "article/bidding/filter"; //招投标详情

const industryListApi = "article/industry/list"; //行业经验列表
const industryAddApi = "article/industry/add"; //新增行业经验
const industryEditApi = "article/industry/edit"; //编辑行业经验
const industryDetailApi = "article/industry/detail"; //行业经验详情

const pairingListApi = "article/pairing/list"; //供求撮合列表
const pairingReviewApi = "article/pairing/review"; //供求撮合审核
const pairingDetailApi = "article/pairing/detail"; //供求撮合详情
const pairingEditApi = "article/pairing/edit"; //编辑供求撮合


//标签列表
export const tagsListFun = payload => axios.post(tagsListApi, payload);
//状态列表
export const statusListFun = payload => axios.post(statusListApi, payload);
//文章预览
export const previewFun = payload => axios.post(previewApi, payload);
//文章发布
export const releaseFun = payload => axios.post(releaseApi, payload);
//文章撤回
export const fallbackFun = payload => axios.post(fallbackApi, payload);
//招投标列表
export const biddingListFun = payload => axios.post(biddingListApi, payload);
//文章删除
export const deleteFun = payload => axios.post(deleteApi, payload);
//默认封面图列表
export const coversListFun = payload => axios.post(coversListApi, payload);
//招投标详情
export const biddingDetailFun = payload => axios.post(biddingDetailApi, payload);
//招投标编辑
export const biddingFilterFun = payload => axios.post(biddingFilterApi, payload);

//行业经验列表
export const industryListFun = payload => axios.post(industryListApi, payload);
//新增行业经验
export const industryAddFun = payload => axios.post(industryAddApi, payload);
//编辑行业经验
export const industryEditFun = payload => axios.post(industryEditApi, payload);
//行业经验详情
export const industryDetailFun = payload => axios.post(industryDetailApi, payload);

//供求撮合列表
export const pairingListFun = payload => axios.post(pairingListApi, payload);
//供求撮合审核
export const pairingReviewFun = payload => axios.post(pairingReviewApi, payload);
//供求撮合详情
export const pairingDetailFun = payload => axios.post(pairingDetailApi, payload);
//编辑供求撮合详情
export const pairingEditFun = payload => axios.post(pairingEditApi, payload);