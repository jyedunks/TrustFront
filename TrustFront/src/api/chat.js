import client from "./client";

/** 1) 방 생성 or 조회 (문서대로 body에 3개) */
export function createOrGetRoom({ sellerId, buyerId, itemId }) {
  return client("/api/chat/room", {
    method: "POST",
    data: { sellerId, buyerId, itemId },
  });
  // 반환값: "Tester1:Tester2:TestItem"
}

/** 2) 유저 채팅방 목록 조회 */
export function getUserRooms(userUuid) {
  // 경로 파라미터 그대로 사용
  return client(`/api/chat/rooms/${encodeURIComponent(userUuid)}`, {
    method: "GET",
  });
  // 반환: ["Tester1:Tester2:TestItem", ...]
}

/** 3) 특정 방의 메시지 조회 */
export function getMessages(roomId) {
  // roomId는 경로변수이므로 반드시 인코딩
  return client(`/api/chat/messages/${encodeURIComponent(roomId)}`, {
    method: "GET",
  });
  // 반환: [{ roomId, senderId, content, timestamp, read }, ...]
}

/** 4) 메시지 전송 */
export function sendMessage({ roomId, senderId, content, timestamp, read=false }) {
  return client("/api/chat/message", {
    method: "POST",
    data: { roomId, senderId, content, timestamp, read },
  });
  // 반환값 없음(204 or 200 빈 바디 예상)
}