
const express = require("express");
const shopModel = require("../model/shopsModel")
const { getTokenS, getTokenV } = require("../until/until");
const router = express.Router();
const smodel = new shopModel();

// 添加购物车
router.post("/addShopcar", async (req, res) => {
    if (req.session.token === req.body.token) {
        let shopgood = {
            username: getTokenV(req.body.token).username,
            goods_id: req.body.goods_id,
            style_name: req.body.style_name,
            good_num: req.body.good_num
        }
        let data = await smodel.addShopcar(shopgood);
        let token = getTokenS(req.body.token)
        req.session.token = token;
        res.send(data)
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" });
    }
})

// 修改购物车
router.post("/updateShopcar", async (req, res) => {
    if (req.session.token === req.body.token) {
        let shopgood = req.body;
        shopgood.username = getTokenV(req.body.token);
        delete shopgood.token;
        let data = await smodel.delShopcar(req.body.shopId);
        let token = getTokenS(req.body.token);
        req.session.token = token;
        data.token = token;
        res.send(data);
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" });
    }
})

// 删除购物车
router.post("/delShopcar", async (req, res) => {
    if (req.session.token === req.body.token) {
        let data = await smodel.delShopcar(req.body.shopId);
        let token = getTokenS(req.body.token);
        req.session.token = token;
        data.token = token;
        res.send(data);
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" });
    }
})

// 根据用户ID查询购物车
router.post("/getShopcarlistByUser", async (req, res) => {
    if (req.session.token === req.body.token) {
        let username = getTokenV(req.body.token).username;
        let data = await smodel.getShopcarlistByUser(username);
        let token = getTokenS(req.body.token);
        req.session.token = token;
        data.token = token;
        res.send(data);
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" });
    }
})



module.exports = router;

