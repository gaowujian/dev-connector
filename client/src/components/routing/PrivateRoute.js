import React from "react"
import { Route, Redirect } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"

function PrivateRoute({ component: Component, auth: { isAuthenticated, loading }, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? <Redirect to="/login"></Redirect> : <Component {...props} />
      }
    />
  )
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRoute)
