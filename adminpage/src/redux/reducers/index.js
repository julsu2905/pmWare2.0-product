import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { viewReducer } from "./viewReducer";

const rootReducer = combineReducers({
  user: userReducer,
  view: viewReducer,
});

export default rootReducer;
