import React from "react";

// 더미 경매 데이터
const myAuctions = [
  {
    id: 1,
    title: "빈티지 시계",
    bidPrice: 12000,
    status: "낙찰", // 진행중 / 낙찰 / 유찰
    thumbnail: "/assets/images/watch.png",
  },
  {
    id: 2,
    title: "앤틱 테이블",
    bidPrice: 45000,
    status: "진행중",
    thumbnail: "/assets/images/table.png",
  },
];

const AuctionsPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>나의 경매 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {myAuctions.map((item) => (
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
              <p style={{ margin: "0" }}>내 입찰가: {item.bidPrice.toLocaleString()}원</p>
              <p
                style={{
                  margin: "5px 0",
                  color:
                    item.status === "낙찰"
                      ? "green"
                      : item.status === "유찰"
                      ? "gray"
                      : "orange",
                }}
              >
                상태: {item.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionsPage;