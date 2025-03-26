import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error in axiosInstance:", error, error.response?.data?.message)
    return Promise.reject(error.response?.data?.message || "An error occurred");
  }
);
