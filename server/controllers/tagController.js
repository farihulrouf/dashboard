const mongoose = require("mongoose");
const Tag = mongoose.model("Tag");

exports.getTags = async (req, res) =>{
  const tags = await Tag.find({}).sort({frequency : -1})
  res.status(200).json({status : "ok", data: tags});
}

const extractTags = (obj) => {
  if(obj.tags) {
    if(Array.isArray(obj.tags)) return obj.tags
    return [obj.tags]
  }
  if(obj.materials){
    if(obj.prerequisites) return obj.materials.concat(obj.prerequisites)
    return obj.materials
  }
  return [];
}

exports.addTags = async(req, res, next) =>{
  let tags = extractTags(req.body)
  if(tags.length > 0){
      await Tag.updateMany({name: {$in: tags}}, {$inc : {frequency : 1}}, {upsert:true});
      tags = await Tag.find({name: {$in: tags}})
  }
  req.body.tags = tags
  next()

  // return res.status(200).json({status : "ok", tag: newtags})
}

exports.deleteTags = async(req, res, next) =>{
  const tags = extractTags(req.post || req.discussion || req.body)
  if(tags.length > 0){
    await Tag.updateMany(
      {name: {$in: tags}},
      {$inc: {frequency : -1}},
    );
  }

  next()
  // return res.status(200).json({status : "ok", tag: newtags})
}