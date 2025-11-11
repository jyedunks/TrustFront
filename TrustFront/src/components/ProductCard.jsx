// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";

function ProductCardBase({ item }) {
  const {
    id, title, price, sellerNickname, status = "판매중",
    thumbnailUrl
  } = item;

  const imgSrc = thumbnailUrl || null; // SafeImage에서 처리

  return (
    <div style={S.card}>
      <Link to={`/market/buy/${id}`} state={{ item }} style={S.link}>
        <SafeImage src={imgSrc} alt={title} width={100} height={100} />
        <div style={S.info}>
          <h3 style={S.title}>{title || "제목 없음"}</h3>
          <p style={S.price}>{price != null ? `${Number(price).toLocaleString()}원` : "가격 미정"}</p>
          <p style={S.sub}>
            <span>{sellerNickname || "판매자"}</span>
            <span style={S.dot}>·</span>
            <span>{status}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}

const ProductCard = React.memo(ProductCardBase, (p,n) => p.item.id === n.item.id && JSON.stringify(p.item) === JSON.stringify(n.item));
export default ProductCard;

const S = {
  card: { border: "1px solid #eee", borderRadius: 10, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", marginBottom: 10 },
  link: { display: "flex", gap: 12, color: "inherit", textDecoration: "none", padding: 12 },
  info: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  title: { fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.2 },
  price: { fontSize: 15, fontWeight: 600, margin: "6px 0" },
  sub: { fontSize: 12, color: "#777", margin: 0, display:'flex', alignItems:'center', gap:6 },
  dot: { opacity: .4 },
};