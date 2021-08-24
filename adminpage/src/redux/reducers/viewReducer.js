const initialState = {
  type: "list",
};

export const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_VIEW":
      return (state = {
        ...state,
        type: action.payload,
      });

    default:
      return state;
  }
};
