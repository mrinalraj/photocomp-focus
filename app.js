require('dotenv').config()
const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 5000,
    exphbs = require('express-handlebars'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    __public = path.resolve(__dirname, ""),
    mongo = require('mongodb'),
    mongoClient = mongo.MongoClient,
    routes = require(path.resolve(__dirname, 'routes/index')),
    users = require(path.resolve(__dirname, 'routes/users'));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.resolve(__dirname, 'public')))

app.use('/', routes)
app.use('/users', users)

app.listen(PORT, err => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("server started at %d", PORT)
    }
})