import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { projectReducer } from "./projectReducer";
import { subTaskReducer } from "./subTaskReducer";
import { taskReducer } from "./taskReducer";

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  subTask: subTaskReducer,
  task: taskReducer
});

export default rootReducer;
