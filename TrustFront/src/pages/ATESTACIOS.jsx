// src/pages/TestAxios.jsx
import { useEffect } from "react";
import client from "../api/client"; 

const { data } = await client.get('/chat/messages/${roomID}');
export default function TestAxios() {
  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/items"); // 예: GET http://localhost:8080/api/items
        console.log("서버 응답:", res.data);     // 연결 성공
      } catch (e) {
        console.error("요청 실패:", e);
      }
    })();
  }, []);

  return <h2>백엔드 연결 테스트 중 (콘솔 확인)</h2>;
}