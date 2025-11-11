// src/pages/PaymentFail.jsx
import { useSearchParams } from "react-router-dom";

export default function PaymentFail() {
  const [sp] = useSearchParams();
  const code = sp.get("code");
  const message = sp.get("message");

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Fail</h1>
      <p>code: {code}</p>
      <p>message: {message}</p>
    </div>
  );
}