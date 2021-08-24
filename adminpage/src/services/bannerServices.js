import axios from "axios";
import { DOMAIN_ADMIN_CLIENT, UPLOAD_URL } from "../constants/apiConfig";

export const getBanners = () => {
  return axios.get(`${DOMAIN_ADMIN_CLIENT}banners/`, {
    withCredentials: true,
  });
};
export const createBanner = (banner) => {
  return axios.post(
    `${DOMAIN_ADMIN_CLIENT}banners/`,
    { ...banner },
    {
      withCredentials: true,
    }
  );
};
export const removeBanner = (bannerId) => {
  return axios.delete(`${DOMAIN_ADMIN_CLIENT}banners/${bannerId}`, {
    withCredentials: true,
  });
};
export const activeBanner = (bannerId) => {
  return axios.patch(
    `${DOMAIN_ADMIN_CLIENT}banners/${bannerId}`,
    {},
    {
      withCredentials: true,
    }
  );
};
export const removeFileBanner = (bannerName) => {
  return axios.delete(`${UPLOAD_URL}banners/${bannerName}`, {
    withCredentials: true,
  });
};
