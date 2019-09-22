
const express = require("express")
const router = express.Router()
const { check, validationResult, body } = require("express-validator")
const User = require("../../model/User")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
// @ route GET api/users
// @ desc   register user
// @ access public
router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check("password", "please enter a password with 6 or more characters").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() })
    }

    const { name, email, password } = req.body
    try {
      // see if the use exist
      let user = await User.findOne({ email })
      if (user) {
         return res.status(400).json({ errors: [{ msg: "user already exists" }] })
      }
      // get users gravatar
      const avatar = gravatar.url(email, {
        s: "2000",
        r: "pg",
        d: "mm"
      })
      user = new User({
        name,
        email,
        avatar,
        password
      })
      // encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()
       
      // return jsonwebtoken
      const payload  = {
        user:{
          id: user.id
        }
      }
      jwt.sign(payload,config.get("jwtSecret"),{expiresIn:360000},(err,token)=>{
        if (err) throw Error
          res.json({token})
      })
    
    } catch (error) {
      console.error(error.message)
      res.status(500).send("server error")
    }
  }
)

module.exports = router
