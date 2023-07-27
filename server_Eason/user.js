//user.js
const express = require('express');
const db = require('./mssql.js');
const moment = require('moment');
const router = express.Router();

//let selectAll = async function (tableName, callBack) {
router.get('/getMedicineData', function (req, res, next) {
    db.selectAll('所有藥材資料表', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

//let selectAll = async function (tableName, callBack) {
router.get('/getMedicineSource', function (req, res, next) {
    db.selectAll('樣品數據表', function (err, result) {//查询所有
        res.send(result.recordset)
    });
});

module.exports = router;