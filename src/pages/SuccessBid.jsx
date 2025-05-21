import apron from '../assets/앞치마.png'

function SuccessBid(){
  return (
    <div style={{maxWidth:'393px', margin:'0 auto', padding:'20px'}}>
      <h2>🎉 낙찰되었습니다</h2>
      <img src={apron} alt='물품이미지(예시)' style={{ width:"100px", height:"100px", border:'1px solid #000'}}/>

      <div style={{marginTop:'10px'}}>
        <p><strong>판매자명</strong> 나폴리맛피자</p>
        <p><strong>설명</strong> 이거입고 흑백요리사 우승했습니다</p>
        <p><strong>낙찰가</strong> 500,000</p>
      </div>

      <p>
        24시간 이내 입금 필요 <br />21시간 남음
      </p>

      <div style={{textAlign:'center', marginTop: '20px'}}>
        <button style={{marginTop:'10px', padding:'10px 10px', cursor:'pointer'}}>결제하기</button>
      </div>
      
    </div>
  )
}

export default SuccessBid;