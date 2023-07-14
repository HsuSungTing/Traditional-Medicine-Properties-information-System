var express = require('express');
var app = express();
var sql = require('mssql');
var cors = require('cors'); // 引入cors模块

app.use(cors()); // 使用cors中间件

// 配置数据库连接
var config = {
  user: 'sa',
  password: '12345',
  server: 'LAPTOP-Q69P3FAE\\MSSQLSERVER01',   // 这边要注意一下!!
  database: 'med_DB',
  options: {
    encrypt: false
  }
};

app.get('/', function(req, res) {
  // 连接到数据库
    sql.connect(config, function(err) {
    if (err) console.log(err);

    // 创建请求对象
    var request = new sql.Request();

    request.query('SELECT TOP 1 藥材名,拉丁生藥名稱,英文名稱,基原,含量,用途分類,性味與歸經,效能,用法與用量,貯藏法 FROM dbo.所有藥材資料表', function(err, recordset) {
        if (err) console.log(err);
        // 将查询结果转换为JSON格式并发送给客户端
        res.json(recordset.recordset);
    });
    });
});

var server = app.listen(5000, function() {
  console.log('Server is running!');
});