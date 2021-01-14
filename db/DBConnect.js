// 数据库操作
const mysql = require("mysql");
const dbconfig = require("./DBConfig");

class DBConnect {
    conn = "";
    // 建立数据库连接的方法
    getConnect() {
        this.conn = mysql.createConnection(dbconfig);
        this.conn.connect((err) => {
            if (err) console.log("数据库连接失败" + err.message);
        });
    }
    // 执行sql语句的方法
    getResultBySQL(sql, params) {
        console.log(sql);
        return new Promise((resolve, reject) => {
            this.conn.query(sql, params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
    // 关闭数据库
    closeConnect() {
        this.conn.end((err) => {
            if (err) console.log("数据库关闭失败" + err.message);
        });
    }
}
module.exports = DBConnect;