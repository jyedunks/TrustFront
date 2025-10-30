import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WithdrawPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleWithdraw = (e) => {
    e.preventDefault();

    const confirmWithdraw = window.confirm("정말로 탈퇴하시겠습니까? 😢");

    if (confirmWithdraw) {
      // 실제 탈퇴 API 연동 필요
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/"); // 홈으로 이동
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>회원 탈퇴</h2>
      <p style={{ marginTop: "10px", color: "#666" }}>
        탈퇴하시면 등록한 상품 및 구매/판매 기록이 모두 삭제됩니다.
      </p>

      <form onSubmit={handleWithdraw} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          비밀번호 확인
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          탈퇴하기
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "10px",
            backgroundColor: "#ccc",
            color: "#000",
            border: "none",
            borderRadius: "5px",
          }}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default WithdrawPage;