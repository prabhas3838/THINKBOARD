import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});


// Automatically inject JWT token into authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("thinkboard_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// If response is 401 Unauthorized, automatically log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        localStorage.removeItem("thinkboard_token");
        localStorage.removeItem("thinkboard_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
