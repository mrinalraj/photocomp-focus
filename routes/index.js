let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

router.get('/',(req,res)=>{
    res.render('index')
})


module.exports = router;