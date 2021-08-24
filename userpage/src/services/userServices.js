import { notification } from "antd";
import axios from "axios";
import {
    DOMAIN_CLIENT,
    UPLOAD_URL,
    UPLOAD_FILE_URL,
    DOMAIN_ADMIN_CLIENT,
} from "../constants/apiConfig";

export const register = (newUser) => {
    return axios.post(`${DOMAIN_CLIENT}users`, { ...newUser });
};
export const updateUser = (userId, newUser, token) => {
    return axios.put(
        `${DOMAIN_CLIENT}users/${userId}`,
        { ...newUser },
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
};
export const getUserProjects = (token) => {
    return axios.get(
        `${DOMAIN_CLIENT}users/projects`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const getNotifications = (token) => {
    return axios.get(
        `${DOMAIN_CLIENT}users/userNotis`,

        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const getBanners = (token) => {
    return axios.get(`${DOMAIN_ADMIN_CLIENT}banners/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getAllUsers = (token) => {
    return axios.get(`${DOMAIN_CLIENT}users/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getTask = (taskId, token) => {
    return axios.get(`${DOMAIN_CLIENT}tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createTask = (projectId, task, token) => {
    return axios.post(
        `${DOMAIN_CLIENT}tasks/`,
        {
            projectId,
            task: {
                ...task,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const getLatestDueDate = (listTasksId, token) => {
    return axios.post(
        `${DOMAIN_CLIENT}tasks/getLatestDueDate`,
        {
            listTasksId
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const deleteTask = (taskId, projectId, token) => {
    return axios.delete(`${DOMAIN_CLIENT}tasks/${taskId}`, {
        data: { projectId: projectId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const removeNotification = (notificationId, token) => {
    return axios.delete(`${DOMAIN_CLIENT}notifications/${notificationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getAllSubTasks = (projectId, token) => {
    return axios.get(`${DOMAIN_CLIENT}projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getSubTasks = (subTaskId, token) => {
    return axios.get(`${DOMAIN_CLIENT}subtasks/${subTaskId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createSubTask = (taskId, projectId, subTask, token) => {
    return axios.post(
        `${DOMAIN_CLIENT}tasks/${taskId}`,
        {
            project: projectId,
            ...subTask,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const deleteSubTask = (subTaskId, projectId, token) => {
    return axios.delete(`${DOMAIN_CLIENT}subtasks/${subTaskId}`, {
        data: { projectId: projectId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateSubTask = (subTaskId, subTask, projectId, token) => {
    return axios.put(
        `${DOMAIN_CLIENT}subtasks/${subTaskId}`,
        {
            projectId,
            subTask,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const updateTask = (taskId, task, projectId, token) => {
    return axios.put(
        `${DOMAIN_CLIENT}tasks/${taskId}`,
        {
            task,
            projectId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const changeAssign = (subTaskId, projectId, assigneeId, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}subtasks/${subTaskId}`,
        {
            projectId,
            action: "changeAssign",
            assignee: assigneeId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const changeStatus = (subTaskId, projectId, status, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}subtasks/${subTaskId}`,
        {
            projectId,
            action: "changeStatus",
            status,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const changeStatusNotification = (notificationId, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}notifications/${notificationId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const markAllNotifications = (token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}notifications/markAllAsRead`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const addMemberProject = (projectId, username, token) => {
    return axios.patch(`${DOMAIN_CLIENT}projects/${projectId}`, username, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const removeMemberProject = (projectId, username, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}projects/${projectId}/removeMember`,
        username,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const removeModerators = (projectId, moderatorId, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}projects/${projectId}/removeAuthority`, 
        moderatorId,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const removeFileAvatar = (fileName) => {
    return axios.delete(`${UPLOAD_URL}users/${fileName}`);
};
export const removeFile = (fileName) => {
    return axios.delete(`${UPLOAD_FILE_URL}/${fileName}`);
};
export const getPackage = () => {
    return axios.get(`${DOMAIN_CLIENT}prices`);
};
export const getItem = (priceName) => {
    return axios.get(`${DOMAIN_CLIENT}adminUsers/prices/${priceName}?c=USD`);
};
export const getCode = (priceName) => {
    return axios.get(`${DOMAIN_CLIENT}adminUsers/codes/${priceName}`);
};
export const createOrder = (order, token) => {
    return axios.post(
        `${DOMAIN_CLIENT}adminUsers/orders/`,
        { ...order },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const activeKeyCode = (userId, code, token) => {
    return axios.patch(
        `${DOMAIN_CLIENT}users/${userId}`,
        { code },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const getOrder = (orderId, token) => {
    return axios.get(`${DOMAIN_CLIENT}adminUsers/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getUserOrders = (token) => {
    return axios.get(`${DOMAIN_CLIENT}users/userOrders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
