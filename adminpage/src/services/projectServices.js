import axios from "axios";
import { DOMAIN_ADMIN_CLIENT } from "../constants/apiConfig";

export const getAllProjects = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}projects/`, {
    withCredentials: true,
  });
};
