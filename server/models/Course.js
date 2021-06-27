const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const CONSTANT = require('../../constant');

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Course name is required'
        },
        logo: {
            type: String,
            default: ""
        },
        about: {
            type: String,
            trim: true,
            required: 'Please fill in course description'
        },
        prerequisites: {
            type: [String],
            required: 'Course must have prerequisite info',
            validation: {validator: (prerequisite) => prerequisite.length, message: 'Course must have prerequisite info'}
        },
        materials:{
            type: [String],
            required: 'Course must have materials info',
            validation: {validator: (materials) => materials.length, message: 'Course must have materials info'}
        },
        price: {
            type: Number,
            required: 'Course should have price, input 0 for free courses',
            validation: {validator: (price)=>price>=0, message: 'Price should not be less than 0'}
        },
        rating: {
            type: Number,
            default: 0
        },
        countReview:{
          type : Number,
          default : 0
        },
        instructors: [{type: ObjectId, ref: "User"}],
        participants: [{ type: ObjectId, ref: "User"}],
        posts: [{type: ObjectId, ref: "Post"}],
        creator: {type: ObjectId, ref: "User"},
        syllabus : [{
            title : {type: String, trim: true},
            description : {type : String, trim : true},
            date : {type : Date}
        }],
        accessibility: {type: String, enum: ['private','public','protected'], default: 'private'}

    },
    {timestamps: true}
)

const autoPopulate = function(next){
    this.populate("instructors", "_id name avatar linkedIn");
    this.populate("participants","_id name avatar linkedIn");
    this.populate("creator","_id name avatar linkedIn teachers isAnOrganization");
    next();
}

courseSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)
    .pre("findById", autoPopulate)

courseSchema.index({ name: 1 });
courseSchema.index({ about: 1 })
courseSchema.index({createdAt: 1 });
courseSchema.index({instructors: 1})

courseSchema.methods.getStatus = function(payment, user){
  //Check user enrollment status
  //2 = Enrolled
  //1 = Pending
  //0 = Not enrolled
  if(this.participants.find(e=> e._id.equals(user._id)) || payment.find(e => e.user.equals(user._id) && (e.status === "PAID") )){
    return CONSTANT.PAYMENT_STATUS_PAID;
  }
  else if(payment.find(e => e.user.equals(user._id) && (e.status === "PENDING") )){
    return CONSTANT.PAYMENT_STATUS_PENDING;
  }
  else{
    return CONSTANT.PAYMENT_STATUS_UNREGISTERED;
  }
}

module.exports = mongoose.model("Course", courseSchema);