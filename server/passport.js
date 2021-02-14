const passport = require("passport"), LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(new LocalStrategy({usernameField: 'email'},
    async (username, password, cb) => {
        const user = await User.findOne({email: username})
        if(!user) return cb(null, false, new Error("User doesn't exist"))
        if (user && !user.active) {
            return cb(null, false, new Error("Please activate your email!!"));
        }
        auth_res = await user.authenticate(password)
        if(!auth_res.user) return cb(null, false, new Error("Username or password is wrong"))
        else return cb(null, user, auth_res.error)
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.email);
  });
  
passport.deserializeUser(async function(user, done) {
    const u = await User.findOne({email: user})
    done(null, u);
});