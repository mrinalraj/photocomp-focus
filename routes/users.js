let express = require('express'),
    router = express.Router(),
    user = require('../model/user');

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/upload', (req, res) => {
    res.render('upload')
})

router.post('/register', (req, res) => {

    let name = req.body.name,
        year = req.body.year,
        email = req.body.email,
        phone = req.body.phone,
        password = req.body.password,
        password2 = req.body.password2,
        accept = req.body.accept;

    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('year', 'Year is required').notEmpty()
    req.checkBody('year', 'Year must be numeric').isNumeric()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
    req.checkBody('accept', 'You must accept the terms and conditions').equals('on')

    var errors = req.validationErrors()

    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            year: year,
            phone: phone,
            email: email
        })
    }
    else {
        let newUser = new user({
            name: name,
            year: year,
            phone: phone,
            email: email,
            password: password
        });

        user.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
        req.flash('success_msg','You are now registered and can login to upload photos')

        res.redirect('/users/upload')
    }

})

module.exports = router;