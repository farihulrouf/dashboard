const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attachmentSchema = new mongoose.Schema(
  {
    key: { type: String },
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    url: { type: String },
    text: { type: String },
  },
  {
    timestamps: true,
  }
);

const Attachment = mongoose.model("Attachment", attachmentSchema);
module.exports = Attachment;
