import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const navigate = useNavigate();

  const handlePayment = () => {
    // 여기에 토스 API 연동 로직 들어갈 예정
    // 예: window.location.href = "https://tosspay.example.com";

    // 임시: 성공 후 redirect
    navigate('/payment-success');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>결제</h2>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <img src="/img1.png" alt="상품사진" width="80" />
        <div>
          <p><strong>판매자명</strong> · 물품이름</p>
          <p>결제금액: <strong>30,000원</strong></p>
        </div>
      </div>

      <button style={{ marginTop: '20px', width: '100%' }} onClick={handlePayment}>
        결제하기
      </button>

      <button style={{ marginTop: '10px', width: '100%' }}>
        결제수단
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
        <button onClick={() => navigate('/purchases')}>구매내역</button>
        <button onClick={() => navigate('/sales')}>판매내역</button>
      </div>
    </div>
  );
}

export default PaymentPage;