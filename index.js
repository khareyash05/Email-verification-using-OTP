const express = require("express")
const { Auth } = require("two-step-auth");
const bodyParser = require('body-parser')
const alert = require('alert')

const app = express()

app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server running on port 3000")
})