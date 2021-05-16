const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");
const xml2js = require('xml2js')
const hasha = require('hasha');
const { default: axios } = require("axios");
const util = require('util')

const emailValidator = (v) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(v).toLowerCase());
}

const userNotificationSchema = mongoose.Schema({
    bankNotification: {
        type: ObjectId,
        ref: "BankNotification"
    },
    status: {
        type: String,
        enum: [
            'read', 'unread'
        ],
        default: 'unread'
    }
})

const userSchema = new mongoose.Schema({
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
    otp: {type: String, trim: true},
    otpValidUntil: {type: Date},
    active: {type: Boolean, default: false},
    name: {
        type: String,
        trim: true,
        required: "Name is required",
        validate: {
            validator: (v) => {
                return (v.length > 4 && v.length < 15)
            },
            message: props => `${props.value} should be > 4 and <15 chars`
        }
    },
    avatar: {
        type: String
    },
    about: {
        type: String,
        trim: true,
        default: ""
    },
    linkedIn: {
        type: String,
        trim: true,
        default: ""
    },
    isAnOrganization: {
        type: Boolean,
        default: false,
        required: "Organization field is required"
    },
    isAnInstructor: {
        type: Boolean,
        default: false,
        required: "IsAnIstructor field is required"
    },
    teachers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    notifications: {
        total: {
            type: Number,
            default: 0
        },
        unread: {
            type: Number,
            default: 0
        },
        list: [
            {
                type: userNotificationSchema
            }
        ]
    },
    organization: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ]
},

/* gives us "createdAt" and "updatedAt" fields automatically */
{timestamps: true});

const autoPopulateFollowingAndFollowers = function (next) {
    this.populate("following", "_id name avatar");
    this.populate("followers", "_id name avatar");
    this.populate("teachers", "_id name avatar");
    next();
};

//COURSE AUTHORIZATION
userSchema.methods.canCreateCourse = function () {
    //A organization or a user without any organization
    return this.isAnOrganization || this.organization.length == 0;
};

//canAccessCourse true if a user can access all course stuffs (materials, video, room conference, etc..)
userSchema.methods.canAccessCourse = function (c) {
    const instructor_ids = c.instructors.map((v)=> (typeof v === "object") ? v._id : v)
    const participant_ids = c.participants.map((v) => (typeof v === "object" ? v._id : v))
    return instructor_ids.includes(this._id) || participant_ids.includes(this._id)
}

//SUBJECT/HOME AUTHORIZATION
userSchema.methods.canShowSyllabus = function (c){
  return true
}

userSchema.methods.canJoinRoom = function (c){
  return true
}

userSchema.methods.canCRUDRoom = function (c){
  return true
}

userSchema.methods.canCreatePost = function (c){
  return true
}

userSchema.methods.canUpdatePost = function (c){
  return true
}

userSchema.methods.canDeletePost = function (c){
  return true
}

userSchema.methods.canGetPost = function (c){
  return true
}

userSchema.methods.canSearchPost = function (c){
  return true
}

userSchema.methods.canFilterPost = function (c){
  return true
}

//SUBJECT/DISCUSSION AUTHORIZATION
userSchema.methods.canCreateDiscussion = function(d) {
  //Check if a user can create a discussion on the given courseId
  return true;
}

userSchema.methods.canEditDiscussion = function(discussion){
  return this._id.equals(discussion.creator._id)
}

userSchema.methods.canDeleteDiscussion = function(discussion){
  let canDelete = false;
  [discussion.creator._id, discussion.creator._id].forEach((e) => {
    if(e.equals(this._id)) canDelete = true;
  })
  return canDelete;
}

userSchema.methods.canSearchDiscussion = function(d) {
  //Check if a user can create a discussion on the given courseId
  return true;
}

userSchema.methods.canFilterDiscussion = function(d) {
  //Check if a user can create a discussion on the given courseId
  return true;
}

userSchema.methods.canVoteDiscussion = function(d) {
  //Check if a user can create a discussion on the given courseId
  return true;
}

userSchema.methods.canVoteAnswer = function(d) {
  //Check if a user can create a discussion on the given courseId
  return true;
}

//ROLE IDENTIFIER
//Teacher untuk sebuah organisasi --> user.organiztion ! =[]
//Private teacher ---> user.organization = [] && user.courses != []
userSchema.methods.isInstructor = function (course) {
    //isInstructor is true if a user is an instructor of a given course
    const instructor_ids = course.instructors.map((val) => typeof val === "object" ? val._id.toString() : val )   
    return instructor_ids.includes(this._id.toString());
}

userSchema.methods.isParticipant = function (course) {
  const participant_ids = course.participants.map((v) => (typeof v === "object" ? v._id : v))
  return participant_ids.includes(this._id)
}

userSchema.methods.isCreator = function (course) {
  const creator_id = typeof (course.creator) === "object" ? course.creator._id : course.creator
  return creator_id == this._id
}

userSchema.pre("findOne", function (next) {
    const populatedPaths = this.getPopulatedPaths();
    // if (populatedPaths.length === 0) {
    //     return autoPopulateFollowingAndFollowers.bind(this)(next);
    // }
    if(!this._fields) this.select("-notifications")
    next();
});

userSchema.index({ name: "text"});

/* passportLocalMongoose takes our User schema and sets up a passport "local" authentication strategy using our email as the username field */
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
userSchema.plugin(mongodbErrorHandler);


function parseStringSync (str) {
    var result;
    new xml2js.Parser({explicitArray: false}).parseString(str, (e, r) => { result = r });
    return result;
}

userSchema.methods.canCreateRoom = async function(course){
    return course.instructors.includes(this._id) || course.creator._id === this._id
}

userSchema.methods.join = async function(room){
    await room.getLink();
    let userParams = {
        fullName: this.name,
        userID: this._id
    }
    let roomParams = {
        meetingID: room.meetingID,
        password: this.isInstructor(room.course)? room.moderatorPW : room.attendeePW,
        redirect: true
    }
    const params = Object.entries({...userParams, ...roomParams}).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
    const checksum = hasha(`join${params}${process.env.BBB_SECRET_KEY}`,{algorithm: 'sha1'})
    const queryString = `${process.env.BBB_END_POINT}api/join?${params}&checksum=${checksum}`
    //const {data} = await axios.get(queryString)
    return queryString;
}

module.exports = mongoose.model("User", userSchema);
