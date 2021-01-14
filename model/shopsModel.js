// 购物车模块
const DBConnect = require("../db/DBConnect");
const GoodsModel = require("./goodsModel");
const UserModel = require("./userModel");

const to = require("await-to-js").default;
const db = new DBConnect();
const umodel = new UserModel();
const gmodel = new GoodsModel();

class ShopModel{
    constructor(){
        db.getConnect();
    }

    // 向购物车添加商品，包括验证用户是否存在，商品是否存在
    async addShopcar(shopgood){
        // 获取uid、goodsid
        let userdataObj = await umodel.getUserIdByUserName(shopgood.username);
        if(userdataObj.code == 201){
            return {code:201, msg:"您的登录已失效，请重新登录"};
        }else{
            let uid = userdataObj.uid;
            // 验证goodsid
            let goodData = await gmodel.getGoodbyGoodId(shopgood.goods_id);
            if(goodData.code === 201){
                return {code:201, msg:"商品已下架，请选择其他商品"};
            }else{
                if(goodData.good.goods_count<=0){
                    return {code:201, msg:"商品已售罄"};
                }else if(goodData.good.goods_count<shopgood.good_num){
                    return {code:201, msg:`库存不足，商品仅剩${goodData.good.goods_count}件`};
                }else{
                    let [err,data] = await to(db.getResultBySQL(`insert shop_car(uid,goods_id,style_name,good_num) value('${userdata.uid}','${goods_id}',${style_name},${good_num})`));
                    if(err){
                        return {code:201, msg:"添加购物车失败"};
                    } else {
                        return {code:200, msg:"添加购物车成功"};
                    }
                }
            }
        }
    }
    // 修改购物车商品，包括验证用户是否存在，商品是否存在
    async updateShopcar(shopgood){
        let userdata = await umodel.getUserIdByUserName(shopgood.username);
        if(userdata.code === 201){
            return {code:201, msg:"登录失效，请重新登录"};
        }else{
            let goods = await gmodel.getGoodbyGoodId(shopgood.goods_id);
            if(goods.code === 201){
                return {code:201, msg:"商品已下架，请选择其他商品"}
            }else{
                if(goods.goods_count<=0){
                    return {code:201, msg:"商品已售罄"};
                }else if(goods.goods_count<good_num){
                    return {code:201, msg:`库存不足，商品仅剩${goods.goods_count}件`};
                }else{
                    let [err,data] = await to(db.getResultBySQL(`update shop_car set good_num=${good_num} where id=${id}`));
                    if(err){
                        return {code:201, msg:"修改商品失败"};
                    } else {
                        return {code:200, msg:"修改商品成功"};
                    }
                }
            }
        }
    }
    // 删除购物车商品
    async delShopcar(shopId) {
        let [err, data] = await to(db.getResultBySQL(`delete from shop_car where id='${shopId}'`));
        if (err) {
            return { code: 201, msg: "购物车商品删除失败" };
        } else {
            return { code: 200, msg: "购物车商品删除成功" };
        }
    }
    // 根据用户ID查询用户的购物车数据
    async getShopcarlistByUser(username) {
        let uid = (await umodel.getUserIdByUserName(username)).uid;
        let [err, data] = await to(db.getResultBySQL(`SELECT goods_name,goods_price,style_name,good_num FROM goodlist g,shop_car sca WHERE g.goods_id=sca.goods_id AND uid='${uid}'`));
        if (err) {
            return { code: 201, msg: "购物车查询失败" };
        } else {
            if (data.length > 0) {
                return { code: 200, shopcarList: data };
            } else {
                return { code: 201, msg: "您的购物车空空如也" };
            }
        }
    }
}

module.exports = ShopModel