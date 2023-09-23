// creating constants for dependencies
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const ejs = require("ejs");
dotenv.config();
app.use(cors());
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

//importing models 
const MusicProducts = require('./models/MusicProduct');

//get requests
app.get("/", (req,res)=>{
    res.json({"message" :"all good"})
})

//post requests
app.post("/api/create-products",async (req,res)=>{
  
    try{
    const {name, pricing, description , about, color, type, brand,featured,available, ratingStars,ratingCount, main_image, left_view,right_view, top_view,} = req.body ;
   
    const rating = {rate:ratingStars , count :ratingCount}
    const price = parseInt(pricing);
    console.log(name, price, description , about, color, type, brand,featured,available, main_image, left_view,right_view, top_view,rating)
    console.log(price, typeof(price ))
    await MusicProducts.create({name,  description , about,price, color, type, brand,featured,available, main_image, left_view,right_view, top_view,rating})   
    res.json({status:"success" , message:"product created successfully"})
    
    }catch(error){
        // console.log("error")
        res.json({status:"fail" , message:"product us not added"})
    }
})

//server 
app.listen(process.env.PORT, () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
  
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("server running on port :" + process.env.PORT);
      })
      .catch((error) => {
        console.log(error);
      
      });
  });
  