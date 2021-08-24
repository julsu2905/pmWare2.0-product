import * as types from "../types/types";

export const selectTask = (task) => {
    return {
      type: types.SELECT_TASK,
      payload: task,
    };
  };
   