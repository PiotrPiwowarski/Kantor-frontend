import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("accountId");
      localStorage.removeItem("jwt");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
