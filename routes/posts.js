var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/',checkLogin,function(req,res){
    res.render('posts'); //主页
})

module.exports = router;