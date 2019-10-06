import axios from "axios"
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE } from "./types"
import { setAlert } from "./alert"
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me")
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const res = await axios.post("/api/profile", formData)
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
    dispatch(setAlert(edit ? "Profile update" : "Profile created", "success"))
    // cant user redirect in action, instead we use history push
    if (!edit) {
      history.push("./dashboard")
    }
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"))
      })
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// ADD experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const res = await axios.put("/api/profile/experience", formData)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert("Experience created", "success"))
    history.push("./dashboard")
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"))
      })
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// ADD EDUCATION

export const addEducation = (formData, history) => async dispatch => {
  try {
    const res = await axios.put("/api/profile/education", formData)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert("Education created", "success"))
    history.push("./dashboard")
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"))
      })
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)
    console.log(id)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert("Experience removed", "success"))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    })
  }
}

// delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert("Education removed", "success"))
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    })
  }
}

export const deleteAccount = () => async dispatch => {
  if (window.confirm("are u sure? This can not be undone!")) {
    try {
      const res = await axios.delete(`/api/profile/`)
      dispatch({
        type: CLEAR_PROFILE
      })
      dispatch({
        type: ACCOUNT_DELETED
      })
      dispatch(setAlert("Your account has been permanently deleted removed", "success"))
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: error.response.statusText, status: error.response.status }
      })
    }
  }
}
