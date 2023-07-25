var express = require('express');
var app = express();
var sql = require('mssql');
var cors = require('cors'); // 引入cors模块
var path = require('path'); // 引入path模块

app.use(cors()); // 使用cors中间件

// 配置数据库连接
var config = {
  user: 'sa',
  password: '12345',
  server: 'LAPTOP-Q69P3FAE\\MSSQLSERVER01',   // 这边要注意一下!!
  database: 'med_DB2',
  options: {
    encrypt: false
  }
};

var router = express.Router(); // 创建一个路由处理器

router.get('/getMedicineData', function(req, res) {
  // 连接到数据库
  sql.connect(config, function(err) {
    if (err) console.log(err);

    // 创建请求对象
    var request = new sql.Request();

    request.query('SELECT 藥材名,拉丁生藥名稱,英文名稱,基原,含量,用途分類,性味與歸經,效能,用法與用量,貯藏法 FROM dbo.所有藥材資料表', function(err, recordset) {
      if (err) console.log(err);
      // 将查询结果转换为JSON格式并发送给客户端
      res.json(recordset.recordset);
    });
  });
});

app.use(express.static(path.join(__dirname, 'public'))); // 设置静态目录以提供script.js文件

app.use('/data', router); // 将路由处理器连接到/data路径上

var server = app.listen(5000, function() {
  console.log('Server is running!');
});