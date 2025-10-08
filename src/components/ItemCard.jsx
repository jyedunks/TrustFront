// src/components/ItemCard.jsx
import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <div style={S.card}>
      <Link to={`/items/${item.id}`} style={S.link}>
        <img src={item.image} alt={item.title} style={S.thumb} />
        <div style={S.info}>
          <h3 style={S.title}>{item.title}</h3>
          <p style={S.price}>{item.price.toLocaleString()}원</p>
          <p style={S.sub}>
            <span>{item.seller}</span>
            <span style={S.dot}>·</span>
            <span>{item.status}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ItemCard;

const S = {
  card: {
    border: "1px solid #eee",
    borderRadius: 10,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  link: {
    display: "flex",
    gap: 12,
    color: "inherit",
    textDecoration: "none",
    padding: 12,
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    objectFit: "cover",
    background: "#f7f7f7",
  },
  info: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: 700, margin: 0 },
  price: { fontSize: 15, fontWeight: 600, color: "#111", margin: "6px 0" },
  sub: { fontSize: 12, color: "#777", margin: 0, display: "flex", alignItems: "center", gap: 6 },
  dot: { opacity: 0.4 },
};