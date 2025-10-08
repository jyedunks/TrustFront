// src/pages/JChatListPage.jsx
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const dummyRooms = [
  {
    id: 1,
    itemTitle: "에어팟 프로",
    partner: "김금주",
    lastMessage: "안녕하세요~ 관심 있어요!",
    time: "오전 10:24",
    unread: 2,
    thumb: "/img1.png",
  },
  {
    id: 2,
    itemTitle: "맥북 에어",
    partner: "이용자",
    lastMessage: "혹시 직거래 가능할까요?",
    time: "어제",
    unread: 0,
    thumb: "/img2.png",
  },
];

export default function JChatListPage() {
  const [q, setQ] = useState("");

  const rooms = useMemo(() => {
    const t = q.trim();
    if (!t) return dummyRooms;
    return dummyRooms.filter(
      (r) =>
        r.itemTitle.includes(t) ||
        r.partner.includes(t) ||
        r.lastMessage.includes(t)
    );
  }, [q]);

  return (
    <div style={S.wrap}>
      <header style={S.header}>
        <h1 style={S.title}>채팅</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="대화/상품 검색"
          style={S.search}
        />
      </header>

      <ul style={S.list}>
        {rooms.map((r) => (
          <li key={r.id}>
            <Link to={`/chat/${r.id}`} style={S.row}>
              <img
                src={r.thumb || "https://via.placeholder.com/56"}
                alt=""
                style={S.avatar}
              />
              <div style={S.center}>
                <div style={S.topLine}>
                  <span style={S.roomTitle}>
                    {r.itemTitle} · {r.partner}
                  </span>
                  <span style={S.time}>{r.time}</span>
                </div>
                <div style={S.bottomLine}>
                  <span style={S.last}>{r.lastMessage}</span>
                  {r.unread > 0 && <span style={S.badge}>{r.unread}</span>}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const S = {
  wrap: { padding: 16, background: "#fff", minHeight: "100dvh" },
  header: { display: "grid", gap: 10, marginBottom: 8 },
  title: { margin: 0, fontSize: 22, fontWeight: 800 },
  search: {
    height: 40,
    borderRadius: 10,
    border: "1px solid #e5e5ea",
    padding: "0 12px",
    outline: "none",
    fontSize: 14,
    background: "#f7f7f8",
  },
  list: { listStyle: "none", margin: 0, padding: 0 },
  row: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: 12,
    alignItems: "center",
    padding: "12px 4px",
    textDecoration: "none",
    color: "inherit",
    borderBottom: "1px solid #f1f1f4",
  },
  avatar: {
    width: 56,
    height: 56,
    objectFit: "cover",
    borderRadius: 16,
    background: "#eee",
  },
  center: { display: "grid", gap: 6 },
  topLine: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
  },
  roomTitle: { fontWeight: 700, fontSize: 15 },
  time: { fontSize: 12, color: "#8e8e93", flexShrink: 0 },
  bottomLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  last: {
    fontSize: 13,
    color: "#6b7280",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    background: "#ff3b30",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    padding: "0 6px",
    flexShrink: 0,
  },
};