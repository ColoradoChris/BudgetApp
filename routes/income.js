var express = require('express'),
    router = express.Router(),
    Income = require('../models/income'),
    middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('income/new'); 
});

router.post('/', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
   };
   var newIncome = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
   };
   Income.create(newIncome, function(err, newlyCreated){
      if(err){
          req.flash("error", "Something went wrong...");
          res.redirect("back");
      } else {
          req.flash("success", "Income successfully added!");
          res.redirect("/dashboard");
      }
   });
});

module.exports = router;