// src/pages/JTossPayment.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/** =========================
 *  ENV & CONSTS
 *  ========================= */
const RAW_API = import.meta.env.VITE_API_BASE_URL || "/api";
// 개발 중에는 무조건 프록시(/api) 타도록 고정
const API = RAW_API && RAW_API.startsWith("http") ? "/api" : RAW_API;

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

// 백에서 등록된 판매자 UUID 후보 (필요 시 수정)
const SELLER_CANDIDATES = [
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "bc498f65-b572-11f0-88a1-0a2c45589af3",
  "ffd9c396-b70e-4d59-8d04-fad7b1fa1df2",
];
const DEFAULT_SELLER = "ffd9c396-b70e-4d59-8d04-fad7b1fa1df2";

/** =========================
 *  UTILS
 *  ========================= */
const getLS = (k) => window.localStorage.getItem(k);
const pickUuid = () =>
  getLS("USER_UUID") || getLS("userUuid") || getLS("uuid") || null;

const isUuid = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

/** =========================
 *  API
 *  ========================= */
async function createOrder({ productId, buyerId, sellerId }) {
  const payload = {
    productId: Number(productId),
    buyerId: String(buyerId),
    sellerId: String(sellerId),
  };
  console.log("[orders/new] payload ->", payload);

  const res = await fetch(`${API}/orders/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "omit",
    mode: "cors",
  });

  const text = await res.text();
  console.log("[orders/new] status =", res.status, "body =", text);

  if (!res.ok) {
    throw new Error(
      text ? `orders/new ${res.status}: ${text}` : `orders/new ${res.status}`
    );
  }
  return JSON.parse(text);
}

/** =========================
 *  COMPONENT
 *  ========================= */
export default function JTossPayment() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  // 1) 쿼리 수집
  const qProductId = sp.get("productId");
  const qBuyerId = sp.get("buyerId");
  const qSellerId = sp.get("sellerId");

  // 2) 보정 로직
  const productId = useMemo(() => Number(qProductId) || 0, [qProductId]);

  // buyerId가 쿼리에 없으면 로그인 UUID로 자동 대체
  const buyerId = useMemo(() => {
    if (isUuid(qBuyerId || "")) return qBuyerId;
    const ls = pickUuid();
    return isUuid(ls || "") ? ls : "";
  }, [qBuyerId]);

  // sellerId는 허용된 값 중 하나로 정규화, 없으면 DEFAULT
  const sellerId = useMemo(() => {
    const candidate = (qSellerId || "").trim();
    if (SELLER_CANDIDATES.includes(candidate)) return candidate;
    return DEFAULT_SELLER;
  }, [qSellerId]);

  // 화면용
  const [sheetOpen, setSheetOpen] = useState(false);
  const title = "일반 상품";

  useEffect(() => {
    console.log("[payment] API      =", API);
    console.log("[payment] productId =", productId);
    console.log("[payment] buyerId   =", buyerId);
    console.log("[payment] sellerId  =", sellerId);
  }, [productId, buyerId, sellerId]);

  const startPaymentFlow = async (methodKey) => {
    try {
      if (!window.TossPayments) return alert("TossPayments SDK가 로드되지 않았습니다.");
      if (!CLIENT_KEY) return alert("VITE_TOSS_CLIENT_KEY가 .env에 없습니다.");

      // 기초 검증
      if (!productId) return alert("productId가 없습니다.");
      if (!isUuid(buyerId)) return alert("buyerId가 유효한 UUID가 아닙니다.");
      if (!isUuid(sellerId)) return alert("sellerId가 유효한 UUID가 아닙니다.");

      // 1) 주문 생성
      const order = await createOrder({ productId, buyerId, sellerId });
      console.log("[orders/new] success ->", order);

      // 2) 결제창
      const toss = window.TossPayments(CLIENT_KEY);
      const successUrl = `${window.location.origin}/payment-success`;
      const failUrl = `${window.location.origin}/payment-fail`;

      await toss.requestPayment(methodKey, {
        amount: Number(order.amount ?? 0),
        orderId: String(order.orderId ?? `ORDER-${Date.now()}`),
        orderName: String(order.productName ?? title),
        customerName: "임시사용자",
        successUrl,
        failUrl,
      });
    } catch (err) {
      console.error(err);
      alert(err?.message || "결제를 시작할 수 없습니다.");
    }
  };

  const methods = [
    { key: "카카오페이", label: "카카오페이", icon: "/pay/kakao.png" },
    { key: "토스페이", label: "토스페이", icon: "/pay/toss.png" },
    { key: "네이버페이", label: "네이버페이", icon: "/pay/naver.png" },
    { key: "카드", label: "일반카드", icon: "/pay/card.png" },
  ];

  const baseBtn = {
    width: "100%",
    height: 48,
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>결제하기</h2>
      <p style={{ color: "#666", marginTop: 0 }}>주문을 생성한 뒤 결제창으로 이동합니다.</p>

      {/* 상태 카드 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>요청 파라미터</div>
        <div style={{ display: "grid", gap: 6, color: "#555", fontSize: 14 }}>
          <div>productId: <code>{productId || "-"}</code></div>
          <div>buyerId: <code>{buyerId || "-"}</code></div>
          <div>sellerId: <code>{sellerId || "-"}</code></div>
          <div>API: <code>{API}</code></div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>결제수단 선택</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 12,
          }}
        >
          {methods.map((m) => (
            <button
              key={m.key}
              onClick={() => setSheetOpen(true) || startPaymentFlow(m.key)}
              style={{
                border: "1px solid #eee",
                borderRadius: 16,
                padding: 12,
                background: "#fff",
                display: "grid",
                justifyItems: "center",
                gap: 8,
                cursor: "pointer",
                transition: "transform .05s ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "#f7f7f7",
                  overflow: "hidden",
                }}
              >
                {m.icon ? (
                  <img
                    src={m.icon}
                    alt={m.label}
                    style={{ width: 32, height: 32, objectFit: "contain" }}
                  />
                ) : (
                  <span style={{ fontWeight: 800 }}>{m.label[0]}</span>
                )}
              </div>
              <span style={{ fontSize: 13 }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => nav(-1)}
          style={{ ...baseBtn, background: "#fff", border: "1px solid #ddd" }}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
}