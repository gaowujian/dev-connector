import React, { useEffect } from "react"
import "./App.css"
import NavBar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard"
import PrivateRoute from "./components/routing/PrivateRoute"
import CreateProfile from "./components/Profile-forms/CreateProfile"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { loadUser } from "./actions/auth"
import setAuthToken from './utils/setAuthToken'
// redux
import { Provider } from "react-redux"
import store from "./store"
import EditProfile from "./components/Profile-forms/EditProfile"


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
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/dashboard" component={Dashboard}></PrivateRoute>
            <PrivateRoute path="/create-profile" component={CreateProfile}></PrivateRoute>
            <PrivateRoute path="/edit-profile" component={EditProfile}></PrivateRoute>
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App
