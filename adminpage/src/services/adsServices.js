import axios from "axios";
import { DOMAIN_ADMIN_CLIENT, UPLOAD_URL } from "../constants/apiConfig";

export const getAllAds = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}ads/`, {
    withCredentials: true,
  });
};
export const createAds = (ads) => {
  return axios.post(
    `${DOMAIN_ADMIN_CLIENT}ads/`,
    { ...ads },
    {
      withCredentials: true,
    }
  );
};
export const removeAds = (adsId) => {
  return axios.delete(`${DOMAIN_ADMIN_CLIENT}ads/${adsId}`, {
    withCredentials: true,
  });
};
export const activeAds = (adsId) => {
  return axios.patch(`${DOMAIN_ADMIN_CLIENT}ads/${adsId}`, {
    withCredentials: true,
  });
};
export const removeFileAds = (adsName) => {
  return axios.delete(`${UPLOAD_URL}banners/${adsName}`, {
    withCredentials: true,
  });
};
