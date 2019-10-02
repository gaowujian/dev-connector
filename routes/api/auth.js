const express = require("express")
const auth = require("../../middleware/auth")
const router = express.Router()
const User = require("../../model/User")
const { check, validationResult, body } = require("express-validator")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs")

// @route GET api/auth
// @ desc   test route
// @ access public


router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: 0 })
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).send("Server Error")
  }
})
// @ route GET api/auth
// @ desc   authenticate user and get token
// @ access public
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "please enter a password with 6 or more characters").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() })
    }

    const { email, password } = req.body
    try {
      // see if the use exist
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
      }

      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 3600000 }, (err, token) => {
        if (err) throw Error
        res.json({ token })
      })
    } catch (error) {
      console.error(error.message)
      res.status(500).send("server error")
    }
  }
)

module.exports = router
