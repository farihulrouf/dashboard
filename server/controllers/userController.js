const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");

exports.getUser = async (req,res) => {
    const user = await User.findOne({_id : req.user});
    res.json(user);
}

exports.getUserById = async (req, res, next, id) => {
    const user = await User.findOne({_id: id});
    req.user = user
    if(req.user){
        return next();
    }
    next();
};

exports.updateUser = async (req,res) => {
    const {user} = req;
    const {name, about, linkedIn, avatar} = req.body;
    user.name = name, user.about = about, user.linkedIn = linkedIn, user.avatar = avatar;
    user.save((err,response)=>{
        if(!err){
          res.json({status: "ok", user: response});
        }
        else res.json({status: "error", message: err})
    })
}