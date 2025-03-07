import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.listen(3000,async()=>{
    console.log("port running in 3000");
    await mongoose.connect('mongodb+srv://visionop192004:GhPUF7$y@mern.h89pu.mongodb.net/');
})