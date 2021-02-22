const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");
const Course = mongoose.model("Course");
var otpGenerator = require('otp-generator');
const { updateUser } = require("./userController");
const {sendEmail} = require("../rabbitmq");

exports.validateSignup = (req, res, next) => {
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");

  // Name is non-null and is 4 to 10 characters
  req.checkBody("name", "Enter a name").notEmpty();

  // Email is non-null, valid, and normalized
  req
    .checkBody("email", "Enter a valid email")
    .isEmail()
    //.normalizeEmail();

  // Password must be non-null, between 4 and 10 characters
  req.checkBody("password", "Enter a password").notEmpty();
  req
    .checkBody("password", "Password must be between 4 and 10 characters")
    .isLength({ min: 4, max: 10 });

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).send(firstError);
  }
  next();
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const otp = otpGenerator.generate(process.env.OTP_DIGIT)
  const otpValidUntil = Date.now() + process.env.OTP_VALIDITY_IN_MINUTES*60*1000;
  const user = await new User({ name, email, password, otp, otpValidUntil});
  User.findOne({email: user.email}).then((result)=>{
    if(!result){
      User.register(user, password, (err, user) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        sendEmail(process.env.EMAIL_EXCHANGE, {name: user.name, email: user.email, otp: user.otp})
        const response = {
          _id: user._id, 
          email: user.email, 
          name: user.name,
          otp_length: user.otp.length,
          countdown_time: user.otpValidUntil // in milis
        }
        res.json(response);
      });
    }else if(result && !result.active){
      //User exist but hasn't been activated
      result.name = name
      if(result.otpValidUntil < Date.now()){
        //Update opt if expired
        result.otp = user.otp;
        result.otpValidUntil = user.otpValidUntil;
        sendEmail(process.env.EMAIL_EXCHANGE, {name: result.name, email: result.email, otp: result.otp})
      }
      result.setPassword(password)
      result.save((err, user)=>{
        if(err) return res.status(500).send(err.message);
        const response = {
          _id: user._id, 
          email: user.email, 
          name: user.name,
          otp_length: user.otp.length,
          countdown_time: user.otpValidUntil //in milis
        }
        res.json(response);
      })
    }else{
      return res.status(409).send("Email is already taken")
    }
  })
};

exports.generateNewOTP = async (req, res) => {
  const { email } = req.query;
  user = await User.findOne({email: email});
  if(!user) return res.status(500).send("Can't generate new otp")
  if(Date.now() < user.otpValidUntil || user.active) return res.status(500).send("Can't generate new otp")
  //Generate new otp
  const otp = otpGenerator.generate(process.env.OTP_DIGIT)
  const otpValidUntil = Date.now() + process.env.OTP_VALIDITY_IN_MINUTES*60*1000;
  user.otp = otp;
  user.otpValidUntil = otpValidUntil;
  user.save((err,updatedUser)=>{
    if(err) return res.status(500).send(err.message)
    sendEmail(process.env.EMAIL_EXCHANGE, {name: user.name, email: user.email, otp: user.otp})
    const response = {
      _id: updatedUser._id, 
      email: updatedUser.email, 
      name: updatedUser.name,
      otp_length: updatedUser.otp.length,
      countdown_time: updatedUser.otpValidUntil //in milis
    }
    res.json(response)
  })
}

exports.validateEmail = async (req, res) => {
  const {email, otp} = req.body;
  user = await User.findOne({email: email})
  if(!user) return res.status(500).send("Can't validate OTP")
  if(user.otp !== otp) return res.status(500).send("Wrong OTP, validation error")
  if(user.otp === otp && Date.now()> user.otpValidUntil) return res.status(500).send("OTP Expired, please request a new one")
  user.active = true
  user = await user.save()
  res.json({status: "ok", message: "Email verified", redirect_at: Date.now()+10*1000}) //redirect to sign in page in 5 seconds
}

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, err => {
      if (err) {
        console.log(err);
        return res.status(500).json(err.message);
      }

      res.json(user);
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  res.clearCookie("next-cookie.sid");
  req.logout();
  res.json({ message: "You are now signed out!" });
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  contentType = req.headers['content-type']
  if(!contentType || contentType.indexOf("application/json")) res.redirect("/signin");
  else res.json({status: "error", message: "unauthorized"});
};

exports.checkPostAuth = async (req,res) => {
  //Is req.user allowed to see post ?
  const {user} = req;
  const {postedOn} = req.post;
  const course = await Course.findOne({_id: postedOn}) //instructors: {$in: [user._id]}, participants: {$in: [user._id]}
  if(course){
    return res.json({status: "ok", post: req.post})
  }
  else res.redirect("/")
}
