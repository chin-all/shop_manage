
const MD5=require("crypto-js").MD5;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// 数据格式校验
function isCheckData(pramas){
    return pramas===undefined||pramas===null||pramas===""||pramas==="undefiend"||pramas==="null"?true:false;
}
// 判断校验码是否正确
function checkPatcha(bodyPatcha,sessionPatcha){
    return (sessionPatcha.toLowerCase()!==bodyPatcha.toLowerCase())?true:false;
}

// 根据object获取sql语句
function getsqlByObject(obj){
    let sql="";
    for(let [key,value] of Object.entries(obj)){
        if(!isCheckData(value)){
            if(key==="pwd"||key==="pay_pwd"){
                sql+=`${key}='${MD5(value).toString()}',`
            }else{
                 if(typeof value ==="string"){
                    sql+=`${key}='${value}',`;
                }else{
                    sql+=`${key}=${value},`;
                }
            }
        }
    }
    return sql.substring(0,sql.length-1);
}

// 生成token方法
function getToken(obj){
    let key = fs.readFileSync(path.join(__dirname,"key"),"utf-8");
    let takenMes = {
        expiresIn: 60*15,
        audience: "stu",
        issuer: "chinyan",
        subject: "xiaou"
    }
    return jwt.sign(obj,key,takenMes);
}

// 解密token方法
function getTokenV(token){
    let key = fs.readFileSync(path.join(__dirname,"key"),"utf8");
    return jwt.verify(token,key);
}

// 二次生成token
function getTokenS(token){
    return getToken({username: getTokenV(token).username});
}

module.exports={
    getsqlByObject,
    isCheckData,
    checkPatcha,
    getToken,
    getTokenV,
    getTokenS
}
