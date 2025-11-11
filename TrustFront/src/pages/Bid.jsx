import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import timerIcon from '../assets/redtimer.png';
import auctionService from '../api/AuctionService';

function Bid() {
  const { id } = useParams(); // /market/bid/:id
  const navigate = useNavigate();
  const location = useLocation();
  const refresh = location.state?.refresh || false; // 결제 성공 후 돌아온 경우 감지

  const [auction, setAuction] = useState(null);
  const [bidList, setBidList] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [winnerId, setWinnerId] = useState(null); // ✅ 낙찰자 ID

  // TODO: 실제 로그인 사용자 ID로 교체
  const buyerId = 'ffd9c396-b70e-4d59-8d04-fad7b1fa1df2';

  // ✅ 경매 상세 불러오기
  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const data = await auctionService.getAuctionDetail(id);
      setAuction(data);
      // endTime 기반 타이머 초기화(즉시 환산)
      if (data?.endTime) {
        const end = new Date(data.endTime).getTime();
        setTimeLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
      }
      // 이미 CLOSED면 winner 반영
      if (data?.winner) setWinnerId(data.winner);
    } catch (err) {
      console.error('경매 상세정보 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 상위 입찰 불러오기(내림차순 정렬)
  const fetchTop5Bids = async () => {
    try {
      const data = await auctionService.getTop5Bids(id);
      const sorted = [...data].sort((a, b) => b.bidPrice - a.bidPrice);
      setBidList(sorted.slice(0, 3));
    } catch (error) {
      console.error('입찰 내역 불러오기 실패:', error);
      setBidList([]);
    }
  };

  // 새로고침
  useEffect(() => {
  const loadData = async () => {
    await fetchAuctionDetails();
    await fetchTop5Bids();
  };
  if (id) loadData();
  }, [id, refresh]);  

  // 타이머 종료 시 상태 확인 → CLOSED면 winner 반영
  const checkAuctionEnd = async () => {
    try {
      const res = await auctionService.checkAuctionStatus(id);

      if (res.auctionStatus === 'CLOSED') {
        setWinnerId(res.winner);
        setAuction((prev) => ({ ...prev, auctionStatus: 'CLOSED' }));
        await fetchTop5Bids(); // 종료 후 최종 상위 입찰 재조회
      }
      // 🔇 else 문 완전 제거: 무한 반복 방지
    } catch (err) {
      console.error('경매 상태 확인 실패:', err);
    }
  };

  // 첫 진입 및 refresh 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      await fetchAuctionDetails();
      await fetchTop5Bids();
    };
    if (id) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refresh]);

  // 10초마다 상위 입찰 자동 갱신
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(fetchTop5Bids, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 경매 남은 시간 타이머
  useEffect(() => {
    if (!auction?.endTime) return;
    const end = new Date(auction.endTime).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        checkAuctionEnd(); // ✅ 타이머 끝나면 상태 확인
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction?.endTime]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // 입찰 버튼 클릭
  const handleBid = () => {
    const bid = Number(bidAmount);
    const start = Number(auction.startPrice);
    const unit = Number(auction.bidUnit);

    if (!bidAmount || bidAmount.trim() === '') return alert('입찰 금액을 입력해주세요.');
    if (isNaN(bid) || bid <= 0) return alert('올바른 금액을 입력해주세요.');
    if (bid <= start) return alert(`입찰 금액은 시작가(${start.toLocaleString()}원)보다 커야 합니다.`);
    if ((bid - start) % unit !== 0) return alert(`입찰 금액은 ${unit.toLocaleString()}원 단위로만 증가할 수 있습니다.`);
    if (bidList.length > 0 && bid <= bidList[0].bidPrice)
      return alert(`입찰 금액은 현재 최고가(${bidList[0].bidPrice.toLocaleString()}원)보다 커야 합니다.`);

    // 결제(보증금) 페이지로 이동
    navigate('/deposit', { state: { auctionId: id, bidAmount: bid, refresh: true } });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <p>경매 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isClosed = timeLeft === 0 || auction.auctionStatus === 'CLOSED';

  return (
    <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px' }}>
      <h2>입찰</h2>

      {/* 상품 정보 */}
      <div
        style={{
          marginBottom: '16px',
          padding: '12px',
          border: '1px solid #eee',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        <div>
          <strong>물품명:</strong> {auction.name}
        </div>
        <div>
          <strong>시작가:</strong> {Number(auction.startPrice).toLocaleString()}원
        </div>
        <div>
          <strong>입찰 단위:</strong> {Number(auction.bidUnit).toLocaleString()}원
        </div>
        <div>
          <strong>설명:</strong> {auction.description}
        </div>
      </div>

      {/* 입찰 내역 */}
      <div style={{ marginTop: '20px', marginBottom: '15px' }}>
        <strong>입찰 내역 (상위 3등)</strong>
        {bidList.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '10px 0' }}>
            {bidList.map((bid, i) => (
              <li
                key={bid.id}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor:
                    winnerId &&
                    String(bid.bidderId).trim() === String(winnerId).trim()
                      ? '#d4edda' // ✅ 낙찰자 강조 (초록색)
                      : bid.bidderId === buyerId
                      ? '#fff9e6' // ✅ 내가 입찰한 줄 (노랑)
                      : 'transparent',

                  fontWeight:
                    winnerId &&
                    String(bid.bidderId).trim() === String(winnerId).trim()
                      ? 'bold'
                      : bid.bidderId === buyerId
                      ? 'bold'
                      : 'normal',

                }}
              >
                <span>{i + 1}등</span>
                <span>{bid.bidPrice.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>아직 입찰 내역이 없습니다.</p>
        )}
      </div>

      {/* 타이머 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '24px',
          color: isClosed ? '#999' : 'red',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#fff5f5',
          borderRadius: '5px',
        }}
      >
        <img src={timerIcon} alt="timer" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
        <span>{formatTime(timeLeft)}</span>
        {isClosed && <span style={{ fontSize: '16px', marginLeft: '10px', color: '#999' }}>(마감)</span>}
      </div>

      {/* 입찰 입력 */}
      <input
        type="number"
        placeholder={`${((Number(auction.startPrice) || 0) + (Number(auction.bidUnit) || 0)).toLocaleString()}원 이상 입력`}
        value={bidAmount || ''}
        onChange={(e) => setBidAmount(e.target.value)}
        min={Number(auction.startPrice) + Number(auction.bidUnit)}
        step={Number(auction.bidUnit)}
        disabled={isClosed}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={handleBid}
        disabled={isClosed}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: isClosed ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isClosed ? 'not-allowed' : 'pointer',
        }}
      >
        {isClosed ? '경매 마감' : '입찰하기'}
      </button>
    </div>
  );
}

export default Bid;
