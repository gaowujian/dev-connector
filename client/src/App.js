import React, { useEffect } from "react"
import "./App.css"
import NavBar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard"
import PrivateRoute from "./components/routing/PrivateRoute"
import CreateProfile from "./components/profile-forms/CreateProfile"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { loadUser } from "./actions/auth"
import setAuthToken from './utils/setAuthToken'
// redux
import { Provider } from "react-redux"
import store from "./store"
import EditProfile from "./components/profile-forms/EditProfile"
import AddExperience from "./components/profile-forms/AddExperience"
import AddEducation from "./components/profile-forms/AddEducation"
import Profiles from "./components/profiles/Profiles"
import Profile from "./components/profile/Profile"
import Posts from "./components/posts/Posts"


// check if we have token stored in our localStorage, if it does, we set the header with token all the time
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  // second argument as [] make sure it only run once
  // when we load the app, we already have a token in our request header
  useEffect(() => {
    store.dispatch(loadUser())
  },[])


  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Route path="/" exact component={Landing} />
        <div className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}></PrivateRoute>
            <PrivateRoute exact path="/edit-profile" component={EditProfile}></PrivateRoute>
            <PrivateRoute exact path="/add-experience" component={AddExperience}></PrivateRoute>
            <PrivateRoute exact path="/add-education" component={AddEducation}></PrivateRoute>
            <PrivateRoute exact path="/posts" component={Posts}></PrivateRoute>

          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App
