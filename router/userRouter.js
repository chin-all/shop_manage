// 用户路由层

const express = require("express");
const usermodel = require("../model/userModel");
const { getToken } = require("../until/until");
const umodel = new usermodel();
const router = express.Router();

// 验证码路由接口
router.get("/getCaptchaCode", (req, res) => {
    res.type("svg");
    let captcha = umodel.getCapcha();
    req.session.captchaText = captcha.text;
    res.send(captcha.data);
});
// 登录接口
router.post("/login", async (req, res) => {
    let userData = await umodel.login(req.body, req.session.captchaText);
    if (userData.code === 200) {
        let token = getToken({ username: req.body.username });
        req.session.token = token;
        userData.token = token;
    }
    res.send(userData);
});
// 注册接口
router.post("/reguestUser", async (req, res) => {
    res.send(await umodel.addUser(req.body, req.session.captchaText));
});



module.exports = router;