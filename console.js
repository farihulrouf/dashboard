require('./server/app.js')
var repl = require("repl");
var replServer = repl.start({prompt: "Node Console > "});
var User = require('./server/models/User');
var Course = require('./server/models/Course');

replServer.context.User = User;
replServer.context.Course = Course;
