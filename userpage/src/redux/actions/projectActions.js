import * as types from "../types/types";

export const selectProject = (project) => {
    return {
        type: types.SELECT_PROJECT,
        payload: project,
    };
};


