import { useParams } from 'react-router-dom';

function SellerItemPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>판매자용 상세 페이지</h2>
      <p>상품 ID: {id}</p>
      <select defaultValue="판매중">
        <option value="판매중">판매중</option>
        <option value="판매완료">판매완료</option>
      </select>
      <p>상품 제목, 설명, 지도, 가격, 채팅 등 표시</p>
    </div>
  );
}

export default SellerItemPage;