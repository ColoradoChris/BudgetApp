var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user'),
    flash = require('connect-flash');

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

//Routes
app.get('/', function(req, res){
    res.render('index'); 
});

app.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/signup', function(req, res){
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect('/signup');
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/dashboard'); 
            });
        }
    }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started."); 
});