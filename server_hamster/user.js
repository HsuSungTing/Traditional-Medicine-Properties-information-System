//user.js
const express = require('express');
const db = require('./mssql.js');
const moment = require('moment');
const router = express.Router();

//let selectAll = async function (tableName, callBack) {
router.get('/select_all', function (req, res, next) {
    db.selectAll('AllMed', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});
//select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
router.get('/select_mono', function(req, res, next){
    db.select('AllMed', "", " where Med_mono = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
        
    });
});

router.get('/select_double', function(req, res, next){
    db.select('AllMed', "", " where Med_double = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
    });
});
router.get('/select_med', function(req, res, next){
    db.select('AllMed', "", " where Med_herb = @param",  { param: 1 }, '', function (err, result) {
        res.send(result.recordset)
    });
});

router.get('/ref_link',function(req, res, next){
    db.selectAll('MedSource', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

router.get('/search_result',function(req, res, next){
    const keyword = req.query.keyword; // 获取前端传递的关键字参数
    db.selectAll('AllMed', function (err, result) {//查询所有
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
                if(result.recordset[i].Med_name.indexOf(keyword)>=0){
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
    const stanId = req.query.stanId; // 获取前端传递的关键字参数
    const tbName = req.query.tbName;
    const max = req.query.max;
    console.log("tbName = "+tbName);
    console.log("stanId = "+stanId);
    //select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) 
    db.select(tbName, max, " where Standard_id = @param",  { param: stanId }, '', function (err, result) {
        res.send(result.recordset)
    });
    
}); 

router.get("/option",function(req, res, next){
    const Attribute = req.query.Attribute;
    try {
        const max = req.query.max;
        console.log("max 值為:", max);
        if(max===undefined) max="";
    }catch (ReferenceError) {
        console.log("max 未指定");//把多數選項篩出來剩下列在其他
        max=""
    }
    db.optionGenerator('SampleData',Attribute,max,function(err,result){
        res.send(result.recordset);
    });
});
//encode

router.get("/filter_result",function(req, res, next){
    const tableName = req.query.tbName;
    const parent = req.query.parent;
    const attr = req.query.attr;
    db.select(tableName,"",`where ${parent}=@param`,{param:attr},"",function(err,result){
        const extractedValues = [];
        if(tableName==="SampleData"){
            for (const item of result.recordset) {
                const valuesArray = `${item.Med_id.toString().padStart(2, '0')}${item.Source_id.toString().padStart(3, '0')}${item.Sample_id.toString().padStart(3, '0')}`;
                extractedValues.push(valuesArray);
            }
        }else if(tableName==="StandardData"){
            for (const item of result.recordset) {
                const valuesArray = `${item.Standard_id.toString().padStart(3, '0')}`;
                extractedValues.push(valuesArray);
            }
        }
        res.send(extractedValues);
        //console.log(extractedValues);
    });
});

//decode
router.get("/option_search_result",function(req, res, next){
    const num = req.query.num;
    if(num.length===8){
        const nid = parseInt(num.substring(0, 2), 10);
        const x = parseInt(num.substring(2, 5), 10);
        const y = parseInt(num.substring(5, 8), 10);
        db.select('SampleData',"",`where Med_id=@param1 and Source_id=@param2 and Sample_id=@param3`,{param1:nid,param2:x,param3:y},"",function(err,result){
            result.recordset.forEach(item => item.source = 'sample');
            res.send(result.recordset);
        });
    }else if(num.length===3){
        const id = parseInt(num).toString();
        console.log(id);
        db.select('StandardData',"",`where Standard_id=@param1`,{param1:id},"",function(err,result){
            result.recordset.forEach(item => item.source = 'standar');
            res.send(result.recordset);
        });
    }else{console.log("num input error.")}
    
});
module.exports = router;
