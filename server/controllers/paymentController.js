const axios = require('axios');
const mongoose = require("mongoose");
const crypto = require('crypto');
const {ObjectId} = require("mongodb");
const Payment = mongoose.model("Payment");
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;

exports.getMyPayment = async (req, res) => {
  const {user} = req;
  const payment = await Payment.find({user : user});
  return res.json({status: "ok", payment: payment})
}

exports.createPayment = async (req, res) => {
  const username = process.env.XENDIT_API_KEY;
  const password = '';

  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  const url = 'https://api.xendit.co/v2/invoices';
  const user = ObjectId(req.user._id);
  const course = ObjectId(req.body.course._id);
  var payment = new Payment({
    user : user,
    course : course,
  });

  payment.save( function (err) {
    if (err) {
      return res.json({error : err});
    }
  })

  const external_id = payment._id;

  let body = {
    payer_email : req.user.email,
    description : req.body.course.name,
    amount : req.body.course.price
  };
  body.should_send_email = true;
  body.external_id = external_id;
  body.success_redirect_url = ROOT_URL + `/subjects?id=${req.body.course._id}`;
  body.failure_redirect_url = ROOT_URL + `/subjects?id=${req.body.course._id}`;

  body = JSON.stringify(body);

  console.log('request');
  console.log(body);
  
  axios.post(url, body, {
    headers: {
      'Authorization' : `Basic ${token}`,
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    }
  })
  .then(response => {
    const data = response.data;

    Payment.findByIdAndUpdate(
      {_id : data.external_id},
      {
        payment_number : '',
        xendit_id : data.id,
        invoice_url : data.invoice_url,
        status : data.status,
        blob_response : JSON.stringify(data),
        external_id : data.external_id,
        expiry_date : data.expiry_date
      },
      function (err){
        if (err){
          return res.json({error : err});
        }
      }
    );
    res.json(data);
  })
  .catch(err => {
    res.json({error : err});
  })
};

exports.paymentCallback = async (req, res) => {
  if (req.headers['x-callback-token'] === process.env.XENDIT_VERIF_KEY){
    var payment = await Payment.findOneAndUpdate(
      {xendit_id : req.body.id,
      external_id: req.body.external_id},
      {status : req.body.status},
      function (err){
        if (err){
          return res.json({error : err});
        }
      }
    )
  
    return res.json({status: "ok", payment: payment});
  }
  return res.json({status: "error", message: "permission denied"});
}

createExternalId = (email, desc) => {
  const hash = crypto.createHash('sha256').update(email + desc).digest('hex');
  const ext_id = 'INV' + hash;
  console.log(ext_id);
  return ext_id;
};