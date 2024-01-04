const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const http = require("http");
const socket = require("socket.io");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
 .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 })
 .then(() => {
    console.log("DB Connetion Successfull");
 })
 .catch((err) => {
    console.log(err.message);
 });

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = socket(server,{
   cors:{
      origin:"http://localhost:3000",
Credentials:true
},
   
});
global.onlineUsers=new Map();
io.on("connection", (socket) => {
   global.chatSocket=socket;
   socket.on("add-user",(userId)=>{
      onlineUsers.set(userId,socket.id);
   })
 console.log("A user connected");

 socket.on("disconnect", () => {
    console.log("A user disconnected");
 });

 socket.on("send-msg", (data) => {
   console.log("sendmsg",{data})
   const sendUserSocket=onlineUsers.get(data.to)
   if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-recieve",data.message)
   }
   
   
 });
});

server.listen(process.env.PORT, () =>
 console.log(`Server started on ${process.env.PORT}`)
);

