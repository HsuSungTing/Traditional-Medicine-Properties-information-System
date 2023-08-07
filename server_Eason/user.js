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

module.exports = router;
