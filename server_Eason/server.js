//引入express
const express = require('express')

let server = express() //server是物件
server.use(express.urlencoded()) //中间件要写在启动文件里面

const cors = require('cors')
server.use(cors())//CORS (Cross-Origin Resource Sharing) 是一种安全机制，用于控制跨域资源共享

const user = require('./user.js')

server.use('/', user)

//3.开启服务器
server.listen(5000, () => {
    console.log('Yey, your server is running on port 5000')
})