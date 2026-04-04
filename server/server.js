import "dotenv/config";  //it will automatically read all env variables created,

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import AuthRouter from "./Routes/AuthRoute.js"
import AiRouter from "./Routes/AiRoute.js"
import FileRouter from "./Routes/FileRoute.js"
import KvRouter from "./Routes/KvRoute.js"

//create db conn

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("MongoDB connected")).catch((error)=> console.log(error))

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app=express()
const PORT=process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
    cors({
        //client-side url-origin
        origin:process.env.CLIENT_BASE_URL || 'http://localhost:5173',
        methods:['GET','POST','DELETE','PUT','PATCH'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true
    })
)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/ai", AiRouter);   
app.use("/api/auth",AuthRouter)
app.use("/api/files",FileRouter)
app.use("/api/kv",KvRouter)

//404 fallback
app.use((req, res) => res.status(404).json({ message: "Route not found." }));
 
// ── Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`))