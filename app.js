
const express = require("express");
const session = require("express-session");
const { getTokenV } = require("./until/until");
const app = express();
// post请求参数
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 将session应用为中间件
app.use(session({
    secret: "xiaoU",
    resave: true,
    saveUninitialized: true
}));

// 跨域解决代码，解决不同IP地址发送的请求，可以对其进行响应
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);//不区分协议
    res.header("Access-Control-Allow-Credentials", true);//允许转发
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");//请求中包含响应类型
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");//请求方式
    res.header("Content-Type", "application/json;charset=utf-8");//响应的数据类型
    res.header("X-Powered-By", '5.0.1');//版本号，可省
    next();
});

// 不需要拦截的路由
app.use("/", require("./router/mainRouter"));
app.use("/user", require("./router/userRouter"));
app.use("/type", require("./router/typeRouter"));

// 拦截器
app.use("*", (req, res, next) => {
    if (req.session.token !== undefined) {
        let tokenobj = getTokenV(req.session.token);
        if (tokenobj.exp * 1000 - Date.now() > 0) {
            next();
        } else {
            res.send({ code: 201, msg: "登录超时，请重新登录！" })
        }
    } else {
        res.send({ code: 201, msg: "您需要登录！" });
    }
});


// 需要拦截的路由
app.use("/admin", require("./router/adminRouter"));
app.use("/shop", require("./router/shopRoter"));


app.use((req, res) => {
    res.send({ code: 201, msg: "您访问的资源去了火星，请等待管理员修复！" });
});
app.use((err, req, res, next) => {
    if (err) {
        res.send({ code: 201, msg: "程序离职了，服务器端放飞自我了！" });
    }
});


app.listen(2222);