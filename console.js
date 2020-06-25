require('./server/app.js')
var repl = require("repl");
var replServer = repl.start({prompt: "Node Console > "});
var User = require('./server/models/User');
var Course = require('./server/models/Course');
var Post = require('./server/models/Post');
var Comment = require('./server/models/Comment');



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
            price: 0, instructors: [users[0]._id, users[1]._id]},
        {name: "Kalkulus IB", about: "ITB kalkulus series", prerequisites: ["Kalkulus IA","Aljabar","Geometri"], 
            price: 0, instructors: users[1]._id},
        {name: "Biologi X-1", about: "Materi biologi untuk kelas 10 SMA semester 1", prerequisites: ["Biologi SMP"],
            price: 250000, instructors: [users[0]._id, users[2]._id]}
    ]
    courses = await Course.insertMany(coursesData);

    const postsData = [
        {title: "Sistem Bilangan Real", body: "Berikut terlampir modul sistem bilangan bulat untuk pertemuan kemarin dan 2 minggu ke depan",
            category: "Materials", postedBy: users[2]._id, postedOn: courses[0]._id},
        {title: "Quiz I Kalkulus IA", body: "Quiz I Kalkulus IA akan diadakan senin depan, 1 jam mata pelajaran akan digunakan untuk kepentingan quiz.",
            category: "Announcement", postedBy: users[2]._id, postedOn: courses[0]._id},
        {title: "Problem Set Quiz I", body: "Terlampir soal quiz I beserta pembahasannya", category: "Materials", postedBy: users[2]._id, postedOn: courses[0]._id}
    ]
    posts = await Post.insertMany(postsData);

    const commentsData = [
        {postedBy: users[0]._id, body: "Sepertinya pertemuan hari ini tidak ada pada modul yang diberikan di sini Pak", postedOn: posts[0]._id},
        {postedBy: users[1]._id, body: "Modul yang hari ini diberikan terpisah di kelas tadi", postedOn: posts[0]._id},
        {postedBy: users[0]._id, body: "Quiznya susah banget Pak, untung bobotnya cuma 10%", postedOn: posts[1]._id},
        {PostedBy: users[2]._id, body: "Ah masak sih, kan soal2nya sama seperti soal latihan yang sudah diberikan", postedOn: posts[1]._id}
    ]
    comments = await Comment.insertMany(commentsData);
}

replServer.context.User = User;
replServer.context.Course = Course;
replServer.context.Post = Post;
replServer.context.Comment = Comment;
replServer.context.seeds = seeds;