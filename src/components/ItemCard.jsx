// components/ItemCard.jsx
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <img src={item.image} alt="상품" width="80" />
      <div>
        <p>[{item.status}] {item.seller}</p>
        <p>{item.title}</p>
        <p>{item.price.toLocaleString()}원</p>
        <Link to={`/items/${item.id}`}>상세 보기</Link>
      </div>
    </div>
  );
}

export default ItemCard;