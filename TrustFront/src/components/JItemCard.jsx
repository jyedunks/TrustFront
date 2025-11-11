// src/components/JItemCard.jsx
import { Link } from "react-router-dom";
import SafeImage from "@/components/SafeImage";

export default function JItemCard({ item }) {
  const {
    id,
    title,
    price,
    status = "판매중",
    sellerNickname,
    sellerId,
    thumbnailUrl,  // 백 필드명 맞춰서 사용
  } = item;

  return (
    <div style={S.card}>
      <Link to={`/market/buy/${id}`} state={{ item }} style={S.link}>
        <SafeImage src={thumbnailUrl} alt={title} width={100} height={100} />
        <div style={S.info}>
          <h3 style={S.title}>{title || "제목 없음"}</h3>
          <p style={S.price}>
            {price != null ? `${Number(price).toLocaleString()}원` : "가격 미정"}
          </p>
          <p style={S.sub}>
            <span>{sellerNickname || sellerId || "판매자"}</span>
            <span style={S.dot}>·</span>
            <span>{status}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}

const S = {
  card: { border: "1px solid #eee", borderRadius: 10, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.04)", marginBottom: 10 },
  link: { display: "flex", gap: 12, color: "inherit", textDecoration: "none", padding: 12 },
  info: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  title: { fontSize: 15, fontWeight: 700, margin: 0, color: "#222" },
  price: { fontSize: 15, fontWeight: 600, margin: "6px 0", color: "#111" },
  sub: { fontSize: 12, color: "#777", margin: 0, display: "flex", alignItems: "center", gap: 6 },
  dot: { opacity: .4 },
};