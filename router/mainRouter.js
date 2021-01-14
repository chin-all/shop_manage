const express=require("express");
const goodModel = require("../model/goodsModel")
const router=express.Router();
const gmodel = new goodModel();

// 热门搜索关键词接口
router.get("/getHotSearch",async (req,res)=>{
    res.send(await gmodel.getHotSearch())
})

// 轮播图图片接口
router.get("/getBanner",async (req,res)=>{
    res.send(await gmodel.getBanner())
})

// 猜你喜欢数据接口
router.get("/getLoveforUser",async (req,res)=>{
    res.send(await gmodel.getLoveforUser())
})

// 获取秒杀商品数据接口
router.get("/getFlashsale",async (req,res)=>{
    res.send(await gmodel.getFlashsale())
})

// 排行榜商品接口
router.get("/getRankGoods",async (req,res)=>{
    res.send(await gmodel.getRankGoods())
})

// 人气好货商品接口
router.get("/getPopularGoods",async (req,res)=>{
    res.send(await gmodel.getPopularGoods())
})


module.exports=router;
