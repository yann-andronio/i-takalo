import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
// import { API_BASE_URL } from '@env';

const API_BASE_URL = "https://mounting-draws-answering-extras.trycloudflare.com"
console.log("API URL:", API_BASE_URL);

const API = axios.create({
  baseURL: `${API_BASE_URL}/`, 
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  console.log("API URL:", API_BASE_URL);

  const token = await EncryptedStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
