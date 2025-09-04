import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const API = axios.create({
  baseURL: "http://192.168.88.22:8000/", 
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
