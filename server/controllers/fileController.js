const AWS = require('aws-sdk'); // Requiring AWS SDK.

// Configuring AWS
AWS.config = new AWS.Config({
    accessKeyId: process.env.S3_KEY, // stored in the .env file
    secretAccessKey: process.env.S3_SECRET, // stored in the .env file
    region: process.env.BUCKET_REGION // This refers to your bucket configuration.
});

const s3 = new AWS.S3();

const Bucket = process.env.BUCKET_NAME;

exports.getPreSignedUrl = async (req,res) => {
    const { Key } = req.body;
    const params = {
        Bucket,
        Key,
        Expires: 120 // 2 minutes
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          res.send(err);
        } else {
          res.send(url);
        }
    });
}

exports.putPreSignedUrl = async (req,res) => {
    // Note Bucket is retrieved from the env variable above.
    const {Key, ContentType} = req.body;
    const params = { Bucket, Key, ContentType };
    // Note operation in this case is putObject
    s3.getSignedUrl('putObject', params, function(err, url) {
      if (err) {
        res.json({status: "error", message: err});
      }
      // If there is no errors we can send back the pre-signed PUT URL
      res.json({status: "ok", url: url});
    });
}