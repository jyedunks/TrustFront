// src/pages/BuyList.jsx
import { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";

export default function BuyList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // ✅ 백엔드 연동 전, 테스트용 목데이터
    setItems([
      {
        id: 1,
        title: "아이폰 14 프로 128GB",
        price: 850000,
        image: "https://picsum.photos/seed/iphone/400/400",
        seller: "지혜",
        status: "판매중",
      },
      {
        id: 2,
        title: "캠핑 의자 2개 세트",
        price: 28000,
        image: "https://picsum.photos/seed/chair/400/400",
        seller: "민준",
        status: "판매중",
      },
      {
        id: 3,
        title: "LG 모니터 27인치",
        price: 95000,
        image: "https://picsum.photos/seed/monitor/400/400",
        seller: "유진",
        status: "판매완료",
      },
    ]);
  }, []);

  return (
    <div style={S.wrap}>
      <h2 style={S.title}>일반 물품</h2>
      <div style={S.list}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

const S = {
  wrap: { padding: "20px 16px 80px", background: "#fafafa", minHeight: "100vh" },
  title: { fontSize: 22, fontWeight: 800, marginBottom: 16 },
  list: { display: "grid", gap: 12 },
};