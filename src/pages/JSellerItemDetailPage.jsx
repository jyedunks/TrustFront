// src/pages/JSellerItemDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const MOCK_ITEMS = [
  { id: 1, title: "아이폰 14 프로 128GB", desc: "거의 새거예요", price: 300000, image: "/img1.png" },
  { id: 2, title: "맥북 에어 M1 8GB",      desc: "생활기스",     price: 750000, image: "/img2.png" },
];

export default function JSellerItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = useMemo(
    () => MOCK_ITEMS.find((i) => String(i.id) === String(id)),
    [id]
  );
  if (!item) return <div style={{ padding: 24 }}>상품을 찾을 수 없어요.</div>;

  const goPay = () => {
    navigate(`/payment?itemId=${item.id}&title=${encodeURIComponent(item.title)}&price=${item.price}`);
  };

  const goChat = () => {
    navigate(`/chat/${item.id}`); // 아이템 id를 채팅방 id로 가정
  };

  return (
    <div style={{ padding: 20 }}>
      <img src={item.image} alt="상품" width="100%" style={{ borderRadius: 12, background:"#f5f5f5" }} />
      <h3 style={{ margin: "16px 0 6px" }}>제목: {item.title}</h3>
      <p style={{ color: "#555" }}>설명: {item.desc}</p>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={goPay}>결제하기</button>
        <button onClick={goChat}>채팅하기</button>
      </div>
    </div>
  );
}