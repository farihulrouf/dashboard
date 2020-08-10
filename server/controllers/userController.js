const mongoose = require("mongoose");
const User = mongoose.model("User");
const TeacherApplication = mongoose.model("TeacherApplication");
const passport = require("passport");

exports.getUsers = async (req,res) => {
    const {type} = req.query
    const {user} = req;
    const users = await User.find({isAnOrganization: type=="org" })    
    if(type === "org"){
        //user is an organization
        const organizations = {}
        users.forEach((u)=> organizations[u._id]=u)
        const application = await TeacherApplication.find({organization: Object.keys(organizations), teacher: user})
        application.forEach((app)=> {
            let org = organizations[app.organization.id]
            if(org){
                org._doc.status = app.status;
                org._doc.applicationId = app.id
            }
        })
    }
    res.json({status: "ok", users: users})
}


exports.getMyTeachers = async (req,res) => {
    const {user} = req;
    if(!!user){
        return res.json({status: "ok", teachers: user.teachers})
    }
    res.status(401).json({status: "error", message: "unauthorized"});
}

exports.getUserById = async (req, res, next, id) => {
    const profile = await User.findOne({_id: id});
    req.profile = profile //don't use req.user, it will override passport user
    next();
};

exports.getCurrentUser = async (req,res) => {
    res.json({status: "ok", user: req.user})
}

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