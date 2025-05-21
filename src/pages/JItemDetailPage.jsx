// pages/ItemDetailPage.jsx
import { useParams } from 'react-router-dom';

function ItemDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <img src="/img1.png" alt="상품" width="100%" />
      <h3>제목: 에어팟 프로</h3>
      <p>설명: 거의 새거예요</p>
      <img src="/map-placeholder.png" alt="지도" width="100%" />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button>가격 제안</button>
        <button>채팅하기</button>
      </div>
    </div>
  );
}

export default ItemDetailPage;