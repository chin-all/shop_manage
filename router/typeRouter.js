const express = require("express");
const typemodel = require("../model/TypeModel");
const goodModel = require("../model/goodsModel")
const router = express.Router();
const tmodel = new typemodel();
const gmodel = new goodModel();

// 获取一级分类接口
router.get("/getfirstType", async (req, res) => {
    res.send(await tmodel.getfirstType())
});
// 根据一级分类获取二级分类接口
router.post("/getsecondTypeByFirsttype", async (req, res) => {
    res.send(await tmodel.getsecondTypeByFirsttype(req.body.firstId))
});
// 根据二级分类获取三级分类接口
router.post("/getThirdTypeBySecondtype", async (req, res) => {
    res.send(await tmodel.getThirdTypeBySecondtype(req.body.secondId))
});
// 获取二级分类数据接口
router.get("/getSecondType", async (req, res) => {
    res.send(await tmodel.getSecondType())
});
// 获取全部三级分类接口
router.get("/getThirdType", async (req, res) => {
    res.send(await tmodel.getThirdType())
});
// 获取全部商品数据接口
router.get("/getGoods", async (req, res) => {
    res.send(await gmodel.getGoods())
});
// 根据三级分类获取商品接口
router.post("/getGoodsbyThirdtype", async (req, res) => {
    res.send(await gmodel.getGoodsbyThirdtype(req.body.thirdId))
});
// 根据商品ID查询商品信息数据接口
router.post("/getGoodbyGoodId", async (req, res) => {
    res.send(await gmodel.getGoodbyGoodId(req.body.goodId))
});

module.exports = router