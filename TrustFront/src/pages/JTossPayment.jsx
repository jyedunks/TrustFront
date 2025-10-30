// src/pages/JTossPayment.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const title = sp.get("title") || "상품";
  const price = Number(sp.get("price") || 0);
  const clientKey = import.meta.env.VITE_TOSS_TEST_CLIENT_KEY;

  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    // ESC로 시트 닫기
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const request = async (method) => {
    try {
      if (!window.TossPayments) return alert("TossPayments SDK가 로드되지 않았어요.");
      if (!clientKey) return alert("VITE_TOSS_TEST_CLIENT_KEY가 .env에 없습니다.");

      const tossPayments = window.TossPayments(clientKey);
      const orderId = "ORDER-" + Date.now();
      const successUrl = `${window.location.origin}/payment-success`;
      const failUrl = `${window.location.origin}/payment-fail`;

      await tossPayments.requestPayment(method, {
        amount: price,
        orderId,
        orderName: title,
        customerName: "임시사용자",
        successUrl,
        failUrl,
      });
    } catch (err) {
      console.error(err);
      alert(err?.message || "결제창을 열 수 없습니다.");
    }
  };

  const methods = [
    { key: "카카오페이",  label: "카카오페이",  icon: "/pay/kakao.png" },
    { key: "토스페이",    label: "토스페이",    icon: "/pay/toss.png" },
    { key: "네이버페이",  label: "네이버페이",  icon: "/pay/naver.png" },
    // 필요시 { key: "카드", label: "일반카드", icon: "/pay/card.png" } 도 추가
  ];

  const baseBtn = {
    width: "100%", height: 48, borderRadius: 12, fontWeight: 700, cursor: "pointer",
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>결제하기</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
        <img src="/img1.png" alt="상품" width="48" />
        <div>
          <p><strong>상품명 — {title}</strong></p>
          <p>결제금액 — {price.toLocaleString()}원</p>
        </div>
      </div>

      {/* 메인 버튼: 시트 열기 */}
      <button
        onClick={() => setSheetOpen(true)}
        style={{ ...baseBtn, marginTop: 16, background: "#111", color: "#fff" }}
      >
        간편결제 진행
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{ ...baseBtn, marginTop: 10, background: "#fff", border: "1px solid #ddd" }}
      >
        뒤로가기
      </button>

      {/* ========= Bottom Sheet ========= */}
      {sheetOpen && (
        <>
          {/* 배경 */}
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(2px)", zIndex: 30
            }}
          />
          {/* 시트 */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 31,
              background: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
              boxShadow: "0 -12px 40px rgba(0,0,0,0.15)", padding: 16
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "0 auto 12px" }} />
            <h3 style={{ margin: "0 0 8px" }}>간편결제 선택</h3>
            <p style={{ margin: "0 0 16px", color: "#666", fontSize: 14 }}>
              {price.toLocaleString()}원 결제 • {title}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                paddingBottom: 8
              }}
            >
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => request(m.key)}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 16,
                    padding: 12,
                    background: "#fff",
                    display: "grid",
                    justifyItems: "center",
                    gap: 8,
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: 12, display: "grid", placeItems: "center",
                      background: "#f7f7f7", overflow: "hidden"
                    }}
                  >
                    {/* 아이콘 있으면 표시, 없으면 이니셜 */}
                    {m.icon ? (
                      <img src={m.icon} alt={m.label} style={{ width: 32, height: 32, objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontWeight: 800 }}>{m.label[0]}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 13 }}>{m.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSheetOpen(false)}
              style={{ ...baseBtn, marginTop: 8, background: "#fff", border: "1px solid #ddd" }}
            >
              닫기
            </button>
          </div>
        </>
      )}
      {/* ========= /Bottom Sheet ========= */}
    </div>
  );
}