//mssql.js
/**
 * sqLserver Model
 * 對SQL語句進行二次封裝
 */
const mssql = require("mssql")
const conf = require("./config.js")

const pool = new mssql.ConnectionPool(conf)
const poolConnect = pool.connect()

pool.on('error', err=>{
    console.log('error: ', err)
})
/**
 * 自由查詢
 * 提供使用者直接使用sql語句來與資料庫戶動owo，目前沒被使用到
 * @param sqL sqL語句, 例如: 'seLect * from news where id=@id'
 * @param params 參數, 用來解釋sqL中的@*, 例如 {id: id}
 * @param callBack 回調函數
 */
let querySql = async function(sql, params, callBack){
    try{
        let ps = new mssql.PreparedStatement(await poolConnect);
        if(params!=""){//設置參數型別
            for(let id in params){
                if(typeof params[id]=="number"){
                    ps.input(id, mssql.Int);
                }else if(typeof params[index]=="string"){
                    ps.input(id, mssql.NVarChar);
                }
            }
        }
        ps.prepare(sql, function (err){//創建連接
            if(err) console.log(err);
            ps.execute(params, function(err, recordset){
                callBack(err, recordset);
                ps.unprepare(function(err){//釋放連接
                    if(err) console.log(err);
                });//unprepare( &...的尾巴
            });//execute( & function(err, recordset){的尾巴
        });//prepare( & function(err){的尾巴
    

    }catch(e){
        console.log(e)
    }
};

 /**
  * 按条件和需求查询指定表
  * @param tableName 数据库表名，例：'news'
  * @param topNumber 只查询前几个数据，可为空，为空表示查询所有
  * @param whereSql 条件语句，例：'where id = @id'
  * @param params 参数，用来解释sql中的@*，例如： { id: id }
  * @param orderSql 排序语句，例：'order by created_date'
  * @param callBack 回调函数
  */
let select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
        try {
        let ps = new mssql.PreparedStatement(await poolConnect);
        let sql = "select * from " + tableName + " ";
        if (topNumber != "") {
             sql = "select top(" + topNumber + ") * from " + tableName + " ";
        }
        sql += whereSql + " ";
         if (params != "") {
             for (let index in params) {
                 if (typeof params[index] == "number") {
                     ps.input(index, mssql.Int);
                 } else if (typeof params[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                 }
             }
         }
         sql += orderSql;
         console.log(sql);
         ps.prepare(sql, function (err) {
            if (err) console.log(err);

            ps.execute(params, function (err, recordset) {
                 callBack(err, recordset);
                 ps.unprepare(function (err) {
                    if (err)
                        console.log(err);
                });
            });
        });
    } catch (e) {
        console.log(e)
    }
};

