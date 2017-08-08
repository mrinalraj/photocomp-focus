const express = require('express'),
    router = express.Router(),
    user = require('../model/user'),
    multer = require('multer'),
    dropbox = require('dropbox'),
    path = require('path'),
    fs = require('fs'),
    DAPI = new dropbox({accessToken: process.env.DROPBOX}),
    os = require('os'),
    uploads = multer({
        dest: os.tmpdir()
    });

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/upload/:id', (req, res) => {
    res.render('upload', {id: req.params['id']})
})

router.post('/upload/:id', uploads.single('input2[]'), (req, res, next) => {

    if (req.file) {
        let id = req.params["id"];

        let filename = id + path.extname(req.file.originalname)

        fs.readFile(req.file.path, null, (err, file) => {
            if (err) {
                res
                    .status(500)
                    .end();
                console.error(`Error in File upload, ID: ${req.params["id"]}, ${err.message}`)
                return
            }

            DAPI
                .filesUpload({
                path: "/PhotoComp_Submissions/" + filename,
                contents: file,
                autorename: false,
                mode: "add"
            })
                .then(result => {
                    console.log(`${result.name} uploaded successfully`);
                    res
                        .status(200)
                        .end()
                }, error => {
                    console.error(`Error in upload, ${err.message}`)
                    res
                        .status(500)
                        .end()
                });

        })
    } else {
        res.status(400).end()
    }
});

router.post('/register', (req, res) => {
    if (req.body) {
        let name = req.body.name,
            year = req.body.year,
            email = req.body.email,
            phone = req.body.phone,
            password = req.body.password,
            password2 = req.body.password2,
            accept = req.body.accept;

        req
            .checkBody('name', 'Name is required')
            .notEmpty()
        req
            .checkBody('year', 'Year is required')
            .notEmpty()
        req
            .checkBody('year', 'Year must be numeric')
            .isNumeric()
        req
            .checkBody('email', 'Email is required')
            .notEmpty()
        req
            .checkBody('email', 'Email is not valid')
            .isEmail()
        req
            .checkBody('password', 'Password is required')
            .notEmpty()
        req
            .checkBody('password2', 'Passwords do not match')
            .equals(req.body.password)
        req
            .checkBody('accept', 'You must accept the terms and conditions')
            .equals('on')

        var errors = req.validationErrors()

        if (errors) {
            res.render('register', {
                errors: errors,
                name: name,
                year: year,
                phone: phone,
                email: email
            })
        } else {
            let idno = makeid();
            let newUser = new user({
                idno: idno,
                name: name,
                year: year,
                phone: phone,
                email: email,
                password: password
            });

            user.createUser(newUser, function (err, user) {
                if (err) 
                    throw err;
                console.log(user);
            });
            req.flash('success_msg', 'You are now registered and can login to upload photos. Your Id is ' + idno)

            res.redirect('/users/upload/' + idno)
        }
    }
})

router.get('/list', (req, res) => {
    user
        .user2
        .find({}, (err, result) => {
            let obj = []
            for (let i = 0; i < result.length; i++) {
                let id = result[i].idno
                obj.push({id: id, name: result[i].name, year: result[i].year, phone: result[i].phone, email: result[i].email})
            }
            res.render('list', {obj: obj})
        })
})

module.exports = router;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) 
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}