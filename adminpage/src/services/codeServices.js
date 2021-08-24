import axios from "axios";
import { DOMAIN_ADMIN_CLIENT } from "../constants/apiConfig";

export const getCodes = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}codes/`, {
    withCredentials: true,
  });
};
export const createCode = (code) => {
  return axios.post(
    `${DOMAIN_ADMIN_CLIENT}codes/`,
    { ...code },
    {
      withCredentials: true,
    }
  );
};
