import ItemCard from '../components/ItemCard';

const dummyItems = [
  {
    id: 1,
    image: '/img1.png',
    status: '판매중',
    seller: '사장님',
    title: '에어팟 프로',
    price: 120000,
  },
  {
    id: 2,
    image: '/img2.png',
    status: '판매완료',
    seller: '김민수',
    title: '갤럭시 탭',
    price: 200000,
  },
];

function ItemListPage() {
  return (
    <div>
      <h2>📦 물품 리스트</h2>
      {dummyItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ItemListPage;