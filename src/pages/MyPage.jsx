import React from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "내 정보 확인", path: "/profile" },
    { label: "나의 판매 목록", path: "/sales" },
    { label: "나의 구매 목록", path: "/purchases" },
    { label: "나의 경매 목록", path: "/auctions" },
    { label: "사업자 인증", path: "/verify" },
    { label: "회원탈퇴", path: "/withdraw" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>My Page</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyPage;