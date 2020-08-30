const mongoose = require("mongoose");
const Attachment = mongoose.model("Attachment");

exports.createAttachment = async (req, res, next) => {
  let newAttachmentSchema = new Attachment(req.body);

  newAttachmentSchema
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.fetchSingleAttachment = async (req, res) => {
  Attachment.find({name: req.params.id})
    .then((attachment) => res.json(attachment))
    .catch((err) => res.Status(400).json("Error " + err));
};
