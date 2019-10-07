import React, { useEffect, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import { getProfileById } from "../../actions/profile"
import { Link } from "react-router-dom"

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id)
  }, [getProfileById,match.params.id])

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles">
            <button className="btn btn-light">Back To Profiles</button>
          </Link>

         { console.log((auth.user._id === profile.user._id).toString())}
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user && (
              <Link to="edit-profile">
                <button className="btn btn-dark">Edit Profile</button>
              </Link>
            )}
        </Fragment>
      )}
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth:state.auth
})

const mapDispatchToProps = {
  getProfileById
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
