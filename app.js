var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');
    
mongoose.connect('mongodb://localhost/budget_app');

app.use(require('express-session')({
    secret: "Batman is the best superhero.",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.get('/', function(req, res){
   res.render('index'); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started."); 
});