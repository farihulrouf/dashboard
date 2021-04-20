const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const hasha = require('hasha');
const { default: axios } = require("axios");
const xml2js = require('xml2js')

var roomSchema = mongoose.Schema({
  name : {type : String, required: "Room name required"},
  meetingID: {type: String, required: "MeetingID required"},
  maxParticipants: {type: Number, default: 10, required: "Max participant required"},
  attendeePW: {type: String, required: true},
  moderatorPW: {type: String, required: true},
  welcomeMessage: {type: String, required: "Welcome message required"},
  logoutURL: {type: String, required: "Logout path required"},
  course: {type: ObjectId, ref: "Course"}
}, {timestamps: true})

const preValidated = function(next){
  if(!this.meetingID) this.meetingID = `${this.name}_${Date.now()}`
  this.logoutURL = this.logoutURL || `${process.env.PRODUCTION_URL}subjects?id=${this.course._id || this.course}`
  this.attendeePW = this.attendeePW || Math.random().toString(36).substring(7);
  this.moderatorPW = this.moderatorPW || Math.random().toString(36).substring(7);
  next();
}

roomSchema.pre('validate', preValidated)

roomSchema.index({ meetingID: 1 });

function parseStringSync (str) {
  var result;
  new xml2js.Parser({explicitArray: false}).parseString(str, (e, r) => { result = r });
  return result;
}

roomSchema.methods.getLink = async function(){
  //Try to get the link
  const attributes = [
    "name",
    "meetingID",
    "attendeePW", 
    "moderatorPW", 
    "welcomeMessage",
    "logoutURL"
  ]
  let entries = Object.entries(this._doc)
  entries = entries.filter(([k,v]) => attributes.includes(k))
  const params = entries.map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
  const checksum = hasha(`create${params}${process.env.BBB_SECRET_KEY}`,{algorithm: 'sha1'})
  const queryString = `${process.env.BBB_END_POINT}api/create?${params}&checksum=${checksum}`
  const {data} = await axios.get(queryString)
  return parseStringSync(data);
}

roomSchema.methods.getMeetingInfo = async function(){
  //Find info by meetingID
  const params = `meetingID=${encodeURIComponent(this.meetingID)}`
  const checksum = hasha(`getMeetingInfo${params}${process.env.BBB_SECRET_KEY}`,{algorithm: 'sha1'})
  const queryString = `${process.env.BBB_END_POINT}api/getMeetingInfo?${params}&checksum=${checksum}`
  const {data} = await axios.get(queryString)
  return parseStringSync(data);
}

roomSchema.pre("find", function (next){
  if(!this._fields) this.select("name maxParticipants")
  else this.populate("course")
  next()
});

roomSchema.pre("findOne", function (next){
  this.populate("course")
  next()
})

module.exports = mongoose.model("Room", roomSchema);