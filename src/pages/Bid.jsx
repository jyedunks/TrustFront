import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import timerIcon from '../assets/redtimer.png';

// 입찰자용 페이지 
function Bid(props){
  const [bidList, setBidList] = useState([15000, 10000, 5000]); //예시 
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const {
    sPrice = 5000, 
    description = "예시 설명입니다", 
    priceUnit = 1000, sellerName = "홍길동", 
    endTime = '2025-05-19T23:59',
  } = props;


  // 남은 시간 계산
  useEffect(() => {
    const end = new Date(endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);

      if(remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
  };

  const handleBid = () => {
    const bid = Number(bidAmount);
    const start = Number(sPrice);
    const unit = Number(priceUnit);

    if (isNaN(bid) || bid <= start) {
      alert(`입찰 금액은 시작가(${start.toLocaleString()}원)보다 커야 합니다.`);
      return;
    }

    if ((bid - start) % unit !== 0) {
      alert(`입찰 금액은 입찰 단위(${unit.toLocaleString()}원)의 배수여야 합니다.`);
      return;
    }

    // 유효성 통과 시 보증금 예치 페이지로 이동
    navigate('/deposit');
  };

  return (
    <div style={{maxWidth:'393px', margin:'0 auto', padding:'20px'}}>
      <h2>입찰</h2>

      {/* 물품 정보(예시) */}
      <div><strong>판매자명</strong> {sellerName}</div>
      <div><strong>시작가</strong> {Number(sPrice).toLocaleString()}</div>
      <div><strong>입찰 단위</strong> {Number(priceUnit).toLocaleString()}원</div>
      <div><strong>설명</strong></div>
<div style={{
  border: '1px solid #ccc',
  padding: '8px',
  borderRadius: '5px',
  marginBottom: '10px',
  whiteSpace: 'pre-wrap'
}}>
  {description}
</div>


      {/* 입찰 내역 */}
      <div style={{marginTop:'20px'}}>
        <strong>입찰 내역</strong>
        <ul>
          {bidList.map((bid, i) => (
            <li key={i}>{i+1}등: {bid.toLocaleString()}원</li>
          ))}
        </ul>
      </div>

      {/* 타이머 */}
      <div style={{display:'flex', alignItems:'center', fontSize:'24px', color:'red'}}>
        <img src={timerIcon} alt='timer' style={{width:'24px', height:'24px', marginRight:'8px'}} />
        {formatTime(timeLeft)}
      </div>

      {/* 입찰 입력 */}
      <input
        type='number'
        placeholder='입찰 금액을 입력하세요'
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        min={sPrice + priceUnit}
        step={priceUnit}
        style = {{width:'100%',marginTop:'10px'}}
      />

      <button 
        onClick = {handleBid}
        style = {{width:'100%', padding: '10px', marginTop: '10px'}}
      >
        입찰하기
      </button>
    </div>
  )
}

export default Bid;