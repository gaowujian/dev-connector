const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refs: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refs: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refs: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Post = mongoose.model("post", postSchema)
