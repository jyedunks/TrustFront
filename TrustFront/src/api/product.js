// src/api/product.js
import axios from "axios";

/* =========================
 * Axios 인스턴스 (프록시 사용)
 * - Vite devServer proxy: '/api' → 백엔드
 * - baseURL은 비워두고, 경로는 항상 '/api/...' 사용
 * ========================= */
const client = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

// 디버깅 로그 (원하면 유지)
client.interceptors.request.use((cfg) => {
  const method = cfg.method?.toUpperCase();
  const where = cfg.url;
  const payload = cfg.params && Object.keys(cfg.params).length ? cfg.params : cfg.data;
  console.log("[AXIOS][REQ]", method, where, payload || {});
  return cfg;
});
client.interceptors.response.use(
  (res) => {
    console.log("[AXIOS][RES]", res.status, res.config?.url);
    return res;
  },
  (err) => {
    console.log(
      "[AXIOS][ERR]",
      err?.response?.status,
      err?.config?.url,
      err?.message
    );
    throw err;
  }
);

/* =========================
 * 유틸: 응답 정규화
 *  - 배열 or 페이지 응답(content/list/data)을 공통 배열로 변환
 * ========================= */
function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.list)) return data.list;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/* =========================
 * 1) 전체 일반 물품 조회 (최신순/페이지 옵션)
 *   - 백이 sort를 허용하지 않으면 전달하지 마세요.
 * ========================= */
export async function getAllProducts({
  page = 0,
  size = 50,
  sort, // 예: "createdAt,desc" 또는 "createdAt,DESC" (백 스펙에 맞추기)
} = {}) {
  const params = { page, size, _: Date.now() };
  if (sort) params.sort = sort; // 선택적으로만 전송
  const { data } = await client.get("/api/product/list", {
    params,
    headers: { "Cache-Control": "no-cache" },
  });
  return normalizeList(data);
}

/* =========================
 * 2) 주소 기반(5km) 일반 물품 조회
 * ========================= */
export async function getProductsByAddress(
  address,
  { page = 0, size = 50, sort } = {}
) {
  const params = { address, page, size, _: Date.now() };
  if (sort) params.sort = sort;
  const { data } = await client.get("/api/product/list", {
    params,
    headers: { "Cache-Control": "no-cache" },
  });
  return normalizeList(data);
}

/* =========================
 * 3) 검색/필터 기반 리스트 조회
 * ========================= */
export async function getProductList({
  q = "",
  page = 0,
  size = 50,
  status,   // 예: "ON_SALE" (백 스펙에 맞추기)
  address,
  sort,     // 예: "createdAt,desc" (백이 허용 시만)
} = {}) {
  const params = { q, page, size, _: Date.now() };
  if (status) params.status = status;
  if (address) params.address = address;
  if (sort) params.sort = sort;

  const { data } = await client.get("/api/product/list", {
    params,
    headers: { "Cache-Control": "no-cache" },
  });
  return normalizeList(data);
}

/* =========================
 * 4) 상세 조회
 * ========================= */
export async function getProductDetail(id) {
  const { data } = await client.get(`/api/product/${encodeURIComponent(id)}`, {
    params: { _: Date.now() },
    headers: { "Cache-Control": "no-cache" },
  });
  return data;
}

/* =========================
 * 5) 상품 등록
 *  - 바로 노출하려면 status를 함께 전송 (예: "ON_SALE")
 * ========================= */
export async function createProduct(payload) {
  const { data } = await client.post("/api/product", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data; // { id, ... } 등 백 응답 그대로
}

/* =========================
 * 6) (선택) 상태 변경
 * ========================= */
export async function updateProductStatus(id, status) {
  const { data } = await client.patch(
    `/api/product/${encodeURIComponent(id)}/status`,
    { status },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}