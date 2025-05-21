import apron from '../assets/앞치마.png'


function FailBid() {
  return (
    <div style={{ maxWidth: '393px', margin: '0 auto', padding: '20px' }}>
      <h2>낙찰 실패</h2>
      <img src={apron} alt='물품이미지(예시)' style={{ width:"100px", height:"100px", border:'1px solid #000'}}/>

      <div style={{ marginTop: '10px' }}>
        <p><strong>판매자명</strong> 나폴리맛피자</p>
        <p><strong>설명</strong> 이거입고 흑백요리사 우승했습니다</p>
        <p><strong>낙찰가</strong> 500,000</p>
      </div>

      <p style={{ marginTop: '30px', textAlign: 'center', color: 'gray' }}>
        경매가 마감되었습니다.
      </p>
    </div>
  );
}

export default FailBid;
