const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");
const xml2js = require('xml2js')
const hasha = require('hasha');
const { default: axios } = require("axios");
const util = require('util')
const Course = require("./Course");

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
    return this.isInstructor(c) || this.isParticipant(c)
}

//SUBJECT/HOME AUTHORIZATION
userSchema.methods.canShowSyllabus = function (c){
  return true
}

userSchema.methods.canJoinRoom = function (c){
	return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canCRUDRoom = function (c){
  return this.isInstructor(c)
}

userSchema.methods.canCreatePost = function (c){
  return this.isInstructor(c)
}

userSchema.methods.canUpdatePost = async function (p){
    const c = await Course.findById(p.postedOn._id)
    const postCreator_id = typeof (p.postedBy) === "object" ? p.postedBy._id.toString() : p.postedBy
    return (this.isInstructor(c) && (this._id.toString() == postCreator_id))
}

userSchema.methods.canDeletePost = async function (p){
    const c = await Course.findById(p.postedOn._id)
    const postCreator_id = typeof (p.postedBy) === "object" ? p.postedBy._id.toString() : p.postedBy
    return (this.isInstructor(c) && (this._id.toString() == postCreator_id))
}

userSchema.methods.canGetPost = function (c){
  return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canSearchPost = function (c){
	return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canFilterPost = function (c){
  return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

//SUBJECT/DISCUSSION AUTHORIZATION
userSchema.methods.canCreateDiscussion = function(c) {
  //Check if a user can create a discussion on the given courseId
  return this.isParticipant(c)
}

userSchema.methods.canEditDiscussion = async function(d){
    const c = await Course.findById(d.postedOn._id)
    const creator_id = typeof (d.creator) === "object" ? d.creator._id.toString() : d.creator
    return (this.isInstructor(c) || (creator_id === this._id.toString()))
}

userSchema.methods.canDeleteDiscussion = async function(d){
    const c = await Course.findById(d.postedOn._id)
    const creator_id = typeof (d.creator) === "object" ? d.creator._id.toString() : d.creator
    return (this.isInstructor(c) || (creator_id === this._id.toString()))
}

userSchema.methods.canSearchDiscussion = function(c) {
  //Check if a user can search a discussion on the given courseId
  return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canFilterDiscussion = function(c) {
  //Check if a user can filter a discussion on the given courseId
  return (this.isOrganization(c) || this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canVoteDiscussion = function(c) {
  //Check if a user can vote a discussion on the given courseId
  return (this.isInstructor(c) || this.isParticipant(c))
}

userSchema.methods.canVoteAnswer = function(c) {
  //Check if a user can vote an answer on the given courseId
  return (this.isInstructor(c) || this.isParticipant(c))
}

//ROLE IDENTIFIER
//Teacher untuk sebuah organisasi --> user.organiztion ! =[]
//Private teacher ---> user.organization = [] && user.courses != []
userSchema.methods.isInstructor = function (course) {
    //isInstructor is true if a user is an instructor of a given course || Private teacher for that given course
    const instructor_ids = course.instructors.map((val) => typeof val === "object" ? val._id.toString() : val )   
    const creator_id = typeof (course.creator) === "object" ? course.creator._id.toString() : course.creator
    const isPrivateTeacher = (creator_id === this._id.toString()) && (!this.isAnOrganization)
    return instructor_ids.includes(this._id.toString()) || isPrivateTeacher;
}

userSchema.methods.isParticipant = function (course) {
  const participant_ids = course.participants.map((v) => (typeof v === "object" ? v._id.toString() : v))
  return participant_ids.includes(this._id.toString())
}

userSchema.methods.isOrganization = function (course) {
    //isOrganization is true if a user is an organization and the creator of a given course
  const creator_id = typeof (course.creator) === "object" ? course.creator._id.toString() : course.creator
  return ( (creator_id === this._id.toString()) && this.isAnOrganization)
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
