const express = require("express")

const app = express()

const PORT = process.env.PORT || 5000

const mongoDB = require("./config/db")
//connect mongodb
mongoDB()

// init middleware
app.use(express.json({extended:false}))

app.get("/",(req,res) => {
  res.send("the backend is working")
})

// define routes
app.use("/api/users",require("./routes/api/users"))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/profile",require("./routes/api/profile"))
app.use("/api/posts",require("./routes/api/posts"))

app.listen(PORT,(req, res) => {
  console.log(`the server is running on ${PORT}`)
})