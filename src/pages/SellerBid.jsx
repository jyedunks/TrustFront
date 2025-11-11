import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import timerIcon from '../assets/redtimer.png';
import { getTop5Bids, confirmWinner } from '../api/AuctionApi';

function SellerBid() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidList, setBidList] = useState([]);
  const [auctionData, setAuctionData] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 추후 API로 경매 정보 불러오기
  const auctionId = id;
  const endTime = '2025-05-19T23:59:00';
  const itemName = '예시 상품명';
  const sPrice = 5000;
  const priceUnit = 50000;
  const description = '예시 설명입니다';

  // Top 5 입찰 내역 불러오기
  useEffect(() => {
    if (auctionId) {
      fetchTop5Bids();
      
      // 10초마다 입찰 내역 갱신
      const interval = setInterval(() => {
        fetchTop5Bids();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [auctionId]);

  const fetchTop5Bids = async () => {
    try {
      const data = await getTop5Bids(auctionId);
      // 상위 5개 입찰 내역 표시
      setBidList(data.slice(0, 5));
    } catch (error) {
      console.error('입찰 내역 불러오기 실패:', error);
      setBidList([]);
    }
  };

  // 남은 시간 계산
  useEffect(() => {
    const end = new Date(endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleConfirmWinner = async () => {
    // 시간이 아직 남아있으면 확정 불가
    if (timeLeft > 0) {
      alert('경매 종료 시간이 지나야 낙찰 확정이 가능합니다.');
      return;
    }

    // 입찰자가 없으면 낙찰 불가
    if (bidList.length === 0) {
      alert('입찰자가 없어 낙찰할 수 없습니다.');
      return;
    }

    // 낙찰 확정 확인
    const winner = bidList[0];
    const confirmMsg = `최고 입찰자를 낙찰자로 확정하시겠습니까?\n\n낙찰 금액: ${winner.bidPrice.toLocaleString()}원`;
    
    if (window.confirm(confirmMsg)) {
      try {
        // 낙찰 확정 API 호출
        await confirmWinner(auctionId, winner.id);
        setIsConfirmed(true);
        alert('✅ 낙찰이 확정되었습니다!');
      } catch (error) {
        console.error('낙찰 확정 실패:', error);
        alert('낙찰 확정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: 'orange' }}>판매자 경매 관리</h2>

      {/* 물품 정보 */}
      <div style={{ marginBottom: '10px' }}>
        <strong>상품명:</strong> {itemName}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>시작가:</strong> {Number(sPrice).toLocaleString()}원
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>입찰 단위:</strong> {Number(priceUnit).toLocaleString()}원
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>설명</strong>
      </div>
      <div style={{
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '5px',
        marginBottom: '10px',
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f9f9f9'
      }}>
        {description}
      </div>

      {/* 타이머 */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        fontSize: '24px', 
        color: timeLeft === 0 ? '#999' : 'red',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#fff5f5',
        borderRadius: '5px'
      }}>
        <img 
          src={timerIcon} 
          alt='timer' 
          style={{ width: '24px', height: '24px', marginRight: '8px' }} 
        />
        <span>{formatTime(timeLeft)}</span>
        {timeLeft === 0 && (
          <span style={{ fontSize: '16px', marginLeft: '10px', color: '#999' }}>
            (마감)
          </span>
        )}
      </div>

      {/* 입찰 내역 - 상위 5등까지 표시 */}
      <div style={{ marginTop: '20px', marginBottom: '15px' }}>
        <strong>입찰 내역 (상위 5등)</strong>
        {bidList.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '10px 0' }}>
            {bidList.map((bid, i) => (
              <li key={bid.id} style={{ 
                padding: '8px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: i === 0 ? '#fff9e6' : 'transparent' // 1등 강조
              }}>
                <span style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>
                  {i + 1}등
                  {i === 0 && ' 🏆'}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {bid.bidPrice.toLocaleString()}원
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            아직 입찰 내역이 없습니다.
          </p>
        )}
      </div>

      {/* 낙찰 확정 버튼 */}
      <button 
        onClick={handleConfirmWinner}
        disabled={timeLeft > 0 || isConfirmed || bidList.length === 0}
        style={{
          width: '100%', 
          padding: '12px', 
          marginTop: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: 
            isConfirmed ? '#28a745' : 
            (timeLeft > 0 || bidList.length === 0) ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: (timeLeft > 0 || isConfirmed || bidList.length === 0) ? 'not-allowed' : 'pointer'
        }}
      >
        {isConfirmed ? '✅ 낙찰 확정 완료' : 
         timeLeft > 0 ? '⏳ 경매 진행 중' : 
         bidList.length === 0 ? '입찰자 없음' : '낙찰 확정'}
      </button>

      {isConfirmed && bidList.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          color: '#155724'
        }}>
          <strong>낙찰 완료!</strong>
          <div style={{ marginTop: '8px', fontSize: '14px' }}>
            낙찰 금액: {bidList[0].bidPrice.toLocaleString()}원
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerBid;