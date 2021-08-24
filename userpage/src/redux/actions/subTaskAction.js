import * as types from "../types/types";

export const selectSubTask = (subTask) => {
    return {
      type: types.SELECT_SUBTASK,
      payload: subTask,
    };
  };
   