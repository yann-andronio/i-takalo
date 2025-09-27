import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const API = axios.create({
  baseURL: "https://itakalo-back-fp5nc.sevalla.app/", 
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await EncryptedStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
