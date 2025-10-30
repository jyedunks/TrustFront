// src/services/chat.js
import api from "../lib/api";

export async function createRoom({ sellerId, buyerId, itemId }) {
  const { data } = await api.post("/api/chat/room", { sellerId, buyerId, itemId });
  return typeof data === "string" ? data : data.roomId || data.id;
}

export async function sendMessage({ roomId, senderId, content, timestamp = Date.now() }) {
  const { data } = await api.post("/api/chat/message", {
    roomId,
    senderId,
    content,
    timestamp,
    read: false,
  });
  return data;
}

// (목록 조회는 스펙 받으면 추가)
// export async function listMessages(roomId) { ... }