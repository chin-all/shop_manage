// 业务层
const svg = require("svg-captcha");
const dbConnect = require("../db/DBConnect");
const { isCheckData, checkPatcha, getsqlByObject } = require("../until/until");
const to = require("await-to-js").default;
const MD5 = require("crypto-js").MD5;

const db = new dbConnect();
class UserModel {
    constructor() {
        db.getConnect();
    }
    getCapcha() {
        return svg.create({
            noise: 2,    // 干扰线
            fontSize: 50,    // 字符大小
            size: 4,     // 字符个数
            width: 100,       // 宽高
            height: 40,
            color: true,    // 字符是否有颜色
            background: "#fff"   // 背景颜色
        });
    }
    // 登录业务
    async login(user, sessionCaptch) {
        //1、验证数据的合法性
        if (isCheckData(user.captchatext)) {
            return { code: 201, msg: "校验码数据不合法" };
        } else if (isCheckData(sessionCaptch)) {
            return { code: 201, msg: "请获取校验码！" }
        } else if (isCheckData(user.username)) {
            return { code: 201, msg: "用户名数据不合法" };
        } else if (isCheckData(user.pwd)) {
            return { code: 201, msg: "密码数据不合法" };
        } else if (checkPatcha(user.captchatext, sessionCaptch)) {
            return { code: 201, msg: "校验码不一致" };
        } else {
            console.log(MD5(user.pwd).toString());
            let [err, data] = await to(db.getResultBySQL(`select * from users where username=? and pwd=?`, [user.username, MD5(user.pwd).toString()]));
            if (err) {
                console.log(err.message);
                return { code: 201, msg: "数据被拐带到太空！！" };
            } else {
                if (data.length > 0) {
                    return { code: 200, msg: "登录成功！" };
                } else {
                    return { code: 201, msg: "登录失败！用户名或密码错误！" }
                }
            }
        }
    }
    // 注册业务
    async addUser(user, sessionCaptch) {
        if (isCheckData(user.captchatext)) {
            return {
                code: 201, msg:
                    "校验码数据不合法"
            };
        } else if (isCheckData(sessionCaptch)) {
            return {
                code: 201, msg:
                    "请获取校验码！"
            };
        } else if (isCheckData(user.username)) {
            return {
                code: 201, msg:
                    "用户名数据不合法"
            };
        } else if (isCheckData(user.realname)) {
            return {
                code: 201, msg:
                    "姓名数据不合法"
            };
        } else if (isCheckData(user.pwd)) {
            return {
                code: 201, msg:
                    "密码数据不合法"
            };
        } else if (checkPatcha(user.captchatext, sessionCaptch)) {
            return {
                code: 201, msg:
                    "校验码不一致！"
            };
        } else {
            console.log(typeof user.username);
            let [err, data] = await to(db.getResultBySQL(`insert users(username,realname,pwd) values('${user.username}','${user.realname}','${MD5(user.pwd).toString()}')`));
            if (err) {
                if (err.message.includes("Duplicate entry")) {
                    return { code: 201, msg: "用户名已存在！" };
                } else {
                    return { code: 201, msg: "用户注册失败！请联系管理员。" };
                }
            } else {
                if (data.affectedRows > 0) {
                    return { code: 200, msg: "注册成功！" };
                } else {
                    return { code: 201, msg: "注册失败，继续努力！" };
                }
            }
        }
    }
    // 修改业务
    async updateUser(user) {
        // console.log(user);
        let userid = user.userid; // 将userid保存
        delete user.userid; // 删除userid
        // console.log(userid);
        delete user.token;
        let [err, data] = await to(db.getResultBySQL(`update users set ${getsqlByObject(user)} where uid='${userid}'`))
        if (err) {
            console.log(err);
            return { code: 201, msg: "修改失败！" }
        } else {
            if (data.affectedRows > 0) {
                return { code: 200, msg: "修改成功！" }
            } else {
                return { code: 201, msg: "修改失败！" }
            }
        }
    }

    // 删除业务
    async delUser(...userid) {
        if (userid.length < 0) {
            return { code: 201, msg: "删除失败" }
        } else {
            let [err, data] = await to(db.getResultBySQL(`delete from users where uid=${userid.map(item => `'${item}'`)}`));
            if (err) {
                return { code: 201, msg: "删除失败" };
            } else {
                if (data.affectedRows > 0) {
                    return { code: 200, msg: "删除成功！" }
                } else {
                    return { code: 201, msg: "删除失败！" }
                }
            }
        }
    }

    // 查询业务
    // 支持用户名模糊搜索
    async getUserlist(page, searchText) {
        let pageCount = 5;
        let [err, data] = await to(db.getResultBySQL(`select * from users where username like '%${searchText}%' limit ${(page - 1) * pageCount},${pageCount}`));
        if (err) {
            return { code: 201, msg: "数据库数据出现问题，请联系管理员" };
        } else {
            if (data.length > 0) {
                return { code: 200, mes: "查询成功", data: data };
            } else {
                return { code: 201, mes: "查询失败，未找到满足条件数据" };
            }
        }
    }

    // 根据用户名获取用户id
    async getUserIdByUserName(username) {
        let [err, data] = await to(db.getResultBySQL(`select uid from users where username='${username}'`));
        if (err) {
            return { code: 201, msg: "根据用户名获取ID失败" };
        } else {
            if (data.length > 0) {
                return { code: 200, uid: data[0] };
            } else {
                return { code: 201, msg: "查询不到该用户" };
            }
        }
    }
}
// let aa = new UserModel()
// aa.updateUser({userid:"4e397ede-fd95-11ea-aa03-d43a6508d4a8",pwd:123456}).then(data=>{
//     console.log(data);
// })


module.exports = UserModel;