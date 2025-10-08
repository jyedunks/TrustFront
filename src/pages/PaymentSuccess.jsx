import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>✅ 결제가 완료되었습니다!</h2>
      <p>보증금이 성공적으로 예치되었습니다. 감사합니다.</p>
      <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
  );
}

export default PaymentSuccess;
