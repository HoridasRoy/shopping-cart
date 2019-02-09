var express = require('express');

var  path = require('path');

var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'publice')));

app.locals.errors = null;

mongoose.connect('mongodb://localhost/shopping_cart')
.then(() => {
  console.log('connected to database');
})
.catch(() =>{
  console.log('connection failed');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;


        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }

        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }

}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');

app.use('/admin/pages',adminPages);
app.use('/admin/categories', adminCategories);
app.use('/', pages);

var port = 3000;
app.listen(port, function(){
    console.log('server is working ......' + port);
})