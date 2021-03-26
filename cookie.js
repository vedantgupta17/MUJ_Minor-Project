const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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

UserSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");

});

app.get("/login", function(req, res){
  res.sendFile(__dirname + "/login.html");
});

app.get("/login/myoffers/:regno", function(req, res){
  const requestedRegno = req.params.regno;
  User.findOne({regno: requestedRegno}, function(err, profile){
   res.render("myoffers", {title: profile.regno});

 });
});


app.get("/login/profileoffers/:regno", function(req, res){
  const requestedRegno = req.params.regno;
  if(req.isAuthenticated()){
    User.findOne({regno: requestedRegno}, function(err, profile){
     res.render("profileoffers", {title: profile.regno});
  }else{
    res.redirect("/login");
  }


 });
});


app.get("/login/profile/:regno", function(req, res){
  const requestedRegno = req.params.regno;

  User.findOne({regno: requestedRegno}, function(err, profile){
   res.render("profile", {
     title: profile.regno,
     username: profile.name,
     email: profile.email,
     reg: profile.regno,
     branch: profile.branch,
     cgpa: profile.cgpa,
     marks10: profile.marks10,
     marks12: profile.marks12
   });

 });
 });

app.get("/signup", function(req, res){
  if(req.isAuthenticated()){
    res.sendFile(__dirname + "/signup.html");
  }else{
    res.redirect("/");
  }

});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});
//
// app.get("/signup/profile", function(req, res){
//   res.sendFile(__dirname + "/profile.html");
// });

app.post("/signup", function(req, res){
  // const name = req.body.Name;
  // const regno = req.body.regno;
  // const email = req.body.email;
  // const password = req.body.password;

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/");
    }else{
      passport.authenticate("local")(req, res, function(){
          res.redirect("/signup");
      });
    }
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
            res.redirect("/login/profileoffers/"+regno);
        });
      }
    }
  });

});

app.post("/login/profile", function(req, res){
  const secret = new User(
  {
    username: req.body.username,
    password: req.body.password
  });

  req.login(secret, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
          res.redirect("/login/profileoffers/189303074");
      });
    }
  });
});

app.post("/login/profile/submit", function(req, res){
  const regno = req.body.profileReg;
  const profile10 = req.body.profile10;
  const name = req.body.profileName;
  const email = req.body.profileEmail;
  const branch = req.body.profileBranch;
  const cgpa = req.body.profileCGPA;
  const profile12 = req.body.profile12;

  User.findOne({regno: regno}, function(err, foundUser){
    foundUser.name = name;
    foundUser.email = email;
    foundUser.branch = branch;
    foundUser.marks10 = profile10;
    foundUser.marks12 = profile12;
    foundUser.cgpa = cgpa;
    foundUser.save();
    res.redirect("/login/profile/"+regno);
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
