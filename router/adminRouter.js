// 管理路由层

const express = require("express");
const userModel = require("../model/userModel");
const { getTokenS, isCheckData } = require("../until/until");
const router = express.Router();
const umodel = new userModel();

// 修改接口
router.post("/updateUser", async (req, res) => {
    // res.send(await umodel.updateUser(req.body));
    if (req.body.token === req.session.token) {
        // console.log(req.session.token);
        let data = await umodel.updateUser(req.body);
        let token = getTokenS(req.session.token);
        req.session.token = token;
        data.token = token;
        res.send(data);
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" });
    }
});

// 删除接口
router.post("/delUser", async (req, res) => {
    // res.send(await umodel.delUser(req.body));
    if (req.body.token === req.session.token) {
        let data = await umodel.delUser(req.body.userid);
        let token = getTokenS(req.session.token);
        req.session.token = token;
        data.token = token;
        res.send(data);
    } else {
        res.send({ code: 201, msg: "登录信息失效，请重新登录" })
    }
});

// 查询接口
router.post("/getUserlist", async (req, res) => {
    if (req.body.token === req.session.token) {
        let token = getTokenS(req.session.token);
        req.session.token = token;
        if (isCheckData(req.body.page)) {
            res.send({ code: 201, msg: "分页数据无效" });
        } else if (req.body.searchText === "" || !isCheckData(req.body.searchText)) {
            let data = await umodel.getUserlist(req.body.page, req.body.searchText);
            data.token = token;
            res.send(data);
        } else {
            res.send({ code: 201, msg: "搜索条件无效", token: token });
        }
    } else {
        res.send({ code: 201, msg: "登录信息失败，请重新登录" })
    }
});

module.exports = router;