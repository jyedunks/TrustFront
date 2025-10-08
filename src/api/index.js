import axios from 'axios';

const api = axios.create({
  baseURL: 'https://auctionplatform-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 앱 시작 시 토큰 자동 주입
const token = localStorage.getItem('token');
if (import.meta.env.MODE === 'development') {
  const dummyToken = 'dummyToken123';
  localStorage.setItem('token', dummyToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${dummyToken}`;
}

// if (token) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

export default api;
