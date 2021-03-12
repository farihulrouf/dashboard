const mongoose = require("mongoose");
const Tag = mongoose.model("Tag");

exports.getTags = async (req, res) =>{
  const tags = await Tag.find({}).sort({frequency : -1})
  res.status(200).json({status : "ok", tags: tags});
}

exports.addTags = async(req, res) =>{
  const {tagnames} = req.body;
  let newtags = []
  let newtag

  for (let i = 0; i <tagnames.length; i++){
    newtag = await Tag.findOneAndUpdate(
      {name:tagnames[i]},
      {$inc : {frequency : 1}},
      {new : true, upsert:true},
    );
    newtags.push(newtag);
  }

  return res.status(200).json({status : "ok", tag: newtags})
}

exports.deleteTags = async(req, res) =>{
  const {tagnames} = req.body;

  let newtags = []
  let newtag

  for (let i = 0; i <tagnames.length; i++){
    newtag = await Tag.findOneAndUpdate(
      {name:tagnames[i]},
      {$inc : {frequency : -1}},
      {new : true},
    );
    newtags.push(newtag);
  }

  return res.status(200).json({status : "ok", tag: newtags})
}