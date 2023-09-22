import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";

let app = express();
let port = 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/userdb");

let userschema = new mongoose.Schema({
    email:String,
    password:String
});

let user = mongoose.model("user",userschema);

app.post("/register",async(req,res)=>{
    let newuser = new user({
        email:req.body.username,
        password:req.body.password
    });
    newuser.save();
    res.render("home.ejs");
});


app.post("/login",async(req,res)=>{
    let email = req.body.username;
    let password = req.body.password;
    let user1 = await user.findOne({email:email});
    if(user1.password === password){
        res.render("secrets.ejs");
    }
    else{
        res.render("login",{
            error : "Invalid username or password"
        });
    }
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
    res.render("secrets.ejs");
});


app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})