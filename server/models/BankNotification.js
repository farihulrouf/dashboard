
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

const bankNotifSchema = mongoose.Schema({
    photo: {type: String, required: 'Notif photo is required'},
    url: {type: String, required: 'Notif url is required'},
    message: {type: String, required: true},
    notifOn: {type: ObjectId, required: true, ref: 'onModel'},
    processed: {type: Boolean, default: false},
    creator: {type: ObjectId, ref: 'User'},
    onModel: {
        type: String,
        required: true,
        enum: ['Course', 'Post', 'Comment']
    }
},{timestamps: true})

bankNotifSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
    const self = this;
    const newDocument = doc;
    return new Promise((resolve, reject) => {
        return self.findOne(condition)
        .then((result) => {
            if (result) {
                result._doc.isExist = true;
                return resolve(result);
            }
            return self.create(newDocument)
                    .then((result) => {
                        return resolve(result);
                    }).catch((error) => {
                        console.log(error);
                        return reject(error);
                    })
        }).catch((error) => {
            console.log(error);
            return reject(error);
        })
    });
};

bankNotifSchema.index({notifOn: 1, creator: 1})

bankNotifSchema.statics.createLikePostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `${user.name} likes your Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post'
    })
    return bankNotif;
};

const BankNotification = mongoose.model("BankNotification", bankNotifSchema);
module.exports = BankNotification;