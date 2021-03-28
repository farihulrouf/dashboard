const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

var tagSchema = mongoose.Schema({
  name : {type : String},
  frequency : {type : Number, default:0}
}, {timestamps: true})

tagSchema.index({ name: 1 });

module.exports = mongoose.model("Tag", tagSchema);