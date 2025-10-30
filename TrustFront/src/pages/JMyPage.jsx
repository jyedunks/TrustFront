import React from "react";
import { useNavigate } from "react-router-dom";

const JMyPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "내 정보 확인", path: "/my/profile" },
    { label: "나의 판매 목록", path: "/my/sell" },
    { label: "나의 구매 목록", path: "/my/purchase" },
    { label: "나의 경매 목록", path: "/my/auction" },
    { label: "사업자 인증", path: "/my/verify" },
    { label: "회원탈퇴", path: "/my/withdraw" },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "393px", margin: "0 auto" }}>
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
              cursor: "pointer",
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

export default JMyPage;