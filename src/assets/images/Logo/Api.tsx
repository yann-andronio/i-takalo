import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "L'URL de base de l'API (VITE_API_BASE_URL) n'est pas définie dans le fichier .env !"
  );
}

const Api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

Api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expiré ou invalide. Déconnexion simulée.");
    }
    return Promise.reject(error);
  }
);

export default Api;
