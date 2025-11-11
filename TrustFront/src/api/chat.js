// src/api/chat.js
import client from "./client";

/**
 * 1) 방 생성 or 조회
 * - POST /api/chat/room
 * - body: { sellerId, buyerId, itemId }
 * - return: "Tester1:Tester2:TestItem"
 */
export function createOrGetRoom({ sellerId, buyerId, itemId }) {
  return client("/api/chat/room", {
    method: "POST",
    data: { sellerId, buyerId, itemId },
  });
}

/**
 * 2) 유저 채팅방 목록 조회
 * - GET /api/chat/rooms/{userUuid}
 * - return: ["Tester1:Tester2:TestItem", ...]
 */
export function getUserRooms(userUuid) {
  const id = encodeURIComponent(userUuid);
  return client(`/api/chat/rooms/${id}`, { method: "GET" });
}

/** (호환용) 기존 코드에서 사용하던 이름 */
export const listMyRooms = getUserRooms;

/**
 * 3) 특정 방의 메시지 조회
 * - GET /api/chat/messages/{roomId}
 * - return: [{ roomId, senderId, content, timestamp, read }, ...]
 * - 페이지가 있으면 ?page, ?size 등 붙여도 됨: /api/chat/messages/{roomId}?page=0&size=50
 */
export function getMessages(roomId, params) {
  const id = encodeURIComponent(roomId);
  if (params && Object.keys(params).length) {
    return client(`/api/chat/messages/${id}`, { method: "GET", params });
  }
  return client(`/api/chat/messages/${id}`, { method: "GET" });
}

/**
 * 4) 메시지 전송
 * - POST /api/chat/message
 * - body: { roomId, senderId, content, timestamp, read }
 * - return: (백 스펙에 따라 200/204)
 */
export function sendMessage({
  roomId,
  senderId,
  content,
  timestamp,
  read = false,
}) {
  return client("/api/chat/message", {
    method: "POST",
    data: { roomId, senderId, content, timestamp, read },
  });
}

/**
 * 5) (선택) 방 상세정보 조회
 * - GET /api/chat/room/{roomId}
 * - return: { roomId, sellerId, buyerId, itemId, createdAt, ... }
 */
export function getRoomDetail(roomId) {
  const id = encodeURIComponent(roomId);
  return client(`/api/chat/room/${id}`, { method: "GET" });
}

/**
 * 6) (선택) 새 메시지 알림 or 읽음 처리
 * - PATCH /api/chat/message/read/{roomId}
 * - body: { readerId }
 */
export function markMessagesAsRead(roomId, readerId) {
  const id = encodeURIComponent(roomId);
  return client(`/api/chat/message/read/${id}`, {
    method: "PATCH",
    data: { readerId },
  });
}