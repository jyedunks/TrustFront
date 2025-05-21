import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import timerIcon from '../assets/redtimer.png';


function SellerBid() {
  const {id} = useParams();
  const [timeLeft, setTimeLeft] = useState(0);

  // 추후 api or props 연결
  const endTime = '2025-05-19T23:59';

  useEffect(() => {
    const end = new Date(endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        handleAutoWin(); // 자동 낙찰 실행
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

  const handleAutoWin = () => {
    alert('⏰ 시간이 만료되어 자동으로 낙찰 처리됩니다.');
    // 여기서 가장 높은 입찰자 낙찰 처리 API 요청 가능
  };

  return (
    <div style={{maxWidth:'393px', margin: '0 auto', padding:'20px'}}>
      <h2>📦 판매자 경매 관리</h2>
      <p>물품 이름: {id}</p>

      

      <div style={{marginTop:'20px'}}>
        <strong>입찰자 목록</strong>
        <ul>
          <li>user1 - 15,000원</li>
          <li>user2 - 12,000원</li>
          <li>user3 - 10,000원</li>
        </ul>
      </div>

      {/* 타이머 */}
      <div style={{display:'flex', alignItems:'center', fontSize:'24px', color:'red'}}>
        <img src={timerIcon} alt='timer' style={{width:'24px', height:'24px', marginRight:'8px'}} />
        {formatTime(timeLeft)}
      </div>
      
      <button style={{marginTop: '20px'}}>낙찰 확정</button>
    </div>
  )
}

export default SellerBid;