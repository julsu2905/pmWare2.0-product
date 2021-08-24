import axios from "axios";
import { DOMAIN_CLIENT } from "../constants/apiConfig";

export const login = (email, password) => {
  return axios.post(`${DOMAIN_CLIENT}login`, { email, password });
};
export const logout = () => {
  return axios.get(`${DOMAIN_CLIENT}logout`);
};
