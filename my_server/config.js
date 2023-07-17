//config.js
let app = {
    user: 'sa', //這裡寫你的數據庫用戶名
    password: '12345',//這裡寫你的數據庫密碼
    server: 'LAPTOP-B6OG51F6',//'localhost',
    database: 'Chinese_medicine_DB_test2_forSA', // 数据库名字
    port: 1433, //端口号，默认 1433   //49693
    options: {
        encrypt: false, //加密,设置为true时会連接失敗FaiLed to connect to Localhost:1433 - self signed certificate
        enableArithAbort: false//控制在處理數學運算時的行為。
    },
    pool: {//限制連線池大小
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
 }
 

 module.exports = app