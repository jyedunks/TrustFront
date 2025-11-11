import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://54.xx.xx.xx:8080
  withCredentials: true, // 쿠키 쓰는 경우 필수
});

// 로컬 스토리지 토큰을 Authorization 헤더에 붙임
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;