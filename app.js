const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const {MONGOURI} = require('./config/keys')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

//username: sumansaw81
//pass: BwkdJxZYlzmpl6Mb
//url: mongodb+srv://sumansaw81:<password>@cluster0.ehjvjts.mongodb.net/?retryWrites=true&w=majority


mongoose.connect(MONGOURI)

mongoose.connection.on('connected' , ()=>{
    console.log("Connected to database")
})

mongoose.connection.on('error' , (err)=>{
     console.log("error to connect database")
})

require('./models/user')
require('./models/post')

//app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "./Client/build")))
    console.log("production")
    
    app.get("*" , (req , res)=>{
        res.sendFile(path.join(__dirname , "./Client/build/index.html"))
    })
}

app.listen(port , ()=>{
    console.log('server is up on 3000')
})