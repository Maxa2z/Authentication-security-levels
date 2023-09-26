const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// npm i passport-local


let app = express();
let port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret : "qwertyuiopasdfghjklzxcvbnm",
    resave : false,
    saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userdb");

let userschema = new mongoose.Schema({
    email:String,
    password:String
});

userschema.plugin(passportLocalMongoose);


let user = mongoose.model("user",userschema);

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.post("/register",async(req,res)=>{
    
    user.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            res.redirect("/");
        }
    });
});


app.post("/login",async(req,res)=>{
    let newuser= new user({
        username:req.body.username,
        password:req.body.password
    });
    req.login(newuser,(err)=>{
        if(err){
            // console.log(err);
            req.redirect("/login");
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            });
        }
    });
});

app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/register",(req,res)=>{
    res.render("register.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets.ejs",{username:req.user.username});
    }
    else{
        res.redirect("/login");
    }
});
app.get("/logout",(req,res)=>{
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
});


app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})