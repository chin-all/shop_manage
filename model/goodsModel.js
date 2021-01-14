// 首页模块
const DBConnect = require("../db/DBConnect")
const to = require("await-to-js").default
const db = new DBConnect();

class GoodsModel{
    constructor(){
        db.getConnect();
    }
    // 热门搜索关键词
    async getHotSearch(){
        let [err,data] = await to(db.getResultBySQL(`select search_text from search ORDER BY count DESC`));
        if(err){
            return {code:201, msg:"热门搜索查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, textList: data};
            } else {
                return {code:201, msg:"查询失败"};
            }
        }
    }
    // 轮播图
    async getBanner(){
        let [err,data] = await to(db.getResultBySQL(`SELECT coverimg from banner ORDER BY order_num`));
        if(err){
            return {code:201, msg:"轮播图查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, imgList: data};
            } else {
                return {code:201, msg:"没有轮播图数据"};
            }
        }
    }
    // 猜你喜欢
    async getLoveforUser(){
        let [err,data] = await to(db.getResultBySQL(`select * from goodlist order by Rand() limit 20`));
        if(err){
            return {code:201, msg:"查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"没有商品数据"};
            }
        }
    }
    // 秒杀
    async getFlashsale(){
        let severTimes = new Date().getHours();
        if(severTimes <= 10 || severTimes>20){
            severTimes = 10
        }
        let [err,data] = await to(db.getResultBySQL(`select goods_name,goods_price,goods_introduce,goods_manufacturer,goods_detailed_information from flash_sale f,goodlist g WHERE  begin_time='${severTimes}:00:00' AND g.goods_id=f.goods_id`));
        if(err){
            return {code:201, msg:"查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"没有商品数据"};
            }
        }
    }
    // 排行榜
    async getRankGoods(){
        let [err,data] = await to(db.getResultBySQL(`select * from goodlist order by Rand() limit 3`));
        if(err){
            return {code:201, msg:"查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"没有商品数据"};
            }
        }
    }
    // 人气好货商品
    async getPopularGoods(){
        let [err,data] = await to(db.getResultBySQL(`select * from goodlist order by Rand() limit 8`));
        if(err){
            return {code:201, msg:"查询失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"没有商品数据"};
            }
        }
    }
    // 获取全部商品数据
    async getGoods(){
        let [err,data] = await to(db.getResultBySQL(`SELECT goods_id,category_name,seller_name,goods_name,goods_introduce,goods_manufacturer,goods_price,assem_price,goods_production_cycle,goods_detailed_information from goodlist g,category c,seller s where g.category_id=c.category_id AND g.seller_id=s.seller_id`));
        if(err){
            return {code:201, msg:"获取商品失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"获取商品失败"};
            }
        }
    }
    // 根据三级分类获取商品数据
    async getGoodsbyThirdtype(thirdId){
        let [err,data] = await to(db.getResultBySQL(`SELECT goods_id,category_name,seller_name,goods_name,goods_introduce,goods_manufacturer,goods_price,assem_price,goods_production_cycle,goods_detailed_information from goodlist g,category c,seller s where g.category_id=c.category_id AND g.seller_id=s.seller_id AND c.category_id='${thirdId}'`));
        if(err){
            return {code:201, msg:"获取三级分类下商品失败"};
        } else {
            if(data.length > 0){
                return {code:200, goodslist: data};
            } else {
                return {code:201, msg:"该三级分类下无商品"};
            }
        }
    }
    // 根据商品ID查询商品信息
    async getGoodbyGoodId(goodId){
        let [err,data] = await to(db.getResultBySQL(`SELECT goods_id,category_name,seller_name,goods_name,goods_introduce,goods_manufacturer,goods_price,assem_price,goods_production_cycle,goods_detailed_information from goodlist g,category c,seller s where g.category_id=c.category_id AND g.seller_id=s.seller_id and goods_id='${goodId}'`));
        if(err){
            return {code:201, msg:"查询商品信息失败"};
        } else {
            if(data.length > 0){
                return {code:200, good: data[0]};
            } else {
                return {code:201, msg:"商品ID无效"};
            }
        }
    }
}

// const gm = new GoodsModel();
// gm.aaa().then((data)=>{
//     console.log(data);
// })

module.exports = GoodsModel;