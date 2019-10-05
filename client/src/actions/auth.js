import axios from "axios"
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from "./types"
import { setAlert } from "../actions/alert"
import setAuthToken from "../utils/setAuthToken"

export const loadUser = () => async dispatch => {
  // check if we have token stored in our localstorage
  // if it does, we set the token in our request header all the time, otherwise, we dont set headers in our request
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get("/api/auth")

    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    })
  }
}

export const register = ({ name, email, password }) => async dispatch => {
  // 可以自己stringfy之后 并声明类型为json， axios支持obj转json，我们就没必要这样做了

  // const body = JSON.stringify({ name, email, password })
  // const config = {
  //   "headers":{
  //     "Content-type":"application/json"
  //   }
  // }

  const body = { name, email, password }
  try {
    const res = await axios.post("/api/users/register", body)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })

    // 获取token
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"))
      })
    }
    dispatch({
      type: REGISTER_FAIL
    })
  }
}

export const login = (email, password) => async dispatch => {
  const body = { email, password }

  try {
    const res = await axios.post("/api/auth", body)
    console.log(res.data)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })
    // 获取token
    dispatch(loadUser())
  } catch (err) {
    console.log(err.message)
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"))
      })
    }
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

// LoOUT / Clear profile
export const logout = () => dispatch => dispatch({ type: LOGOUT })