const initialState = {
  dataLogin: {},
  signedIn: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGGEDIN":
      return (state = {
        ...state,
        dataLogin: action.payload,
        signedIn: true,
      });
    case "USER_LOGGEDOUT":
      return (state = { ...state, dataLogin: {}, signedIn: false });
    default:
      return state;
  }
};
