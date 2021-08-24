const initialState = {
  projectId: "",
  projectAdmin: "",
  projectMembers: [],
  projectModerators:[],
};

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_PROJECT":
      return (state = {
        ...state,
        projectId: action.payload.projectId,
        projectAdmin: action.payload.projectAdmin,
        projectMembers: action.payload.projectMembers,
        projectModerators:action.payload.projectModerators
      });

    default:
      return state;
  }
};
