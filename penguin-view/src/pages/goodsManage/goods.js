/**
 *  洗衣液
 */
import { axios } from "@/plugins/Http";

const shopsListApi = "shop/getForName"; //店铺列表
const posListApi = "position/shower/search"; //店铺列表
const changeApi = "goods/batchChangePosition"; //店铺列表
export const goodsListApi = "goods/list"; //商品列表
const delGoodsApi = "goods/delete"; //删除商品
const delMoreGoodsApi = "goods/batchDelete"; //批量删除商品
const goodsDetialApi = "goods/detail"; //获取商品详情
const goodsTypeListApi = "goods/category/list"; //商品类目列表
const addGoodsTypeApi = "goods/category/add"; //新增商品类目
const editGoodsTypeApi = "goods/category/edit"; //编辑商品类目
const delGoodsTypeApi = "goods/category/delete"; //删除商品类目
const getTypeDetailApi = "goods/category/detail"; //获取分类详情

const getCategoryApi = "goods/category/getCategory"; //获取一级类型
const getModelApi = "goods/category/getModel"; //获取二级类型

const editGoodsApi = "goods/edit"; //编辑商品


//更换所在店铺/浴室
export const changeFun = payload => axios.post(changeApi, payload);
//店铺列表
export const shopsListFun = payload => axios.post(shopsListApi, payload);
//店铺列表
export const posListFun = payload => axios.post(posListApi, payload);
//商品列表
export const goodsListFun = payload => axios.post(goodsListApi, payload);
//删除商品
export const delGoodsFun = payload => axios.post(delGoodsApi, payload);
//批量删除商品
export const delMoreGoodsFun = payload => axios.post(delMoreGoodsApi, payload);
//批量删除商品
export const getGoodsDetailFun = payload => axios.post(goodsDetialApi, payload);
//编辑商品
export const editGoodsFun = payload => axios.post(editGoodsApi, payload);

//商品类目列表
export const goodsTypeListFun = payload => axios.post(goodsTypeListApi, payload);
//新增商品类目
export const addGoodsTypeFun = payload => axios.post(addGoodsTypeApi, payload);
//编辑商品类目
export const editGoodsTypeFun = payload => axios.post(editGoodsTypeApi, payload);
//删除商品类目
export const delGoodsTypeFun = payload => axios.post(delGoodsTypeApi, payload);
//获取类目详情
export const getTypeDetailFun = payload => axios.post(getTypeDetailApi, payload);

//获取一级类型
export const getCategoryFun = payload => axios.post(getCategoryApi, payload);

//获取二级类型
export const getModelFun = payload => axios.post(getModelApi, payload);


