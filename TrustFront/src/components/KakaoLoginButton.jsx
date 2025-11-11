import React from "react";

export default function KakaoLoginButton() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const handleLogin = () => {
    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 환경변수가 설정되지 않았습니다.");
      return;
    }

    // 카카오 인가 요청 URL 생성
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code`;

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        backgroundColor: "#FEE500",
        color: "#000",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        padding: "10px 20px",
        cursor: "pointer",
      }}
    >
      🟡 카카오로 로그인
    </button>
  );
}