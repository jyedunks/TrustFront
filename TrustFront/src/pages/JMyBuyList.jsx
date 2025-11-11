// src/pages/JMyBuyList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuyList } from "@/services/orders";

const getLS = (k) => localStorage.getItem(k);
const pickUuid = () =>
  getLS("USER_UUID") || getLS("userUuid") || getLS("uuid") || "";

export default function JMyBuyList() {
  const nav = useNavigate();
  const [uuid] = useState(pickUuid());
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setL] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!uuid) {
          setErr("로그인이 필요합니다.");
          setL(false);
          return;
        }
        setL(true);
        setErr("");
        const data = await getBuyList(uuid, { page, size });
        // 백 응답이 Page 형식이라고 가정
        const content = data.content || data.list || [];
        setItems(content);
        setTotal(data.totalElements ?? content.length);
        setPages(data.totalPages ?? 1);
      } catch (e) {
        console.error(e);
        setErr(e.message || "구매 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setL(false);
      }
    })();
  }, [uuid, page, size]);

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: "0 12px" }}>
      <h2 style={{ marginBottom: 8 }}>나의 구매 목록</h2>
      <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>
        UUID: <code>{uuid || "-"}</code>
      </div>

      {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
      {!loading && err && (
        <div style={{ padding: 16, color: "#e74c3c" }}>{err}</div>
      )}

      {!loading && !err && items.length === 0 && (
        <div style={{ padding: 16, color: "#666" }}>구매 내역이 없습니다.</div>
      )}

      {!loading && !err && items.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((o) => (
            <div
              key={o.orderId || `${o.id}-${o.productId}`}
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                padding: 14,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
                alignItems: "center",
                background: "#fff",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>
                  {o.productName ?? `상품 #${o.productId ?? "-"}`}
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  주문번호: {o.orderId ?? "-"} · 수량: {o.quantity ?? 1}
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                  금액: {Number(o.amount ?? 0).toLocaleString()}원 · 상태:{" "}
                  {o.status ?? "PAID"}
                </div>
                {o.createdAt && (
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                    결제일시: {o.createdAt}
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <button
                  onClick={() => nav(`/item/${o.productId ?? o.itemId ?? ""}`)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  상품 보기
                </button>
                <button
                  onClick={() => window.open(`/receipt/${o.orderId}`, "_blank")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  영수증
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {!loading && !err && pages > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <button
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: page <= 0 ? "not-allowed" : "pointer",
              opacity: page <= 0 ? 0.6 : 1,
            }}
          >
            이전
          </button>
          <div style={{ alignSelf: "center", fontSize: 13, color: "#666" }}>
            {page + 1} / {pages} (총 {total.toLocaleString()}건)
          </div>
          <button
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: page + 1 >= pages ? "not-allowed" : "pointer",
              opacity: page + 1 >= pages ? 0.6 : 1,
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}