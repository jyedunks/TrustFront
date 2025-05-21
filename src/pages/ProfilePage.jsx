import React from "react";

const dummyUser = {
  name: "홍길동",
  email: "hong@business.com",
  phone: "010-1234-5678",
  profileImage: "/assets/images/default-profile.png", // 없으면 기본 이미지
};

const ProfilePage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>내 정보</h2>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <img
          src={dummyUser.profileImage}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%", marginRight: "20px" }}
        />
        <div>
          <p><strong>이름:</strong> {dummyUser.name}</p>
          <p><strong>이메일:</strong> {dummyUser.email}</p>
          <p><strong>전화번호:</strong> {dummyUser.phone}</p>
        </div>
      </div>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
        onClick={() => alert("정보 수정 페이지로 이동")}
      >
        수정하기
      </button>
    </div>
  );
};

export default ProfilePage;