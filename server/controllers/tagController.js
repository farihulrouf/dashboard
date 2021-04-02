const mongoose = require("mongoose");
const Tag = mongoose.model("Tag");

exports.getTags = async (req, res) =>{
  const tags = await Tag.find({}).sort({frequency : -1})
  res.status(200).json({status : "ok", tags: tags});
}

exports.addTags = async(req, res, next) =>{
  const {tag} = req.body;
  let newtags = []
  let newtag
  if(tag){
    for (let i = 0; i <tag.length; i++){
      newtag = await Tag.findOneAndUpdate(
        {name:tag[i]},
        {$inc : {frequency : 1}},
        {new : true, upsert:true},
      );
      newtags.push(newtag);
    }
  }
  req.newtags = newtags
  next()

  // return res.status(200).json({status : "ok", tag: newtags})
}

exports.deleteTags = async(req, res, next) =>{
  const {tag} = req.post;

  // let newtags = []
  let newtag
  if(tag){
    for (let i = 0; i <tag.length; i++){
      newtag = await Tag.findOneAndUpdate(
        {name:tag[i].name},
        {$inc : {frequency : -1}},
        {new : true},
      );
      // newtags.push(newtag);
    }
  }

  next()
  // return res.status(200).json({status : "ok", tag: newtags})
}