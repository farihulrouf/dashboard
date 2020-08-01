const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");


const emailValidator = (v) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(v).toLowerCase());
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email is required",
      validate: {
        validator: emailValidator,
        message: props => `${props.value} is not a valid email!`
      }
    },
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      validate: {
        validator: (v) => {return (v.length>4 && v.length<15)},
        message: props => `${props.value} should be > 4 and <15 chars`
      }
    },
    avatar: {
      type: String
    },
    about: {
      type: String,
      trim: true,
      default: "",
    },
    linkedIn: {
      type: String,
      trim: true,
      default: ""
    },
    isAnOrganization: {type: Boolean, default: false, required: "Organization field is required"},
    teachers: [{type: ObjectId, ref: "User"}],
    organization: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }]
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function(next) {
  this.populate("following", "_id name avatar");
  this.populate("followers", "_id name avatar");
  next();
};

userSchema.methods.canCreateCourse = function () {
  //A organization or a user without any organization
  return this.isAnOrganization || this.organization.length==0;
};

userSchema.methods.isInstructor = function (course) {
  //isInstructor is true if user is a creator or an instructor of a given course
  const {creator, instructors} = course;
  return mongoose.Types.ObjectId(creator).equals(this._id) || instructors.find(e=> mongoose.Types.ObjectId(e._id).equals(this._id));
}

userSchema.pre("findOne", autoPopulateFollowingAndFollowers);

/* passportLocalMongoose takes our User schema and sets up a passport "local" authentication strategy using our email as the username field */
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
userSchema.plugin(mongodbErrorHandler);


module.exports = mongoose.model("User", userSchema);
