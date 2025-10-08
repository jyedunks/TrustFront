// src/pages/JItemDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const MOCK_ITEMS = [
  { id: 1, title: "에어팟 프로", desc: "거의 새거에요", price: 300000, image: "/img1.png" },
  { id: 2, title: "맥북 에어", desc: "M1 8GB", price: 750000, image: "/img2.png" },
];

export default function JItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = useMemo(
    () => MOCK_ITEMS.find(i => String(i.id) === String(id)),
    [id]
  );
  if (!item) return <div style={{ padding: 24 }}>상품을 찾을 수 없어요.</div>;

  const goPay = () => {
    // 결제 페이지로 파라미터 넘김
    navigate(`/payment?itemId=${item.id}&title=${encodeURIComponent(item.title)}&price=${item.price}`);
  };

  const goChat = () => {
    // 채팅방으로 이동 (임시: item.id 기반 방 id)
    navigate(`/chat/${item.id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>상품</h2>
      <img src={item.image} alt="상품" width="100%" />
      <h3>제목: {item.title}</h3>
      <p>설명: {item.desc}</p>

      <img src="/map-placeholder.png" alt="지도" width="100%" />

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={goPay}>결제하기</button>
        <button onClick={goChat}>채팅하기</button>
      </div>
    </div>
  );
}