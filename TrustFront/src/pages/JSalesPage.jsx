import React from "react";

// 임시 더미 데이터
const mySales = [
  {
    id: 1,
    title: "중고 냉장고",
    price: 100000,
    status: "판매중",
    thumbnail: "/assets/images/fridge.png",
  },
  {
    id: 2,
    title: "에어프라이어",
    price: 30000,
    status: "판매완료",
    thumbnail: "/assets/images/airfryer.png",
  },
];

const SalesPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>나의 판매 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {mySales.map((item) => (
          <li key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px", borderRadius: "8px" }}
            />
            <div>
              <h4 style={{ margin: "0 0 5px" }}>{item.title}</h4>
              <p style={{ margin: "0" }}>{item.price.toLocaleString()}원</p>
              <p style={{ margin: "5px 0", color: item.status === "판매중" ? "green" : "gray" }}>{item.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesPage;