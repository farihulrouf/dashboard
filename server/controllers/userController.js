const mongoose = require("mongoose");
const User = mongoose.model("User");
const TeacherApplication = mongoose.model("TeacherApplication");
const BankNotification = mongoose.model("BankNotification")
const passport = require("passport");

exports.getUsers = async (req, res) => {
  const { type } = req.query;
  const { user } = req;
  const users = await User.find({
    isAnOrganization: type == "org",
  });
  if (type === "org") {
    //user is an organization
    const organizations = {};
    users.forEach((u) => (organizations[u._id] = u));
    const application = await TeacherApplication.find({
      organization: Object.keys(organizations),
      teacher: user,
    });
    application.forEach((app) => {
      let org = organizations[app.organization.id];
      if (org) {
        org._doc.status = app.status;
        org._doc.applicationId = app.id;
      }
    });
  }
  res.json({ status: "ok", users: users });
};

exports.getAllInstructors = async (req, res) => {
  let instructors = await User.find({
    organization: {
      $exists: true,
      $ne: [],
    },
    name: {
      $regex: new RegExp(req.query.q, "i"),
    },
  });

  res.json({ status: "ok", length: instructors.length, data: instructors });
};

exports.getAllOrganizations = async (req, res) => {
  let organizations = await User.find({
    isAnOrganization: true,
    name: {
      $regex: new RegExp(req.query.q, "i"),
    },
  });

  res.json({ status: "ok", length: organizations.length, data: organizations });
};

exports.readMyNotification = async (req, res) => {
  const { user } = req;
  const { notificationId } = req.params;
  const updatedNoti = await User.updateOne(
    {
      _id: user.id,
      "notifications.list": {
        $elemMatch: {
          _id: notificationId,
          status: "unread",
        },
      },
    },
    {
      $inc: {
        "notifications.unread": -1,
      },
      $set: {
        "notifications.list.$.status": "read",
      },
    }
  );
  if (updatedNoti.ok) return res.json({ status: "ok" });
  res.json({ status: "error", message: "Could not read notification" });
};

exports.getMyTeachers = async (req, res) => {
  const { user } = req;
  if (!!user) {
    return res.json({ status: "ok", teachers: user.teachers });
  }
  res.status(401).json({ status: "error", message: "unauthorized" });
};

exports.getMyNotifications = async (req, res) => {
  const {page, limit} = req.body;
  if (!!req.user) {
    const result = await User.aggregate([
      {$match:{_id: req.user._id}},
      {$unwind:"$notifications.list"},
      {
        $lookup:{
          from:BankNotification.collection.name,
          localField:'notifications.list.bankNotification',
          foreignField:'_id',
          as:'notifications.list.bankNotification'
        }
      },
      {
        $sort: {
          "notifications.list.bankNotification.createdAt": -1
        }
      },
      {$skip: 0},
      {$limit: 10}, 
      {
        $group: {
          _id: null, //_id: '$_id'
          total: {$first: '$notifications.total'}, 
          unread:  {$first: '$notifications.unread'}, 
          list: {$push: "$notifications.list"}
        }
      }, 
      //{$project:{notifications: {bankNotification: {processed: 0, notifOn: 0, creator: 0, onModel: 0, updatedAt: 0, version: 0} }, _id: 0}}
    ])
    const {total, unread, list} = result[0] || {total: 0, unread: 0, list: []}
    list.forEach(e => e.bankNotification = e.bankNotification[0]) //array with only 1 object, just convert it to object
    return res.json({ status: "ok", notifications: {total, unread, list}});
  }
  res.json({ status: "error", notifications: [] });
};

exports.getUserById = async (req, res, next, id) => {
  const profile = await User.findOne({ _id: id });
  req.profile = profile; //don't use req.user, it will override passport user
  next();
};

exports.getCurrentUser = async (req, res) => {
  res.json({ status: "ok", user: req.user });
};

exports.updateUser = async (req, res) => {
  const { user } = req;
  const { name, about, linkedIn, avatar } = req.body;
  (user.name = name),
    (user.about = about),
    (user.linkedIn = linkedIn),
    (user.avatar = avatar);
  user.save((err, response) => {
    if (!err) {
      res.json({ status: "ok", user: response });
    } else res.json({ status: "error", message: err });
  });
};
