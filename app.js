//jshint esversion:6
// put it right of top, it will create an env var for full project
// As early as possible in your application, import and configure dotenv:
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');


const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
// encrypt password regardless of any other options. name and _id will be left unencrypted
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
// it will encript the password when call save(), will decrept when call find()

const User = new mongoose.model("User", userSchema);




app.get("/", function(req,res){
  res.render('home');
});

app.get("/login", function(req,res){
  res.render('login');
});

app.get("/register", function(req,res){
  res.render('register');
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post("/login", function (req,res) { 
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName}, function(err,foundUser){
    if (err){
      console.log(err);
    }else{
      if(foundUser){
        if (foundUser.password === password){
          res.render('secrets');
        }
      }
    }
  });
 });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
