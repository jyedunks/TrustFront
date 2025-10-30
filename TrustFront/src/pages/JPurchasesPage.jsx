import React from "react";

// 임시 데이터
const myPurchases = [
  {
    id: 1,
    title: "커피 머신",
    price: 55000,
    seller: "카페모카상회",
    date: "2025-04-12",
    thumbnail: "/assets/images/coffee.png",
  },
  {
    id: 2,
    title: "중고 의자",
    price: 20000,
    seller: "리사이클샵",
    date: "2025-03-30",
    thumbnail: "/assets/images/chair.png",
  },
];

const PurchasesPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>나의 구매 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {myPurchases.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
            }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px", borderRadius: "8px" }}
            />
            <div>
              <h4 style={{ margin: "0 0 5px" }}>{item.title}</h4>
              <p style={{ margin: "0" }}>{item.price.toLocaleString()}원</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>판매자: {item.seller}</p>
              <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>{item.date} 구매</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchasesPage;