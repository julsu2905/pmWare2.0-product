import * as types from "../types/types";

export const selectView = (type) => {
  return {
    type: types.SELECT_VIEW,
    payload: type,
  };
};
