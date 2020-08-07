const mongoose = require("mongoose");
const User = mongoose.model("User");
const TeacherApplication = mongoose.model("TeacherApplication");


exports.getApplicationById = async (req,res,next,id)=>{
    const application = await TeacherApplication.findOne({_id: id})
    req.application = application;
    next();
}

exports.createApplication = async (req, res, next) => {
    const {user} = req;
    const {organizationId} = req.body;
    const organization = await User.findById(organizationId);
    if(organization){
        const condition = {organization: organization,teacher: user}
        try{
            const application = await TeacherApplication.findOneOrCreate(condition, condition);
            req.query = {type: "org"}
            return next();
        }catch(e){
            return res.json({status: "error", message: e});
        }
    }
    res.json({status: "error", message: "Organization is not found"});
}

exports.cancelApplication = async (req,res, next) => {
    try{
        const {application} = req;
        const result = await application.delete();
        if(!!result){
            req.query = {type: "org"}
            return next();
        }
        res.json({status: "error", message: "Can't cancel request"});
    }catch(err){
        res.json({status: "error", message: err})
    }
}