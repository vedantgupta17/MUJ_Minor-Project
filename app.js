const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  name: String,
  regno: Number,
  email: String,
  password: String,
  dob: String,
  regno: Number,
  marks10: Number,
  marks12: Number,
  branch: String,
  cgpa: Number
});


const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");

});

app.get("/login", function(req, res){
  res.sendFile(__dirname + "/login.html");
});

app.get("/login/profile", function(req, res){
  res.sendFile(__dirname + "/profile.html");
});

app.get("/login/profile/offers", function(req, res){
  res.sendFile(__dirname + "/offers.html");
});

app.get("/signup", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.get("/signup/profile", function(req, res){
  res.sendFile(__dirname + "/profile.html");
});

app.post("/signup", function(req, res){
  const name = req.body.Name;
  const regno = req.body.regno;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const user = new User({
      name: name,
      regno: regno,
      email: email,
      password: hash
    });
    user.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.sendFile(__dirname + "/signup.html");
      }
    });
});

});

app.post("/signup/profile", function(req, res){

  const dob = req.body.dob;
  const regno = req.body.regnoSignup;
  const marks10 = req.body.marks10;
  const marks12 = req.body.marks12;
  const branch = req.body.branch;
  const cgpa = req.body.cgpa;

  User.findOne({regno: regno}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.dob = dob;
        foundUser.marks10 = marks10;
        foundUser.marks12 = marks12;
        foundUser.branch = branch;
        foundUser.cgpa = cgpa;
        foundUser.save(function(){
            res.sendFile(__dirname + "/profile.html");
        });
      }
    }
  });

});

app.post("/login/profile", function(req, res){
  const email = req.body.emailLogin;
  const password = req.body.passwordLogin;
  User.findOne({email: email}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result === true){
              res.sendFile(__dirname + "/profile.html");
            }else{
              res.send("invalid");
            }
           });
      }
    }
  });
});

app.post("/signup/profile", function(req, res){
  res.sendFile(__dirname + "/profile.html");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
