const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var teacherApplicationSchema = mongoose.Schema({
    organization: {type: ObjectId, ref: "User"},
    teacher: {type: ObjectId, ref: "User"},
    status: {type: String, enum: ["joined","pending"], default: "pending"}
},{timestamps: true})

teacherApplicationSchema.plugin(mongoosePaginate);
teacherApplicationSchema.index({organization: 1, teacher: 1})

const autoPopulate = function(next){
    this.populate("organization", "_id name avatar");
    this.populate("teacher", "_id name avatar")
    next();
}

teacherApplicationSchema
    .pre("find", autoPopulate)
    .pre("findOne", autoPopulate)

teacherApplicationSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
    const self = this;
    const newDocument = doc;
    return new Promise((resolve, reject) => {
        return self.findOne(condition)
        .then((result) => {
            if (result) {
                return resolve(result);
            }
            return self.create(newDocument)
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        console.log(error);
                        return reject(error);
                    })
        }).catch((error) => {
            console.log(error);
            return reject(error);
        })
    });
    };

module.exports = mongoose.model("TeacherApplication", teacherApplicationSchema);