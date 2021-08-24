import * as types from "../types/types";

export const userLoggin = (user) => {
  return {
    type: types.USER_LOGGEDIN,
    payload: user,
  };
};

export const userLogout = () => {
  localStorage.removeItem("user");
  return {
    type: types.USER_LOGGEDOUT,
  };
};
