import axios from "axios";
import { DOMAIN_ADMIN_CLIENT } from "../constants/apiConfig";

export const getOrders = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}orders/`, {
    withCredentials: true,
  });
};
