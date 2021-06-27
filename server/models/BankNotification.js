
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;
const { NOTIFICATION : { EVENT, TARGET } } = require("../../constant")

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
        enum: ['Course', 'Post', 'Comment', 'Discussion']
    },
    eventType: {
        type: String, 
        required: true,
        enum: Object.values(EVENT)
    },
    target: [{
        type: String,
        required: true,
        enum: Object.values(TARGET)
    }]
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

// HOME
bankNotifSchema.statics.createLikePostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user, eventType: EVENT.LIKE_POST},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `${user.name} likes your Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post',
        eventType: EVENT.LIKE_POST,
        target: [TARGET.INSTRUCTORS]
    })
    return bankNotif;
};

bankNotifSchema.statics.createStudentCommentPostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user, eventType: EVENT.STUDENT_COMMENT_POST},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `Student ${user.name} comments a Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post',
        eventType: EVENT.STUDENT_COMMENT_POST,
        target: [TARGET.INSTRUCTORS]
    })
    return bankNotif;
}

bankNotifSchema.statics.createInstructorCommentPostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user, eventType: EVENT.INSTRUCTOR_COMMENT_POST},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `Instructor ${user.name} comments a Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post',
        eventType: EVENT.INSTRUCTOR_COMMENT_POST,
        target: [TARGET.STUDENTS]
    })
    return bankNotif;
}

bankNotifSchema.statics.createNewPostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user, eventType: EVENT.CREATE_POST},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `${user.name} create a new Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post',
        eventType: EVENT.CREATE_POST,
        target: [TARGET.STUDENTS]
    })
    return bankNotif;
}

bankNotifSchema.statics.createEditPostNotif = async function (user, post) {
    const bankNotif = await this.findOneOrCreate({notifOn: post, creator: user, eventType: EVENT.EDIT_POST},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/posts?id=${post.id}`,
        message: `${user.name} edit a Post`,
        notifOn: post,
        creator: user,
        onModel: 'Post',
        eventType: EVENT.CREATE_POST,
        target: [TARGET.STUDENTS]
    })
    return bankNotif;
}

// COURSE
bankNotifSchema.statics.createPaymentSuccessNotif = async function (user, course) {
    const event = EVENT.PAYMENT_SUCCESS
    const target = [TARGET.STUDENTS, TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${user.name} successfully paid for Course ${course.name}`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createRateCourseNotif = async function (user, course) {
    const event = EVENT.RATE_COURSE
    const target = [TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${user.name} rate a Course`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createFinishCourseNotif = async function (user, course) {
    const event = EVENT.FINISH_COURSE
    const target = [TARGET.ORGANIZATIONS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${user.name} finished a Course`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createStartClassNotif = async function (user, course) {
    const event = EVENT.START_CLASS
    const target = [TARGET.STUDENTS, TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${course.name} class is going to start`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createEnrollCourseNotif = async function (user, course) {
    const event = EVENT.ENROLL_COURSE
    const target = [TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${user.name} successfully enrolled for Course ${course.name}`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createStartLiveStreamNotif = async function (user, course) {
    const event = EVENT.START_LIVE_STREAM
    const target = [TARGET.STUDENTS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${course.name} live stream is going to start`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createUpdateSyllabusNotif = async function (user, course) {
    const event = EVENT.UPDATE_SYLLABUS
    const target = [TARGET.STUDENTS]
    const bankNotif = await this.findOneOrCreate({notifOn: course, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${course.id}`,
        message: `${user.name} update syllabus for course ${course.name}`,
        notifOn: course,
        creator: user,
        onModel: 'Course',
        eventType: event,
        target: target
    })
    return bankNotif;
}

// DISCUSSION
bankNotifSchema.statics.createNewDiscussionNotif = async function (user, discussion) {
    const event = EVENT.CREATE_DISCUSSION
    const target = [TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} create a new Discussion`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createInstructorAnswerDiscussionNotif = async function (user, discussion) {
    const event = EVENT.INSTRUCTOR_CREATE_ANSWER
    const target = [TARGET.STUDENTS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} answer a Discussion about ${discussion.title}`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createStudentAnswerDiscussionNotif = async function (user, discussion) {
    const event = EVENT.STUDENT_CREATE_ANSWER
    const target = [TARGET.STUDENTS, TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} answer a Discussion about ${discussion.title}`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createPinDiscussionNotif = async function (user, discussion) {
    const event = EVENT.PIN_ANSWER
    const target = [TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} pin a Discussion about ${discussion.title}`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createDiscussionSolvedNotif = async function (user, discussion) {
    const event = EVENT.MARK_DISCUSSION_SOLVED
    const target = [TARGET.INSTRUCTORS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} mark discussion about ${discussion.title} solved`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createVoteDiscussionNotif = async function (user, discussion) {
    const event = EVENT.VOTE_DISCUSSION
    const target = [TARGET.STUDENTS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} vote discussion about ${discussion.title}`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

bankNotifSchema.statics.createVoteDiscussionAnswerNotif = async function (user, discussion) {
    const event = EVENT.VOTE_ANSWER
    const target = [TARGET.STUDENTS]
    const bankNotif = await this.findOneOrCreate({notifOn: discussion, creator: user, eventType: event},{
        photo: user.avatar || 'https://w7.pngwing.com/pngs/192/306/png-transparent-computer-icons-encapsulated-postscript-notification-miscellaneous-hat-bell.png',
        url: `/subjects?id=${discussion.postedOn}`,
        message: `${user.name} vote answer in discussion about ${discussion.title}`,
        notifOn: discussion,
        creator: user,
        onModel: 'Discussion',
        eventType: event,
        target: target
    })
    return bankNotif;
}

const BankNotification = mongoose.model("BankNotification", bankNotifSchema);
module.exports = BankNotification;