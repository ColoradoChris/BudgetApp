var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user'),
    flash = require('connect-flash');
    
var indexRoutes = require('./routes/index');

//MongoDB Connection    
mongoose.connect(process.env.DATABASEURL);

//Express Session Setup
app.use(require('express-session')({
    secret: "Batman is the best superhero.",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

//Passport Setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass to all Templates - User and Flash Messages
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

//Routes
app.use('/', indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started."); 
});