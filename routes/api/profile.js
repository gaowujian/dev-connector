const express = require("express")

const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../model/User")
const Profile = require("../../model/Profile")
const { check, validationResult } = require("express-validator")



module.exports = router
