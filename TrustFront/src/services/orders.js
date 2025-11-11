// src/services/orders.js

/** ===== 공통 ===== */
const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

// dev: "/api" => Vite 프록시 사용
// prod: "http://host:8080" 같은 절대 URL => 그대로 사용
function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${RAW_BASE}${p}`;
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${url} ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

/** ===== 주문 생성 (POST /orders/new) =====
 * body: { productId, buyerId, sellerId, quantity }
 * 응답 예: { orderId, amount, productName }
 */
export async function createOrder({ productId, buyerId, sellerId, quantity = 1 }) {
  const url = apiUrl("/orders/new");
  return postJson(url, { productId, buyerId, sellerId, quantity });
}

/** ===== 구매 목록 조회 (GET /orders/{buyerUuid}/list?page&size) ===== */
export async function getBuyList(buyerUuid, { page = 0, size = 20 } = {}) {
  if (!buyerUuid) throw new Error("buyerUuid가 없습니다.");
  const qs = new URLSearchParams({ page, size }).toString();
  const url = apiUrl(`/orders/${buyerUuid}/list?${qs}`);
  return getJson(url);
}

/** ===== 판매 목록 조회 (GET /orders/seller/{sellerUuid}/list?page&size) ===== */
export async function getSellList(sellerUuid, { page = 0, size = 20 } = {}) {
  if (!sellerUuid) throw new Error("sellerUuid가 없습니다.");
  const qs = new URLSearchParams({ page, size }).toString();
  const url = apiUrl(`/orders/seller/${sellerUuid}/list?${qs}`);
  return getJson(url);
}