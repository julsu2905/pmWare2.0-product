import axios from "axios";
import { DOMAIN_CLIENT } from "../constants/apiConfig";

export const getPrices = () => {
  return axios.get(`${DOMAIN_CLIENT}prices/`, {
    withCredentials: true,
  });
};
export const getPrice = (name, currency) => {
  return axios.get(`${DOMAIN_CLIENT}prices/${name}?c=${currency}`, {
    withCredentials: true,
  });
};
export const getPriceNames = () => {
  return axios.get(`${DOMAIN_CLIENT}prices/get/name`, {
    withCredentials: true,
  });
};
export const updatePrice = (priceId, price) => {
  return axios.put(
    `${DOMAIN_CLIENT}prices/${priceId}`,
    { ...price },
    {
      withCredentials: true,
    }
  );
};
export const createPrice = (price) => {
  return axios.post(
    `${DOMAIN_CLIENT}prices`,
    { ...price },
    {
      withCredentials: true,
    }
  );
};
export const blockPrice = (priceId) => {
  return axios.delete(`${DOMAIN_CLIENT}prices/${priceId}`, {
    withCredentials: true,
  });
};
export const unblockPrice = (priceId) => {
  return axios.patch(
    `${DOMAIN_CLIENT}prices/${priceId}`,
    {},
    {
      withCredentials: true,
    }
  );
};
