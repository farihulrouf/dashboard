const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const paymentSchema = new Schema(
  {
    payment_number : {
      type: String,
      default: '',
      // required : "Payment number is required"
    },
    xendit_id: {
      type: String,
      default: '',
    },
    user : {type: ObjectId, ref: "User"},
    course : {type : ObjectId, ref: 'Course'},
    invoice_url : {
      type: String,
      default : '',
      // required : "Invoice URL is required"
    },
    status : {
      type: String, 
      enum: ["PENDING","PAID","SETTLED", "EXPIRED"],
      default : 'PENDING',
      // required : "Status is required"
    },
    blob_response :{
      type: String,
      default : '',
      // required : "Blob response is required"
    },
    external_id : {
      type: String,
      default : '',
      // required : "External ID is required"
    },
    expiry_date : {
      type : String,
      default : '',
      // required : "Expiry date is required"
    }
  },{timestamps: true}
)

const autoPopulate = function(next){
  this.populate("user", "_id name avatar");
  next();
}

paymentSchema
  .pre("findOne",autoPopulate)
  .pre("find",autoPopulate)

paymentSchema.index({payment_number : 1, status : 1, user : 1, course : 1});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

Payment.on('index', error => {
  console.log(error);
});