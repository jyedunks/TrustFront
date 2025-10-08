// src/pages/JSellerItemPage.jsx
import { Link } from "react-router-dom";

const MOCK_ITEMS = [
  { id: 1, title: "아이폰 14 프로 128GB", price: 850000, image: "/img1.png", seller: "지혜", status: "판매중" },
  { id: 2, title: "캠핑 의자 2개 세트", price: 28000,  image: "/img2.png", seller: "민준", status: "판매중" },
  { id: 3, title: "LG 모니터 27인치",   price: 95000,  image: "/img3.png", seller: "유진", status: "판매완료" },
];

export default function JSellerItemPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ margin: "8px 0 16px" }}>일반 물품</h2>

      <div style={{ display: "grid", gap: 14 }}>
        {MOCK_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr",
              gap: 12,
              padding: 14,
              borderRadius: 14,
              background: "#fff",
              boxShadow: "0 2px 14px rgba(0,0,0,.06)",
              textDecoration: "none",
              color: "#111",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              width={96}
              height={96}
              style={{ objectFit: "cover", borderRadius: 12, background: "#eee" }}
            />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                {item.price.toLocaleString()}원
              </div>
              <div style={{ fontSize: 12, color: "#777" }}>
                {item.seller} · {item.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}