/**
  * 查询指定表的所有数据
  * @param tableName 数据库表名
  * @param callBack 回调函数
  */
 let selectAll = async function (tableName, callBack) {
     try {
         let ps = new mssql.PreparedStatement(await poolConnect);
         let sql = "select * from " + tableName + " ";
         ps.prepare(sql, function (err) {
             if (err)
                 console.log(err);
             ps.execute("", function (err, recordset) {
                 callBack(err, recordset);
                 ps.unprepare(function (err) {
                     if (err)
                         console.log(err);
                 });
             });
         });
     } catch (e) {
         console.log(e)
     }
 };

  
 /**
  * 添加字段到指定表
  * @param addObj 需要添加的对象字段，例：{ name: 'name', age: 20 }
  * @param tableName 数据库表名
  * @param callBack 回调函数
  */
 let add = async function (addObj, tableName, callBack) {
     try {
         let ps = new mssql.PreparedStatement(await poolConnect);
         let sql = "insert into " + tableName + "(";
         if (addObj != "") {
             for (let index in addObj) {
                 if (typeof addObj[index] == "number") {
                     ps.input(index, mssql.Int);
                 } else if (typeof addObj[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                 }
                 sql += index + ",";
             }
             sql = sql.substring(0, sql.length - 1) + ") values(";
             for (let index in addObj) {
                 if (typeof addObj[index] == "number") {
                     sql += addObj[index] + ",";
                 } else if (typeof addObj[index] == "string") {
                     sql += "'" + addObj[index] + "'" + ",";
                 }
             }
         }
         sql = sql.substring(0, sql.length - 1) + ") SELECT @@IDENTITY id"; // 加上SELECT @@IDENTITY id才会返回id
         ps.prepare(sql, function (err) {
             if (err) console.log(err);
             ps.execute(addObj, function (err, recordset) {
                 callBack(err, recordset);
                 ps.unprepare(function (err) {
                     if (err)
                         console.log(err);
                 });
             });
         });
     } catch (e) {
         console.log(e)
     }
 };
  
 /**
  * 更新指定表的数据
  * @param updateObj 需要更新的对象字段，例：{ name: 'name', age: 20 }
  * @param whereObj 需要更新的条件，例: { id: id }
  * @param tableName 数据库表名
  * @param callBack 回调函数
  */
 let update = async function (updateObj, whereObj, tableName, callBack) {
     try {
         let ps = new mssql.PreparedStatement(await poolConnect);
         let sql = "update " + tableName + " set ";
         if (updateObj != "") {
             for (let index in updateObj) {
                 if (typeof updateObj[index] == "number") {
                     ps.input(index, mssql.Int);
                     sql += index + "=" + updateObj[index] + ",";
                 } else if (typeof updateObj[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                     sql += index + "=" + "'" + updateObj[index] + "'" + ",";
                 }
             }
         }
         sql = sql.substring(0, sql.length - 1) + " where ";
         if (whereObj != "") {
             for (let index in whereObj) {
                 if (typeof whereObj[index] == "number") {
                     ps.input(index, mssql.Int);
                     sql += index + "=" + whereObj[index] + " and ";
                 } else if (typeof whereObj[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                     sql += index + "=" + "'" + whereObj[index] + "'" + " and ";
                 }
             }
         }
         sql = sql.substring(0, sql.length - 5);
         ps.prepare(sql, function (err) {
             if (err)
                 console.log(err);
             ps.execute(updateObj, function (err, recordset) {
                 callBack(err, recordset);
                 ps.unprepare(function (err) {
                     if (err)
                         console.log(err);
                 });
             });
         });
     } catch (e) {
         console.log(e)
     }
 };
  
 /**
  * 删除指定表字段
  * @param whereSql 要删除字段的条件语句，例：'where id = @id'
  * @param params 参数，用来解释sql中的@*，例如： { id: id }
  * @param tableName 数据库表名
  * @param callBack 回调函数
  */
 let del = async function (whereSql, params, tableName, callBack) {
     try {
         let ps = new mssql.PreparedStatement(await poolConnect);
         let sql = "delete from " + tableName + " ";
         if (params != "") {
             for (let index in params) {
                 if (typeof params[index] == "number") {
                     ps.input(index, mssql.Int);
                 } else if (typeof params[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                 }
             }
         }
         sql += whereSql;
         ps.prepare(sql, function (err) {
             if (err)
                 console.log(err);
             ps.execute(params, function (err, recordset) {
                 callBack(err, recordset);
                 ps.unprepare(function (err) {
                     if (err)
                         console.log(err);
                 });
             });
         });
     } catch (e) {
         console.log(e)
     }
 };

/**參數取得欲查詢的資料表名稱 以及 欲查詢的屬性ex萃取溶劑
 * 回傳一個2column結果like：
 * 萃取溶劑 count
 * 乙醇     10
 * 甲醇     8
 * 甲酸     1
 * 用以在進階搜時產生選項如甲醇、乙醇
*/
let optionGenerator = async function (tableName, Attribute, topNumber, callBack) {
    try {
        let ps = new mssql.PreparedStatement(await poolConnect);
        let sql = "select " + Attribute + " , COUNT(*) as count";
        if (topNumber != "") {
            sql = "select top(" + topNumber + ") " + Attribute + " , COUNT(*) as count";
        }
        sql += " from " + tableName + " group by " + Attribute;
        sql += " HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC";

        console.log(sql);
        ps.prepare(sql, function (err) {
            if (err) console.log(err);

            ps.execute("", function (err, recordset) {
                callBack(err, recordset);
                ps.unprepare(function (err) {
                    if (err)
                        console.log(err);
                });
            });
        });
    } catch (e) {
        console.log(e)
    }
};
//找出該attribute除了現有選項以外的其他結果[other]
let FindOtherResult_func = async function (tableName, Attribute, callBack) {
    try {
        let ps = new mssql.PreparedStatement(await poolConnect);
        let sql = "SELECT * FROM " + tableName + " WHERE " + Attribute + " IN (";
        sql += "SELECT " + Attribute + " FROM " + tableName + " GROUP BY " + Attribute + " HAVING COUNT(*) = 1";
        sql += ")";
        console.log(sql);
        ps.prepare(sql, function (err) {
            if (err) console.log(err);
            ps.execute("", function (err, recordset) {
                callBack(err, recordset);
                ps.unprepare(function (err) {
                    if (err)
                        console.log(err);
                });
            });
        });
    } catch (e) {
        console.log(e)
    }
};


exports.config = conf;
exports.del = del;
exports.select = select;
exports.update = update;
exports.querySql = querySql;
exports.selectAll = selectAll;
exports.add = add;
exports.optionGenerator = optionGenerator;
exports.FindOtherResult_func=FindOtherResult_func;