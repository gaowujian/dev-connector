const express = require("express")
const path = require("path")
const app = express()
var morgan = require('morgan')


const mongoDB = require("./config/db")
//connect mongodb
mongoDB()

// init middleware

app.use(express.json({extended:false}))
app.use(morgan('dev'))


// define routes
app.use("/api/users",require("./routes/api/users"))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/profile",require("./routes/api/profile"))
app.use("/api/posts",require("./routes/api/posts"))


// serve static assets in production 
if (process.env.NODE_ENV === "production") {
  // set static folder
  console.log("it's production")
  app.use(express.static("client/build"))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT,(req, res) => {
  console.log(`the server is running on ${PORT}`)
})