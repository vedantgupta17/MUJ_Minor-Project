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
app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
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
  username: String,
  password: String,
  dob: String,
  regno: Number,
  marks10: Number,
  marks12: Number,
  branch: String,
  cgpa: Number
});

userSchema.plugin(passportLocalMongoose);

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
  if(req.isAuthenticated()){
    User.findOne({regno: requestedRegno}, function(err, profile){
     res.render("myoffers", {title: profile.regno});
      });
  }else{
    res.redirect("/login");
  }



});


app.get("/login/profileoffers/:regno", function(req, res){
  const requestedRegno = req.params.regno;
  if(req.isAuthenticated()){
    User.findOne({regno: requestedRegno}, function(err, profile){
     res.render("profileoffers", {title: profile.regno});
     });
  }else{
    res.redirect("/login");
  }



});


app.get("/login/profile/:regno", function(req, res){
  const requestedRegno = req.params.regno;
  if(req.isAuthenticated()){
    User.findOne({regno: requestedRegno}, function(err, profile){
     res.render("profile", {
       title: profile.regno,
       username: profile.name,
       email: profile.username,
       reg: profile.regno,
       branch: profile.branch,
       cgpa: profile.cgpa,
       marks10: profile.marks10,
       marks12: profile.marks12
     });

   });
  }else{
    res.redirect("/login");
  }


 });

app.get("/signup", function(req, res){
  if(req.isAuthenticated()){
    res.sendFile(__dirname + "/signup.html");
  }else{
    res.redirect("/");
  }

});

app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect("/login");

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

  User.register({username: req.body.username, regno: req.body.regno, name: req.body.Name}, req.body.password, function(err, user){
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
            res.redirect("/login/profileoffers/"+foundUser.regno);
        });
      }
    }
  });

});

app.post("/login/profile", function(req, res){

User.findOne({username: req.body.username}, function(err, foundUser){

    if(foundUser){
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

      passport.authenticate("local", function(err, user){
        if(err){
          console.log(err);
        } else {

          if(user){
            req.login(user, function(err){
            res.redirect("/login/profileoffers/"+foundUser.regno);
            });
          } else {
            res.render("loginfail", {title: "Incorrect Password"});
          }
        }
      })(req, res);
    } else {
      res.render("loginfail", {title: "This Username does not Exist"});
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
    foundUser.username = email;
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
