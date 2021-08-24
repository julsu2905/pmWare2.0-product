const initialState = {
  id: "",
  assignee: "",
  assigneeId: "",
  code: "",
  description: "",
  dueDate: "",
  name: "",
  startDate: "",
  status: "",
  task: "",
  taskId: "",
  projectModerators:""
};

export const subTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_SUBTASK":
      return (state = {
        ...state,
        ...action.payload,
      });
    default:
      return state;
  }
};
