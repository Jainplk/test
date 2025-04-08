require('dotenv').config();

const http = require("http");
const {Server} = require("socket.io")

const express = require("express");
const cros = require("cors");
const methodOverride = require("method-override");

const connectDB = require('./config/db');
const ExpressError = require("./utils/ExpressError");
const cookieParser = require('cookie-parser');

const listingRouter = require("./routes/listingRoute");
const reviewRouter = require("./routes/reviewRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const messageRouter = require("./routes/messageRoute");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 8080;

const io = new Server(server, {
    cors:{
         origin:process.env.FRONTEND_URL,
         methods:["GET", "POST"]
    }
});

// socket io connection
io.on("connection", (socket) => {
    console.log("A user connected :", socket.id);

    socket.on("joinChat", (chatId) => {
        socket.join(chatId)
        console.log(`user joined chat: ${chatId}`)
    })

    socket.on("sendMessage", async(message) => {
        console.log("socket",message)
       io.to(message.chatId).emit("receiveMessage", message)
       
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

app.set("io", io); // Set the io instance in the app object

// db connection
connectDB();

app.use(cros({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));   // connect backend to frontend
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser())

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
    res.send("<h3>Root is working</h3>")
})

app.all('*', (req, res, next) => {
    next(new ExpressError('404', "Page not Found"))
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal Server Error' })
    next()
})

server.listen(port, () =>{
    console.log(`App is running on port: ${port}` )
})

module.exports = {app, io}; // Export the io instance for use in other files