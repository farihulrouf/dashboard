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
    const { name, about, linkedIn } = req.body;
    let user = await User.findOne({_id : req.user});
    user.name = name
    user.about = about
    user.linkedIn = linkedIn
    // console.log(user)
    user.save((err,user)=>{
        if(!err){
          res.json({status: "ok", user: user});
        }
        else res.json({status: "error"})
    })
}