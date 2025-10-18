import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuctionList() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 실제 API 연동 부분
    // TODO: 백엔드 연동 시 /api/auctions 로 교체
    setAuctions([
      {
        id: 1,
        title: "에어프라이어",
        price: 52000,
        image: "https://via.placeholder.com/80",
        status: "입찰 중",
      },
      {
        id: 2,
        title: "책장",
        price: 35000,
        image: "https://via.placeholder.com/80",
        status: "낙찰 실패",
      },
    ]);
  }, []);

  const handleClick = (id) => {
    navigate(`/market/bid/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
        참여 중인 경매
      </h2>

      {auctions.length === 0 ? (
        <p>현재 참여 중인 경매가 없습니다.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {auctions.map((auction) => (
            <div
              key={auction.id}
              onClick={() => handleClick(auction.id)}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                cursor: "pointer",
                padding: "12px",
              }}
            >
              <img
                src={auction.image}
                alt={auction.title}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  marginRight: "12px",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {auction.title}
                </div>
                <div
                  style={{
                    color: "#555",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  {auction.price.toLocaleString()}원
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color:
                      auction.status === "입찰 중"
                        ? "#2b8a3e"
                        : auction.status === "낙찰 실패"
                        ? "#d9480f"
                        : "#555",
                  }}
                >
                  {auction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}