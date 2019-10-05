const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  eror: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case typeName:
      return { ...state, ...payload }

    default:
      return state
  }
}
