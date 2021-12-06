const express = require("express")
const { Auth } = require("two-step-auth");
const bodyParser = require('body-parser')
const dotenv= require("dotenv")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const alert = require('alert')

const app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

dotenv.config({path : 'config.env'})

require("./db/conn")
const User = require("./model/userSchema")

var check ;
var mail;

app.get("/", (req, res) => {
    res.render("home")
})

app.post("/", async(req, res) => {
    try{        
        const res1 = await Auth(req.body.email, "Company Name");
        console.log(res1);
        console.log(res1.mail);
        console.log(res1.OTP);
        mail=res1.mail;
        check = res1.OTP;
        if(res1.status === 200)
            res.redirect("/otp")
    }catch(err){
        console.log(err);
    }
})

app.get("/otp", (req, res) => {
    res.render("otp",{mail:mail})   
})

app.post("/otp", async(req, res) => {
    try{
        console.log(req.body.otp);
        if(Number(req.body.otp) === check){
            alert("OTP Matched")
            res.redirect("/details")
        }
        else{
            alert("OTP Not Matched")
            res.redirect("/")
        }
    }catch(err){
        console.log(err);
    }
})

app.get("/details",(req,res)=>{
    res.render("details")
})

app.post("/details",async(req,res)=>{
    const {name,email,phone,password,cpassword} = req.body
    
    if(!name||!email||!phone||!password||!cpassword){
        alert("FIll the field")
    }   
    
    try{
        const userExist = await User.findOne({email : email})
        if(userExist){
            alert("User Already Exist")
            res.redirect("/details")
        }
        else if(password !== cpassword){
            alert("Password Not Matched")
            res.redirect("/details")
        }
        else{
            bcrypt.hash(password,10,function(err,hash){
                const newUser = new User({
                    name : name,
                    email : email,
                    phone : phone,                    
                    password : hash,
                    cpassword:hash
                })
                newUser.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else { 
                        alert("User Created")
                        res.redirect("/")
                    }
                })       
            })
        }
                
    }catch(err){
        console.log(err);
    }    
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server running on port " + port)
})