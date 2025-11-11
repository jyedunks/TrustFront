// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [sp] = useSearchParams();
  const [msg, setMsg] = useState("결제 승인 중...");

  const paymentKey = sp.get("paymentKey");
  const orderId    = sp.get("orderId");
  const amount     = Number(sp.get("amount") || 0);

  const API = import.meta.env.VITE_API_BASE_URL; // 예: http://54.66.146.131:8080

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await fetch(`${API}/payments/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const text = await res.text();
        if (!res.ok) {
          console.error("❌ confirm error:", res.status, text);
          setMsg(`승인 실패(${res.status}). ${text || "관리자에게 문의하세요."}`);
          return;
        }
        try {
          const data = JSON.parse(text);
          setMsg(`결제 승인 완료! (status: ${data.status || "OK"})`);
        } catch {
          setMsg("결제 승인 완료!");
        }
      } catch (err) {
        console.error(err);
        setMsg("승인 실패. 네트워크 오류");
      }
    };
    if (paymentKey && orderId && amount) confirm();
  }, [paymentKey, orderId, amount, API]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Success</h1>
      <p>paymentKey: {paymentKey}</p>
      <p>orderId: {orderId}</p>
      <p>amount: {amount}</p>
      <p>{msg}</p>
    </div>
  );
}