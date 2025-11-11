// src/services/chat.js
import client, { apiPath } from "./client";

export function getUserRooms(userUuid) {
  return client.get(apiPath(`/chat/rooms/${encodeURIComponent(userUuid)}`));
}
export const listMyRooms = getUserRooms;

export function getMessages(roomId, params) {
  const url = apiPath(`/chat/messages/${encodeURIComponent(roomId)}`);
  return params ? client.get(url, { params }) : client.get(url);
}