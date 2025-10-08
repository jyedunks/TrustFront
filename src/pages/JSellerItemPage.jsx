// pages/SellerItemPage.jsx
import { useParams } from 'react-router-dom';

function SellerItemPage() {
  const { id } = useParams();

  return (
    <div>
      <img src="/img1.png" alt="상품" width="100%" />
      <select defaultValue="판매중">
        <option value="판매중">판매중</option>
        <option value="판매완료">판매완료</option>
      </select>
      <h3>제목: 에어팟 프로</h3>
      <p>설명: 거의 새거예요</p>
      <img src="/map-placeholder.png" alt="지도" width="100%" />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button>가격 제안</button>
        <button>대화 중인 채팅</button>
      </div>
    </div>
  );
}

export default SellerItemPage;