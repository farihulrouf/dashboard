exports.PAYMENT_STATUS_PAID = "PAID"
exports.PAYMENT_STATUS_PENDING = "PENDING"
exports.PAYMENT_STATUS_UNREGISTERED = "UNREGISTERED"
exports.PAYMENT_STATUS_EXPIRED = "EXPIRED"
exports.NOTIFICATION = {
  EVENT: {
    // COURSE
    PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
    RATE_COURSE: "RATE_COURSE",
    FINISH_COURSE: "FINISH_COURSE",
    START_CLASS: "START_CLASS",
    ENROLL_COURSE: "ENROLL_COURSE",
    START_LIVE_STREAM: "START_LIVE_STREAM",
    UPDATE_SYLLABUS: "UPDATE_SYLLABUS",
    // DISCUSSION
    CREATE_DISCUSSION: "CREATE_DISCUSSION",
    STUDENT_CREATE_ANSWER: "STUDENT_CREATE_ANSWER",
    INSTRUCTOR_CREATE_ANSWER: "INSTRUCTOR_CREATE_ANSWER",
    PIN_ANSWER: "PIN_ANSWER",
    MARK_DISCUSSION_SOLVED: "MARK_DISCUSSION_SOLVED",
    VOTE_DISCUSSION: "VOTE_DISCUSSION",
    VOTE_ANSWER: "VOTE_ANSWER",
    // HOME
    CREATE_POST: "CREATE_POST",
    STUDENT_COMMENT_POST: "STUDENT_COMMENT_POST",
    INSTRUCTOR_COMMENT_POST: "INSTRUCTOR_COMMENT_POST",
    LIKE_POST: "LIKE_POST",
    EDIT_POST: "EDIT_POST"
  },
  TARGET: {
    STUDENTS: "STUDENTS",
    INSTRUCTORS: "INSTRUCTORS",
    ORGANIZATIONS: "ORGANIZATIONS",
    PAYMENT_CREATOR: "PAYMENT_CREATOR",
    DISCUSSION_CREATOR: "DISCUSSION_CREATOR",
    DISCUSSION_ANSWER_CREATOR: "DISCUSSION_ANSWER_CREATOR",
    DISCUSSION_ANSWER_CREATOR_ALL: "DISCUSSION_ANSWER_CREATOR_ALL"
  }
}
exports.EMAIL_TEMPLATE = {
  OTP : [
    'Hello ${name}, welcome to KLASSIQ. We glad you join us today, first of all please confirm your email.',
    'Here is your OTP to confirm your email <b>${otp}</b>'
  ].join('\n'),
  NOTIFICATION : [
    '<body>',
    '<h2>Hello ${name}, you have a Notification!</h2>',
    '<p>${message}</p>',
    '<h2 style="margin: 20px 0 15px">',
    '<a href="${link}" style="background: #2389D7; border-radius: 3px; color: #fff; border: none; outline: none; min-width: 170px; padding: 15px 25px; font-size: 14px; font-family: inherit; cursor: pointer; -webkit-appearance: none;text-decoration: none;">Go to Klassiq</a>',
    '</h2>',
    '</body>'
  ].join('\n')
}