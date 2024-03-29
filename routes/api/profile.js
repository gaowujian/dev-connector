const express = require("express")

const router = express.Router()
const auth = require("../../middleware/auth")
const User = require("../../model/User")
const Profile = require("../../model/Profile")
const Post = require("../../model/Post")
const { check, validationResult } = require("express-validator")
const request = require("request")
const axios = require("axios")
const config = require("config")

// @route GET api/profile/me
// @ desc   get current users profile
// @ access private
router.get("/me", auth, async (req, res) => {
  try {
    // get data from user including name and avatar
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    )
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
// @route post api/profile/
// @ desc  create and update profile
// @ access private
router.post(
  "/",
  [
    auth,
    check("status", "status is required")
      .not()
      .isEmpty(),
    check("skills", "skill is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body

    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills)
      profileFields.skills = skills.split(",").map(skill => skill.trim())

    // build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }

  

      // create a new profile
      profile = new Profile(profileFields)
      await profile.save()
      return res.json(profile)
    } catch (error) {
      console.error(error)
      res.status(500).send("Server Error")
    }

    res.send("hello")
  }
)

// @route get api/profile
// @ desc  get all profile
// @ access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route get api/profile/user/:user_id
// @ desc  get profile by id
// @ access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"])
    if (!profile) return res.json({ msg: "there is no profile for this user" })
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "there is no profile for this user" })
    }
    res.status(500).send("Server Error")
  }
})

// @route delete api/profile/user/:user_id
// @ desc  delete profile, user & post
// @ access private

router.delete("/", auth, async (req, res) => {
  try {
    // remove user posts
    await Post.deleteMany({ user: req.user.id })

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: "profile and user deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route put api/profile/experience/
// @ desc  add profile experience
// @ access private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is require")
      .not()
      .isEmpty(),
    check("company", "Company is require")
      .not()
      .isEmpty(),
    check("from", "From date is require")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

// @route delete api/profile/experience/
// @ desc  delete profile experience
// @ access private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // get the remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route put api/profile/education/
// @ desc  add profile education
// @ access private

router.put(
  "/education",
  [
    auth,
    check("school", "School is require")
      .not()
      .isEmpty(),
    check("degree", "Degree is require")
      .not()
      .isEmpty(),
    check("fieldofstudy", "Fields of study is required")
      .not()
      .isEmpty(),
    check("from", "From date is require")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

// @route delete api/profile/education/
// @ desc  delete profile education
// @ access private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // get the remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route get  api/profile/github/:username
// @ desc  get user repos from github
// @ access public

router.get("/github/:username", async (req, res) => {
  try {
    // using request to get data

    // const options = {
    //   uri: `https://api.github.com/users/${
    //     req.params.username
    //   }/repos?per_page=5&sort=created: asc&client_id${config.get(
    //     "githubClientId"
    //   )}&client_secret=${config.get("githubSecret")}}`,
    //   method: "GET",
    //   headers: { "user-agent": "nodejs" }
    // }
    // request(options,(error,response,body)=>{
    //   if(error)
    //     console.error(error)
    //   if(response.statusCode!=200)
    //     res.status(404).json({msg:"no github profile found"})
    //   res.json(JSON.parse(body))
    // })

    const response = await axios.get(
      `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created: asc&client_id${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}}`
    )

    if (response.status != 200) {
      return res.status(404).json({ msg: "no github profile found" })
    }
    res.json(response.data)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
