const mongoose = require("mongoose")

const DB = process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(() =>{
    console.log(`Successfull connection`)
}).catch((err) => console.log(`no connection`))