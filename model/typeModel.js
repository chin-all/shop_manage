// 分类模块
const DBconnect = require("../db/DBConnect");
const to = require("await-to-js").default;
const db = new DBconnect();

class TypeModel{
    constructor(){
        db.getConnect();
    }
    // 获取一级分类
    async getfirstType(){
        let [err,data] = await to(db.getResultBySQL(`SELECT category_id,category_name FROM category WHERE father_id IS NULL`));
        if(err){
            return {code:201, msg:"获取一级分类失败"};
        } else {
            if(data.length > 0){
                return {code:200, typelist: data};
            } else {
                return {code:201, msg:"没有一级分类数据"};
            }
        }
    }
    // 根据一级分类获取二级分类
    async getsecondTypeByFirsttype(firstId){
        let [err,data] = await to(db.getResultBySQL(`SELECT category_id,category_name from category WHERE father_id='${firstId}'`));
        if(err){
            return {code:201, msg:"获取二级分类失败"};
        } else {
            if(data.length > 0){
                return {code:200, typelist: data};
            } else {
                return {code:201, msg:"该一级分类没有二级分类"};
            }
        }
    }
    // 根据二级分类获取三级分类
    async getThirdTypeBySecondtype(secondId){
        let [err,data] = await to(db.getResultBySQL(`SELECT category_id,category_name from category WHERE father_id='${secondId}'`));
        if(err){
            return {code:201, msg:"获取三级分类失败"};
        } else {
            if(data.length > 0){
                return {code:200, typelist: data};
            } else {
                return {code:201, msg:"该二级分类没有三级分类"};
            }
        }
    }
    // 获取全部二级分类
    async getSecondType(){
        let [err,data] = await to(db.getResultBySQL(`SELECT c2.category_id,c2.category_name '二级分类',c1.category_name '一级分类' FROM category c1,category c2 WHERE c2.father_id=c1.category_id'`));
        if(err){
            return {code:201, msg:"获取二级分类失败"};
        } else {
            if(data.length > 0){
                return {code:200, typelist: data};
            } else {
                return {code:201, msg:"获取二级分类失败"};
            }
        }
    }
    // 获取全部三级分类
    async getThirdType(){
        let [err,data] = await to(db.getResultBySQL(`SELECT c3.category_id,c3.category_name '三级分类',c2.category_name '二级分类',c1.category_name '一级分类' FROM category c1,category c2,category c3 where c3.father_id=c2.category_id AND c2.father_id=c1.category_id`));
        if(err){
            return {code:201, msg:"获取三级分类失败"};
        } else {
            if(data.length > 0){
                return {code:200, typelist: data};
            } else {
                return {code:201, msg:"获取三级分类失败"};
            }
        }
    }

}



module.exports = TypeModel