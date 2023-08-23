//user.js
const express = require('express');
const db = require('./mssql.js');
const moment = require('moment');
const router = express.Router();

//let selectAll = async function (tableName, callBack) {
router.get('/getMedicineData', function (req, res, next) {
    db.selectAll('AllMed', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

//let selectAll = async function (tableName, callBack) {
router.get('/getMedicineSource', function (req, res, next) {
    db.selectAll('SampleData', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});
//全選表五
router.get('/getStandardSource', function (req, res, next) {
    db.selectAll("StandardData", function (err, result) {//查询所有
        res.send(result.recordset)
    });
});


//----------------merge from user table-------------------------------
router.get('/getAllData', function (req, res, next) {//只有router.get會需要req.query，其他都req.body
    const table_name=req.query.table_name;
    db.selectAll(table_name, function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

router.post('/updateData', function (req, res) {
    const targetId = parseInt(req.body.targetId);
    const selected_table=req.body.selected_table;
    let keep_input_obj=req.body.keep_input_obj;
    let whereObj=null;
    //---------------------------
    if(selected_table=="AllMed"){
        delete keep_input_obj["Med_id"];
        whereObj = {
            "Med_id": targetId
        };
    }
    else if(selected_table=="MedSource"){
        delete keep_input_obj["Source_id"];
        whereObj = {
            "Source_id": targetId
        };
    }
    else if(selected_table=="StandardData"){
        delete keep_input_obj["Standard_id"];
        whereObj = {
            "Standard_id": targetId
        };
    }
    else{
        delete keep_input_obj["Med_name"];
        delete keep_input_obj["Med_id"];
        delete keep_input_obj["Source_id"];
        delete keep_input_obj["Sample_id"];
        whereObj = {
            "Sample_id": targetId
        };
    }
    //---------------------------

    db.update(keep_input_obj, whereObj, selected_table, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Data updated successfully');
            res.status(200).send('Data updated successfully');
        }
    });
});

router.post('/add_new_row', function (req, res) {
    const row_id=req.body.row_id;
    const selected_table=req.body.selected_table;
    let addobj=req.body.keep_input_obj;
    //---------------------------
    if(selected_table=="AllMed"){
        addobj["Med_id"]=row_id;
    }
    else if(selected_table=="MedSource"){
        addobj["Source_id"]=row_id;
    }
    else if(selected_table=="StandardData"){
        addobj["Standard_id"]=row_id;
    }
    else{
        addobj["Sample_id"]=row_id;
    }
    //--------------------------------------------
    db.add(addobj, selected_table, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Data updated successfully');
            res.status(200).send('Data updated successfully');
        }
    });
});

//-------------
router.post('/delete_row', function (req, res) {
    const row_id=req.body.row_id;
    const selected_table=req.body.selected_table;
    let whereSql=null;
    let params=null;
    if(selected_table=="AllMed"){
        whereSql="WHERE Med_id = @id";
        params={
            id:row_id
        }
    }
    else if(selected_table=="MedSource"){
        whereSql="WHERE Source_id = @id";
        params={
            id:row_id
        }
    }
    else if(selected_table=="StandardData"){
        whereSql="WHERE Standard_id= @id";
        params={
            id:row_id
        }
    }
    else{
        whereSql="WHERE Sample_id= @id";
        params={
            id:row_id
        }
    }
    console.log("whereSql: ",whereSql);
    console.log("params: ",params);
    console.log("selected_table:",selected_table)
    //--------------------------------------------
    db.del(whereSql, params, selected_table, function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Data updated successfully');
            res.status(200).send('Data updated successfully');
        }
    });
});
//---------------------------------
router.post


module.exports = router;
