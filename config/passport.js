//First import module, then export anonymous function that invokes user model
const passport = require('passport');
module.exports = function() {
  const User = require('../models/user');

//SERIALIZER-------------------------------------------------------------------------------------
//When a user is authenticated, Passport will save its _id property to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

//DESERIALIZER-----------------------------------------------------------------------------------
//Later on, when the user object is needed, Passport eill use the _id property to grab the user object from the database
  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, '-password -salt', (err, user) => { //DON'T bring password and salt fields
      done(err, user);
    });
  });

  require('./local')(); //uses other config file 'local' function
};