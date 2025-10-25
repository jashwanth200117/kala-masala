import axios from "axios";

// Always send cookies
axios.defaults.withCredentials = true;

// Interceptor: attach XSRF token from cookie
axios.interceptors.request.use((config) => {
  const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
  if (match) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(match[2]);
  }
  return config;
});

export default axios;
