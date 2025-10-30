import api from "../lib/api";

export async function createOrder({ amount, productName }) {
  // ✅ 현재 서버는 /orders/new (프리픽스 없음)으로 200 OK 확인됨
  const { data } = await api.post("/orders/new", { amount, productName });
  // data 예: { orderId: "...", amount: 10000, productName: "..." }
  return data;
}

/* TODO: 백에서 스펙 받으면 추가
export async function getOrdersByUser(userId) {
  // 예: /orders/{userId}/list  or  /orders/list?userId=
}
*/