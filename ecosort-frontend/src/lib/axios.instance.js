import axios from "axios";

const $axios = axios.create({
  baseURL: "http://localhost:5000/", //backend url
   withCredentials: true 
});

// Add a request interceptor
$axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});



export default $axios;