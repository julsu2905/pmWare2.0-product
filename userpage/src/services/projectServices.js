import axios from "axios";
import { DOMAIN_CLIENT } from "../constants/apiConfig";

export const getProject = (projectId, token) => {
  return axios.get(`${DOMAIN_CLIENT}projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getProjectLog = (projectId, token) => {
  return axios.get(`${DOMAIN_CLIENT}projects/${projectId}/log`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const createProject = (project, token) => {
  return axios.post(
    `${DOMAIN_CLIENT}projects/`,
    { ...project },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const deleteProject = (projectId, token) => {
  return axios.delete(`${DOMAIN_CLIENT}projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProject = (projectId, project, token) => {
  return axios.put(
    `${DOMAIN_CLIENT}projects/${projectId}`,
    { ...project },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } 
  );
};
export const archiveProject = (projectId, token) => {
  return axios.patch(
    `${DOMAIN_CLIENT}projects/${projectId}/archive`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const closeProject = (projectId, token) => {
  return axios.patch(
    `${DOMAIN_CLIENT}projects/${projectId}/close`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const grantAuthority = (projectId, moderators, token) => {
  return axios.patch(
    `${DOMAIN_CLIENT}projects/${projectId}/grantAuthority`,
    { moderators },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
