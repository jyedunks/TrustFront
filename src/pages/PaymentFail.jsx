import { useNavigate } from 'react-router-dom';

function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: '393px',
        margin: '100px auto',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#ffecec',
        borderRadius: '8px',
      }}
    >
      <h2>결제 실패 😢</h2>
      <p>보증금 결제 중 오류가 발생했습니다.</p>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '15px',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#ddd',
          cursor: 'pointer',
        }}
      >
        돌아가기
      </button>
    </div>
  );
}

export default PaymentFail;
