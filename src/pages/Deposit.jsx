import { useLocation, useNavigate } from 'react-router-dom';
import auctionService from '../api/AuctionService';

function Deposit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auctionId: rawAuctionId, bidAmount } = location.state || {};
  const auctionId = Number(rawAuctionId);

  const sellerId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const buyerId = 'ffd9c396-b70e-4d59-8d04-fad7b1fa1df2';
  

  const handleTossPayment = async () => {
    try {

      // 콘솔 테스트
      console.log("📦 보증금 주문 생성 요청:", {
        auctionId,
        typeofAuctionId: typeof auctionId,
        buyerId,
        sellerId,
      });

      // 보증금 주문 생성
      const orderData = await auctionService.createDepositOrder(auctionId, buyerId, sellerId);
      console.log('✅ 서버 응답 데이터:', orderData);

      // 구조분해
      const { orderId, amount, productName } = orderData;

      const tossPayments = window.TossPayments('test_ck_DnyRpQWGrNaWRw04jOYOVKwv1M9E');

      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: productName,
        customerName: '홍길동',
        successUrl: `http://localhost:5173/payment-success?auctionId=${auctionId}&bidAmount=${bidAmount}`,
        failUrl: 'http://localhost:5173/payment-fail',
      });
    } catch (error) {
      console.error('❌ 보증금 주문 생성 또는 결제 요청 실패:', error.response?.data || error);
      alert('보증금 주문 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px', textAlign: 'center', backgroundColor: 'gold' }}>
      <h2>보증금 예치</h2>
      <p>보증금 예치를 완료해야 입찰이 가능합니다.</p>

      <button
        onClick={handleTossPayment}
        style={{
          padding: '12px 20px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        토스로 결제하기
      </button>

      <div>
        <button
          onClick={() => navigate(`/market/bid/${auctionId}`)}
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
          ← 경매 상세페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Deposit;
