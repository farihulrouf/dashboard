const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Room = mongoose.model("Room");
const User = mongoose.model("User");
const Course = mongoose.model("Course")


exports.getRoomById = async (req, res, next, roomId) => {
    const room = await Room.findById(roomId)
    req.room = room;
    next();
}

exports.getRooms = async (req,res) => {
    const {course, user} = req;
    //Check if user can access the rooms
    if(!user.canAccessCourse(course)) return res.status(401).json({status: "error", message: "Unauthorized"});
    rooms = await Room.find({course: course._id})
    res.json({status: "ok", rooms: rooms})
}

exports.joinRoom = async (req,res) => {
    const {room, user} = req;
    if(!user.canAccessCourse(room.course)) return res.status(401).json({status: "error", message: "Unauthorized"})
    res.redirect(await user.join(room));
}