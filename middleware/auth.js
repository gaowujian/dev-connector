const jwt = require("jsonwebtoken")
const config = require("config")


module.exports = function(req, res, next) {
  // Get the token from header
  const token = req.header("x-auth-token")
  
  // check if no token
  if (!token) return res.status(401).json({ message: "no token, authorization denied" })

  // verify a token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"))
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ message: "token is not valid" })
  }
}
