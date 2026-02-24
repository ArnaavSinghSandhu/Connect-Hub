const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; 
const prisma = require('./db.js');
const app = express();
const path = require("node:path"); 
const http = require('http');
const {Server} = require("socket.io");
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs");
const { usersRouter } = require("./routes/users.js");

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) {
                return done(null, false, { message: "Username not found" });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/messages", require("./routes/messages.js"));
app.use("/posts", require("./routes/posts.js"));
app.use("/auth", require('./routes/auth.js')); 
app.use('/users', usersRouter);
app.use("/", (req,res) => {
    res.render("index");
})
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('join-room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their private Room`);
    })
    socket.on('send-private-message', async(data) => {
        const {senderId, receiverId, content} = data;

        try{
            const newMessage = await prisma.message.create({
                data:{
                    content,
                    senderId:parseInt(senderId),
                    receiverId: parseInt(receiverId),
                },
                include:{sender: true}
            });
            io.to(`user_${receiverId}`).emit(`recieve-message`,newMessage);

            socket.emit('message-sent',newMessage);
        }catch(err){
            console.error("Message Error:",err);
        }
    });
})
server.listen(3000, () => console.log("Server running on port 3000"));