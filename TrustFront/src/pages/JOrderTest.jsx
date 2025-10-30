// src/pages/JOrderTest.jsx
import { useState } from "react";
import { createOrder } from "../services/orders";

export default function JOrderTest() {
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const handleCreate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const order = await createOrder({
        amount: 10000,
        productName: "일반 상품 1",
      });
      console.log("order:", order);
      setLastOrder(order);
      alert(`주문 생성 완료! orderId: ${order.orderId}`);
    } catch (e) {
      console.error(e);
      alert("주문 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>주문 생성 테스트</h3>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "생성 중..." : "주문 생성"}
      </button>
      {lastOrder && (
        <pre style={{ marginTop: 12, background: "#f7f7f7", padding: 12 }}>
{JSON.stringify(lastOrder, null, 2)}
        </pre>
      )}
    </div>
  );
}