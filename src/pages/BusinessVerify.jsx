import React, { useState } from "react";

const BusinessVerify = () => {
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 실제 서버 전송은 추후 API로 연결 예정
    alert("사업자 인증 정보를 제출했습니다.");
    console.log({
      사업자등록번호: businessNumber,
      상호명: businessName,
      등록증파일: file?.name,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>사업자 인증</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <label>
          사업자등록번호
          <input
            type="text"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder="000-00-00000"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          상호명
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="예: 사당서점"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </label>

        <label>
          사업자등록증 업로드
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ marginTop: "5px" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          인증 제출
        </button>
      </form>
    </div>
  );
};

export default BusinessVerify;