import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const API = axios.create({
  baseURL: "https://ultimately-computing-earned-attendance.trycloudflare.com/", 
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
