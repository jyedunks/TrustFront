// src/lib/api.js
import axios from "axios";

// 공통 axios 인스턴스
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 인증 쓸 때만 true
  timeout: 10000,
});

// 페이지 로드시 1회 호출 테스트용
export async function testConnection() {
  try {
    const res = await api.post("/api/chat/message", {
      roomId: "Tester1:Tester2:TestItem",
      senderId: "Tester2",
      content: "테스트 메세지",
      timestamp: 1,
      read: false,
    });
    console.log("✅ 백엔드 연결 성공:", res.data);
  } catch (err) {
    console.error("❌ 백엔드 연결 실패:", err);
  }
}

export default api;