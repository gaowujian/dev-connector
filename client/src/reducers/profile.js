import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from "../actions/types"

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_PROFILE:
      return { ...state, profile: payload, loading: false }
    case PROFILE_ERROR:
      return { ...state, error: payload, loading: false }
    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], loading: false }
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false }
    default:
      return state
  }
}
