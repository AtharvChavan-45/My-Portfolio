// require('dotenv').config({path: './env' });
// import mongoose from  "mongoose";
//import { DB_NAME } from "./constants";
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

// go to package.json script file
dotenv.config({
    path: './.env'
});


/*
“Why not just use try/catch?”
Because app.on("error", ...) is handling an event, while try/catch handles synchronous 
exceptions (and errors you explicitly await/catch in async code).
*/
connectDB()
.then(()=>{
    app.on("error", (error)=>{ // listen for an event
        console.log("Error  :", error);// here "error" -> this is event Whenever an error event happens, execute this callback.
        throw error; //I received this error, but I don’t want to silently ignore it. Throw it again
    })
    const PORT = process.env.PORT || 8000;
    app.listen(PORT , "0.0.0.0", ()=>{ //Start the server and listen for incoming requests on this port.
        console.log(`Server is running at port ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection FAILED !! ", err);
})









/*
import express from "express"
const app = express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error" , (error) => {
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error){
        console.log("ERROR: ")
        throw error;
    }
})()

*/