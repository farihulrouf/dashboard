const AWS = require('aws-sdk'); // Requiring AWS SDK.
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const s3Zip = require('s3-zip');
const request = require('request');
const ZipStream = require('zip-stream');

// Configuring AWS
AWS.config = new AWS.Config({
    accessKeyId: process.env.S3_KEY, // stored in the .env file
    secretAccessKey: process.env.S3_SECRET, // stored in the .env file
    region: process.env.BUCKET_REGION // This refers to your bucket configuration.
});

const s3 = new AWS.S3();

const Bucket = process.env.BUCKET_NAME;

exports.getPreSignedUrl = async (req,res) => {
    const Key = req.params.filePath;
    const params = {
        Bucket,
        Key,
        Expires: 120 // 2 minutes
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          res.send(err);
        } else {
          console.log(url);
          res.redirect(url);
        }
    });
}

exports.getAllPreSignedUrl = async(req, res) =>{
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (post){
    let filenames = [];

    for (let i = 0; i < post.attachments.length; i++){
      let Key = post.attachments[i].key;
      let params = {
        Bucket,
        Key,
        Expires : 120
      };
      let signedUrl = await s3.getSignedUrlPromise('getObject', params);
      filenames.push({name : post.attachments[i].name, url:signedUrl});
    };
    
    var zip = new ZipStream();
    res.setHeader('Content-Type', 'application/zip, application/octet-stream');
    zip.pipe(res);

    function addNextFile() {
      try{
        var elem = filenames.shift()
        var stream = request(elem.url)
        stream.on('error', function (err){
          console.log(err);
        })
        zip.entry(stream, { name: elem.name }, err => {
            if(err){
              return;
            }
            if(filenames.length > 0){
              addNextFile()
            }
            else{
              zip.finalize()
            }

        })
      }catch(err){
        return res.json({status:'error'})
      }
    }
    addNextFile()
  }
  else{
    return res.json({status : 'error', message:'Post not found'})
  }
}

exports.putPreSignedUrl = async (req,res) => {
    // Note Bucket is retrieved from the env variable above.
    const {FileName, ContentType} = req.body;
    const Key = `${req.user.id}/${Date.now()}-${FileName}`;
    const params = { Bucket, Key, ContentType };
    // Note operation in this case is putObject
    s3.getSignedUrl('putObject', params, function(err, url) {
      if (err) {
        res.json({status: "error", message: err});
      }
      // If there is no errors we can send back the pre-signed PUT URL
      const file = {url: url, key: Key};
      res.json({status: "ok", file: file});
    });
}
