import { useNavigate } from "react-router-dom";

function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>❌ 결제에 실패했습니다</h2>
      <p>보증금 결제가 정상적으로 완료되지 않았습니다.</p>
      <p>입찰을 완료하려면 다시 결제를 시도해 주세요.</p>

      <button onClick={() => navigate('/deposit')}>
        다시 시도하기
      </button>
    </div>
  );
}

export default PaymentFail;
