var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
   username: String,
   password: String,
   expenses: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Expense"
      }
      ],
    incomes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Income"
      }
      ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);