import axios from "axios";
import { DOMAIN_ADMIN_CLIENT, UPLOAD_URL } from "../constants/apiConfig";

export const createAccount = (newUser) => {
  return axios.post(
    `${DOMAIN_ADMIN_CLIENT}`,
    { ...newUser },
    { withCredentials: true }
  );
};
export const getAllUsers = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}users/`, {
    withCredentials: true,
  });
};
export const removeFileAvatar = (fileName) => {
  return axios.delete(`${UPLOAD_URL}users/${fileName}`);
};
export const blockUser = (id) => {
  return axios.patch(
    `${DOMAIN_ADMIN_CLIENT}users/${id}`,
    { action: "block" },
    {
      withCredentials: true,
    }
  );
};
export const unblockUser = (id) => {
  return axios.patch(
    `${DOMAIN_ADMIN_CLIENT}users/${id}`,
    { action: "unblock" },
    {
      withCredentials: true,
    }
  );
};
export const deleteUser = (id) => {
  return axios.delete(`${DOMAIN_ADMIN_CLIENT}users/${id}`, {
    withCredentials: true,
  });
};
