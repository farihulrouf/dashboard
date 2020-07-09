const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");

exports.getUserById = async (req, res, next, id) => {
    const user = await User.findOne({_id: id});
    req.user = user
    if(req.user){
        return next();
    }
    next();
};