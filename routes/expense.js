var express = require('express'),
    router = express.Router(),
    Expense = require('../models/expense'),
    User = require('../models/user'),
    middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('expense/new'); 
});

router.post('/', middleware.isLoggedIn, function(req, res){
    var type = req.body.type;
    var amount = req.body.amount;
    var date = req.body.date;
    var creator = {
      id: req.user._id,
      username: req.user.username
   };
   var newExpense = {
       type: type,
       amount: amount,
       date: date,
       creator: creator
   };
   User.findById(req.user._id, function(err, user){
       if(err){
           console.log(err);
       } else {
            Expense.create(newExpense, function(err, newlyCreated){
                if(err){
                    req.flash("error", "Something went wrong...");
                    res.redirect("back");
                } else {
                    user.expenses.push(newlyCreated);
                    user.save();
                    req.flash("success", "Expense successfully added!");
                    res.redirect("/dashboard");
                }
            });
       }
   });
});

module.exports = router;