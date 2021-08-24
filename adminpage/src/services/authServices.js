import axios from "axios";
import { DOMAIN_CLIENT } from "../constants/apiConfig";

export const login = (email, password) => {
  return axios.post(
    `${DOMAIN_CLIENT}loginAdmin`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://admin-pmware.netlify.app",
      },
      withCredentials: true,
    }
  );
};
export const logout = () => {
  return axios.get(`${DOMAIN_CLIENT}logout`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
