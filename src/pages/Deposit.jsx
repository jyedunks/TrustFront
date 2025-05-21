import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Deposit(){
  const navigate = useNavigate();
  const handleTossPayment = () => {
    const tossPayments = window.TossPayments('test_ck_GjLJoQ1aVZbDK10zRdagVw6KYe2R');

    tossPayments.requestPayment('카드', {
      amount: 10000,
      orderId: `order-${Date.now()}`,
      orderName: '입찰 보증금',
      customerName: '홍길동',
      successUrl: 'http://localhost:5173/payment-success',
      failUrl: 'http://localhost:5173/payment-fail',
    })
  };

  return (
    <div style={{maxWidth:'393px', margin:'0 auto', padding: '20px', textAlign:'center', backgroundColor:'gold'}}>
      <h2>보증금 예치</h2>
      <p>보증금 10,000원을 예치해야 입찰이 완료됩니다.</p>

      {/* 결제버튼 */}
      <button
        onClick={handleTossPayment}
        style={{
          padding:'12px 20px',
          backgroundColor: '#eee',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        토스로 결제하기
      </button>

      {/* 뒤로가기 버튼 */}
      <div>
        <button
          onClick = {() => navigate(-1)}
          style={{
            backgroundColor: '#eee',
            border: 'none',
            borderRadius: '8px',
            marginTop: '15px',
            padding: '10px 15px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← 입찰 화면으로 돌아가기
        </button>
      </div>
    </div>
  ); 
}

export default Deposit;