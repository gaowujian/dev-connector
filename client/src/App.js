import React, { useEffect } from "react";
import "./App.css";
import NavBar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
// redux
import { Provider } from "react-redux";
import store from "./store";
// import routes
import Routes from "./components/routing/Routes";

// check if we have token stored in our localStorage, if it does, we set the header with token all the time
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  // second argument as [] make sure it only run once
  // when we load the app, we already have a token in our request header
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Landing} />
          <Routes component={Routes} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
