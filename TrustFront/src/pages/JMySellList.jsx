// src/pages/JMySellList.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySellList } from "@/services/product";

const getUuid = () =>
  localStorage.getItem("USER_UUID") ||
  localStorage.getItem("userUuid") ||
  localStorage.getItem("uuid") ||
  "";

export default function JMySellList() {
  const nav = useNavigate();
  const [uuid] = useState(getUuid());
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [loading, setL] = useState(true);
  const [error, setE] = useState("");
  const [data, setData] = useState({ items: [], total: 0, page: 0, size: 0 });
  const [source, setSource] = useState("");

  const pages = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil((data.total || 0) / (data.size || 1)));
    return { totalPages };
  }, [data]);

  useEffect(() => {
    (async () => {
      if (!uuid) {
        setE("로그인이 필요합니다.");
        setL(false);
        return;
      }
      try {
        setL(true);
        setE("");
        const res = await getMySellList({ uuid, page, size });
        setData(res);
        if (res.source) setSource(res.source);
      } catch (err) {
        console.error(err);
        setE(err?.response?.data?.message || err?.message || "목록 조회 실패");
      } finally {
        setL(false);
      }
    })();
  }, [uuid, page, size]);

  if (!uuid) {
    return (
      <div style={{ padding: 16 }}>
        <h2>나의 판매 목록</h2>
        <p style={{ color: "#e74c3c" }}>로그인이 필요합니다.</p>
        <button onClick={() => nav("/login")}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "24px auto", padding: "0 12px" }}>
      <h2 style={{ marginBottom: 8 }}>나의 판매 목록</h2>
      <div style={{ color: "#777", fontSize: 12, marginBottom: 12 }}>
        UUID: <code>{uuid}</code>
        {source && (
          <>
            {" · API: "}
            <code>{source.replace(/^https?:\/\/[^/]+/,"")}</code>
          </>
        )}
      </div>

      {loading && <div>불러오는 중…</div>}
      {error && <div style={{ color: "tomato", marginBottom: 12 }}>{error}</div>}

      {!loading && !error && data.items.length === 0 && (
        <EmptyState onClickNew={() => nav("/sell")} />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        {data.items.map((it) => (
          <ItemCard key={it.id ?? crypto.randomUUID()} item={it} onClick={() => nav(`/item/${it.id}`)} />
        ))}
      </div>

      {/* 페이지네이션(있으면) */}
      {data.total > data.size && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            이전
          </button>
          <span style={{ lineHeight: "32px" }}>
            {page + 1} / {pages.totalPages}
          </span>
          <button
            disabled={page + 1 >= pages.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ height: 160, background: "#f5f5f5" }}>
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#999" }}>
            이미지 없음
          </div>
        )}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
        <div style={{ color: "#111", marginBottom: 6 }}>
          {Number.isFinite(item.price) ? item.price.toLocaleString() + "원" : "-"}
        </div>
        <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 8 }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: "#f1f3f5",
              color: "#222",
            }}
          >
            {humanStatus(item.status)}
          </span>
          {item.createdAt && <span>{formatDate(item.createdAt)}</span>}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClickNew }) {
  return (
    <div
      style={{
        border: "1px dashed #ddd",
        borderRadius: 12,
        padding: 24,
        margin: "16px 0",
        textAlign: "center",
        color: "#666",
        background: "#fcfcfc",
      }}
    >
      <p style={{ marginBottom: 12 }}>등록한 판매 물품이 없습니다.</p>
      <button onClick={onClickNew} style={{ padding: "8px 14px", borderRadius: 8 }}>
        + 새 물품 등록
      </button>
    </div>
  );
}

function humanStatus(s) {
  const t = String(s || "").toUpperCase();
  if (t.includes("RESERVED")) return "예약중";
  if (t.includes("SOLD")) return "판매완료";
  if (t.includes("ON") || t.includes("SALE")) return "판매중";
  return t || "상태없음";
}

function formatDate(d) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    const y = dt.getFullYear();
    const m = `${dt.getMonth() + 1}`.padStart(2, "0");
    const day = `${dt.getDate()}`.padStart(2, "0");
    const hh = `${dt.getHours()}`.padStart(2, "0");
    const mm = `${dt.getMinutes()}`.padStart(2, "0");
    return `${y}.${m}.${day} ${hh}:${mm}`;
  } catch {
    return String(d);
  }
}