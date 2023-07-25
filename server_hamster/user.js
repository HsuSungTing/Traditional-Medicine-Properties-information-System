//user.js
const express = require('express');
const db = require('./mssql.js');
const moment = require('moment');
const router = express.Router();
 
//let selectAll = async function (tableName, callBack) {
router.get('/select_all', function (req, res, next) {
    db.selectAll('所有藥材資料表', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});
//select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
router.get('/select_mono', function(req, res, next){
    db.select('所有藥材資料表', "", " where 是否單方 = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
        
    });
});

router.get('/select_double', function(req, res, next){
    db.select('所有藥材資料表', "", " where 是否複方 = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
    });
});
router.get('/select_med', function(req, res, next){
    db.select('所有藥材資料表', "", " where 是否藥材 = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
    });
});

router.get('/ref_link',function(req, res, next){
    db.selectAll('藥材資料來源', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

router.get('/search_result',function(req, res, next){
    const keyword = req.query.keyword; // 获取前端传递的关键字参数
    db.selectAll('所有藥材資料表', function (err, result) {//查询所有
        console.log("Hamster owo");
        arr=[];
        if(keyword === ""){
            res.send("");
            console.log("send nothing!");
        }else{
            var len = result.recordset.length;
            console.log("length is");
            console.log(len);
            var arr = [];
            for(var i=0;i<len;i++){
                //如果字符串中不包含目标字符会返回-1
                if(result.recordset[i].藥材名.indexOf(keyword)>=0){
                    arr.push(result.recordset[i]);
                }
            }
            console.log("arr is");
            console.log(arr);
            res.send(arr);//包含target的words的list
        }
        
    });
});

//let select2Table = async function (table1, commonID, table2, whereSql, params, callBack) {
router.get("/standar",function(req, res, next){
    const nameid = req.query.nameid; // 获取前端传递的关键字参数
    const x = req.query.x; // 获取前端传递的关键字参数
    const y = req.query.y; // 获取前端传递的关键字参数
    db.select2Table('標準品數據表','標準品編號ID', '樣品數據表', 
    "where 藥材ID = @param0 AND 資料來源ID = @param1 AND 樣品編號ID = @param2",  { param0:nameid, param1:x, param2:y},function(err,result){
        res.send(result.recordset);
       
    });
}); 

router.get("/option",function(req, res, next){
    const Attribute = req.query.Attribute;
    try {
        const max = req.query.max;
        console.log("max 值為:", max);
        if(max===undefined) max="";
    }catch (ReferenceError) {
        console.log("max 未指定");
        max=""
    }
    db.optionGenerator('樣品數據表',Attribute,max,function(err,result){
        res.send(result.recordset);
    });
});
//let select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
router.get("/filter_result",function(req, res, next){
    const parent = req.query.parent;
    const attr = req.query.attr;
    db.select('樣品數據表',"",`where ${parent}=@param`,{param:attr},"",function(err,result){
        const extractedValues = [];
        for (const item of result.recordset) {
            const valuesArray = x = `${item.藥材ID.toString().padStart(2, '0')}${item.資料來源ID.toString().padStart(3, '0')}${item.樣品編號ID.toString().padStart(3, '0')}`;
            extractedValues.push(valuesArray);
        }
        res.send(extractedValues);
        //console.log(extractedValues);
    });
});

router.get("/option_search_result",function(req, res, next){
    const num = req.query.num;
    const nid = parseInt(num.substring(0, 2), 10);
    const x = parseInt(num.substring(2, 5), 10);
    const y = parseInt(num.substring(5, 8), 10);
    db.select('樣品數據表',"",`where 藥材ID=@param1 and 資料來源ID=@param2 and 樣品編號ID=@param3`,{param1:nid,param2:x,param3:y},"",function(err,result){
        res.send(result.recordset);
    });
});
module.exports = router;

