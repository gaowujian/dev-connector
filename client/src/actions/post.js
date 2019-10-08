import axios from "axios"
import { setAlert } from "./alert"
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from "./types"

//get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/api/posts")
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//add like
export const addLike = post_id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${post_id}`)
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data }
    })
  } catch (err) {
    console.log(err)
    console.log(err.message)
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// remove like
export const removeLike = post_id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${post_id}`)
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data }
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}


// deletePost
export const deletePost = post_id => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${post_id}`)
    dispatch({
      type: DELETE_POST,
      payload: post_id
    })
    dispatch(setAlert('Post Removed','success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}
