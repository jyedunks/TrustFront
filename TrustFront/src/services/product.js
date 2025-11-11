// src/services/product.js
import axios from "axios";

const http = axios.create({ baseURL: "", withCredentials: false });
const abs = (rel) => new URL(rel, window.location.origin).toString();

const apiBase = `/api`;

function authHeaders() {
  const at =
    localStorage.getItem("ACCESS_TOKEN") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("TOKEN");
  return at ? { Authorization: `Bearer ${at}` } : {};
}

export async function getMySellList({ uuid, page = 0, size = 20 }) {
  if (!uuid) throw new Error("UUID가 없습니다.");

  const headers = authHeaders();

  const pathCandidates = [
    `${apiBase}/product/seller/${encodeURIComponent(uuid)}?page=${page}&size=${size}`,
    `${apiBase}/product/seller/${encodeURIComponent(uuid)}`,
  ];
  const q = (k) =>
    `${apiBase}/product/list?${k}=${encodeURIComponent(uuid)}&page=${page}&size=${size}`;
  const queryCandidates = [
    q("sellerUuid"),
    q("sellerUUID"),
    q("sellerId"),
    q("userUuid"),
    q("userUUID"),
    q("userId"),
    `${apiBase}/product/my-sell?page=${page}&size=${size}`,
    `${apiBase}/product/my?page=${page}&size=${size}`,
    // 🔁 최후 폴백: 필터 없이 리스트(백이 필터 미지원 시)
    `${apiBase}/product/list?page=${page}&size=${size}`,
  ];

  const candidates = [...pathCandidates, ...queryCandidates];

  let lastErr;
  for (const url of candidates) {
    try {
      const { data, status } = await http.get(abs(url), { headers });

      // 1) 표준화
      const norm = normalizeSellList(data);

      // 2) 백이 필터를 무시했을 수 있으니 클라이언트에서 한 번 더 필터
      //   - item.sellerUuid / item.sellerId / item.ownerUuid 등 들어오는 키 모두 대비
      const filtered = norm.items.filter(
        (it) =>
          [it.sellerUuid, it.sellerId, it.ownerUuid, it.ownerId]
            .filter(Boolean)
            .some((v) => String(v) === String(uuid))
      );

      return {
        items: filtered,
        total: filtered.length,
        page: norm.page,
        size: norm.size,
        source: url,
        status,
      };
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("판매 목록 조회 실패");
}

function normalizeSellList(raw) {
  if (raw && Array.isArray(raw.content)) {
    return {
      items: raw.content.map(mapItem),
      total: raw.totalElements ?? raw.content.length,
      page: raw.number ?? 0,
      size: raw.size ?? raw.content.length ?? 0,
    };
  }
  if (raw && Array.isArray(raw.items)) {
    return {
      items: raw.items.map(mapItem),
      total: raw.total ?? raw.items.length,
      page: raw.page ?? 0,
      size: raw.size ?? raw.items.length ?? 0,
    };
  }
  if (Array.isArray(raw)) {
    return { items: raw.map(mapItem), total: raw.length, page: 0, size: raw.length };
  }
  return { items: [], total: 0, page: 0, size: 0 };
}

function mapItem(x = {}) {
  return {
    id: x.id ?? x.productId ?? x.itemId ?? x.uuid ?? null,
    title: x.title ?? x.name ?? "(제목 없음)",
    price: Number(x.price ?? x.amount ?? 0),
    status: x.status ?? x.saleStatus ?? x.state ?? "UNKNOWN",
    createdAt: x.createdAt ?? x.regDt ?? x.createdDate ?? null,
    thumbnail:
      x.thumbnailUrl ??
      x.thumbUrl ??
      x.imageUrl ??
      (Array.isArray(x.images) && x.images[0]) ??
      null,

    // 👇 판매자 식별자(여러 키 대비)
    sellerUuid:
      x.sellerUuid ?? x.sellerUUID ?? x.sellerId ?? x.ownerUuid ?? x.ownerId ?? null,
    sellerId:
      x.sellerId ?? x.sellerUUID ?? x.sellerUuid ?? x.ownerId ?? x.ownerUuid ?? null,
    ownerUuid: x.ownerUuid ?? null,
    ownerId: x.ownerId ?? null,
  };
}