const mongoose = require("mongoose");
const Tag = mongoose.model("Tag");

exports.getTags = async (req, res) =>{
  const tags = await Tag.find({}).sort({frequency : -1})
  res.status(200).json({status : "ok", data: tags});
}

exports.addTags = async(req, res, next) =>{
  const tag = req.body.tag || req.body.materials.concat(req.body.prerequisites);
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
  if(req.post || req.discussion){
    var {tag} = req.post || req.discussion;
    tag = tag.map(val => val.name)
  }else{
    tag = req.body.materials.concat(req.body.prerequisites);
  }

  let newtag
  if(tag){
    for (let i = 0; i <tag.length; i++){
      newtag = await Tag.findOneAndUpdate(
        {name:tag[i]},
        {$inc : {frequency : -1}},
        {new : true},
      );
    }
  }

  next()
  // return res.status(200).json({status : "ok", tag: newtags})
}