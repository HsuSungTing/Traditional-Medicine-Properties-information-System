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
//後面還有add selectAll update select del 要處理


  
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
  * 按条件和需求查询指定表
  * @param table1 数据库表名1 取出資料的表，例：'news'
  * @param commonID 兩個數據表參照之同名ID(若不同名需修改此function)
  * @param table2 数据库表名2 參照用的表，例：'news'
  * @param whereSql 条件语句，例：'where id = @id'
  * @param params 参数，用来解释sql中的@*，例如： { id: id }
  * @param callBack 回调函数
  */
 let select2Table = async function (table1, commonID, table2, whereSql, params, callBack) {
    try {
        let ps = new mssql.PreparedStatement(await poolConnect);
        let sql = "select * from " + table1 + " ";
        sql +="where " +table1+'.'+ commonID + " in ";
        sql +="( select " + commonID +" from "+ table2 +" ";
        sql += whereSql + " );";
         if (params != "") {
             for (let index in params) {
                 if (typeof params[index] == "number") {
                     ps.input(index, mssql.Int);
                 } else if (typeof params[index] == "string") {
                     ps.input(index, mssql.NVarChar);
                 }
             }
         }

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

 let optionGenerator = async function (tableName, Attribute, topNumber, callBack) {
    try {
        let ps = new mssql.PreparedStatement(await poolConnect);
        let sql = "select " + Attribute + " , COUNT(*) as count";
        if (topNumber != "") {
            sql = "select top(" + topNumber + ") " + Attribute + " , COUNT(*) as count";
        }
        sql += " from " + tableName + " group by " + Attribute;
        sql += " HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC"
        
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
 exports.select2Table = select2Table;
 exports.add = add;
 exports.optionGenerator = optionGenerator;