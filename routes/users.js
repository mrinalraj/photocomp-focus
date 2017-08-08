let express = require('express'),
    router = express.Router();

router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/upload',(req,res)=>{
    res.render('upload')
})

router.post('/register',(req,res)=>{
    let name=req.body.data.name;

    req.checkBody('name','Name is required').notEmpty;
    
    let errors=req.validationErrors()
    if(errors){
        res.render('register',{
            errors:errors
        })
    }
})

module.exports = router;