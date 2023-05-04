let express = require('express')
let router = express.Router()
let user = require('./API/user')

router.get('/user/get',user.get)

module.exports = router