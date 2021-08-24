const initialState = {
    code:"",
    name: "",
    priority: "",
    watchers: "",
    startDate: "",
    dueDate:"",
    description: "",
    prerequisiteTasks: "",
    subTasks:"",
    project:"",
    members:"",
    projectModerators:""

  };
  
  export const taskReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SELECT_TASK":
        return (state = {
          ...state,
          ...action.payload,
        });
      default:
        return state;
    }
  };
  