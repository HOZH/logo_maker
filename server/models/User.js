var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  id: String,
  email: String,
  firstName: String,
  lastName: String,
  hash: String,
  salt: String,
});

module.exports = mongoose.model("User", UserSchema);
