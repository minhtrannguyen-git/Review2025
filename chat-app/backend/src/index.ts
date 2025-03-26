import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from "./lib/db.js";
import AuthRouter from "./routes/auth.route.js"; // ✅ Fix for ES module in Node.js
import MessageRouter from './routes/message.route.js'
import morgan from "morgan";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials:true
}))
app.use(morgan("combined"));
app.use(express.json(
  {
    limit: "1mb"
  }
));
app.use(express.urlencoded({limit: "1mb"}));
app.use(cookieParser());

app.use("/api/auth", AuthRouter);

app.use('/api/message', MessageRouter)

server.listen(process.env.PORT, () => {
  console.log("App listening on port " + process.env.PORT)
  connectDB();
});
