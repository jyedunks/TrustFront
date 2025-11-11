// src/components/ChatRequestButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChatRoom } from "@/api/chat"; // alias 설정했으면 @ 사용

export default function ChatRequestButton({ itemId, sellerId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const startChat = async () => {
    if (!itemId && !sellerId) return alert("대상 정보가 없습니다.");
    setLoading(true);
    try {
      const room = await createChatRoom({ itemId, sellerId });
      const roomId = room.id || room.roomId;
      if (!roomId) throw new Error("방 ID가 응답에 없습니다.");
      navigate(`/chat/${roomId}`);
    } catch (e) {
      alert(e?.message || "채팅 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={startChat} disabled={loading}>
      {loading ? "연결 중..." : "채팅하기"}
    </button>
  );
}