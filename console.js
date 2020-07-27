require("dotenv").config();
var repl = require("repl");
var replServer = repl.start({prompt: "Node Console > "});
var User = require('./server/models/User');
var Course = require('./server/models/Course');
var Post = require('./server/models/Post');
var Comment = require('./server/models/Comment');
var TeacherApplication = require('./server/models/TeacherApplication');
const mongoose = require("mongoose");
const fs = require('fs');

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };
  
mongoose.set('useUnifiedTopology', true);
mongoose
.connect(
    process.env.MONGO_URI,
    mongooseOptions
)
.then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
console.log(`DB connection error: ${err.message}`);
});

const addUser = (user,password)=> {
    return new Promise((resolve,reject)=>{
        User.register(user,password,(err,user)=>{
            if(err) resolve(err.message)
            else resolve(user)
        })
    })
}

const seeds = async function(){
    const usersData = [
        {name: "Ramandika", email: "ramandika@gmail.com", about: "A computer science student at TU Munich", linkedIn: "https://www.linkedin.com/in/ramandika-pranamulia-825653b6/"},
        {name: "Jais Anas", email: "jais@gmail.com", about: "A senior software engineer - ExTokopedia|ExQontak", linkedIn: "https://www.linkedin.com/in/jais-ja-fari-80740a80/?originalSubdomain=id"},
        {name: "Titu A.", email: "titu@gmail.com", about: "A mathematic teacher"}
    ]

    for(i=0;i<usersData.length;i++){
        await addUser(usersData[i],"test"+i)
    }

    users = await User.find()

    const coursesData = [
        {name: "Kalkulus IA", about: "ITB kalkulus series", prerequisites: ["Aljabar","Geometri"], 
            price: 0, instructors: [users[0], users[1]]},
        {name: "Kalkulus IB", about: "ITB kalkulus series", prerequisites: ["Kalkulus IA","Aljabar","Geometri"], 
            price: 0, instructors: users[1]},
        {name: "Biologi X-1", about: "Materi biologi untuk kelas 10 SMA semester 1", prerequisites: ["Biologi SMP"],
            price: 250000, instructors: [users[0], users[2]]}
    ]
    courses = await Course.insertMany(coursesData);

    const postsData = [
        {title: "Sistem Bilangan Real", body: "Berikut terlampir modul sistem bilangan bulat untuk pertemuan kemarin dan 2 minggu ke depan",
            category: "Materials", postedBy: users[2], postedOn: courses[0]},
        {title: "Quiz I Kalkulus IA", body: "Quiz I Kalkulus IA akan diadakan senin depan, 1 jam mata pelajaran akan digunakan untuk kepentingan quiz.",
            category: "Announcement", postedBy: users[2], postedOn: courses[0]},
        {title: "Problem Set Quiz I", body: "Terlampir soal quiz I beserta pembahasannya", category: "Materials", postedBy: users[2], postedOn: courses[0]}
    ]
    posts = await Post.insertMany(postsData);
    
    posts.forEach(async element => {
        await Course.updateOne({_id: element.postedOn},{$push: {posts: element}})
    });

    const commentsData = [
        {commentator: users[0], content: "Sepertinya pertemuan hari ini tidak ada pada modul yang diberikan di sini Pak", post: posts[0]},
        {commentator: users[1], content: "Modul yang hari ini diberikan terpisah di kelas tadi", post: posts[0]},
        {commentator: users[0], content: "Quiznya susah banget Pak, untung bobotnya cuma 10%", post: posts[1]},
        {commentator: users[2], content: "Ah masak sih, kan soal2nya sama seperti soal latihan yang sudah diberikan", post: posts[1]}
    ]
    comments = await Comment.insertMany(commentsData);

    comments.forEach(async e => {
        result = await Post.updateOne({_id: e.post},{$inc: {"comments.total": 1}, $push: {"comments.listComments": e}})
        console.log(result);
    })
}

replServer.context.User = User;
replServer.context.Course = Course;
replServer.context.Post = Post;
replServer.context.Comment = Comment;
replServer.context.seeds = seeds;