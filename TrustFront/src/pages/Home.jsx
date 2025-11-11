// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyOnce } from "@/utils/notifyOnce";

// 디자인 시스템 컬러
const colors = {
  primary: "#FF7F50",
  secondary: "#4A90E2",
  accent: "#34C759",
  background: "#F8F9FA",
  text: "#2C3E50",
  textLight: "#6C757D",
  border: "#E9ECEF",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.1)",
  danger: "#FF4757",
};

// 벨 아이콘 (알림)
function BellIcon({ size = 24, color = colors.text, hasNotification = false }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z" fill={color} />
        <path
          d="M19 17H5c-.8 0-1.3-.8-.9-1.5l1.1-2V9a6.8 6.8 0 0 1 5-6.6V2a1 1 0 1 1 2 0v.4A6.8 6.8 0 0 1 18.8 9v4.5l1.1 2c.4.7-.1 1.5-.9 1.5Z"
          fill={color}
        />
      </svg>
      {hasNotification && (
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: colors.danger,
            border: `2px solid ${colors.white}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const navigate = useNavigate();

  // 로그인/가입 성공 알림 (한 번만)
  useEffect(() => {
    notifyOnce("JUST_LOGGED_IN", "로그인에 성공했습니다!");
    notifyOnce("JUST_SIGNED_UP", "회원가입에 성공했습니다!");
    notifyOnce("JUST_KAKAO_LOGIN", "카카오 로그인에 성공했습니다!");
  }, []);

  // 사업자 인증 (임시)
  const [isAuthenticated] = useState(true);

  // 플로팅 버튼/위치 드롭다운 상태
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("현재 위치");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // 알림 뱃지 (임시)
  const [hasNotification] = useState(true);

  const locationOptions = [
    "현재 위치",
    "강남구 역삼동",
    "서초구 서초동",
    "마포구 홍대입구",
    "용산구 이태원",
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    // TODO: 선택한 위치로 지도 이동 로직 추가
  };

  const handleSellClick = () => {
    setShowOptions(false);
    if (!isAuthenticated) {
      alert("상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!");
      return;
    }
    navigate("/sell"); // 라우트 존재 확인
  };

  const handleAuctionClick = () => {
    setShowOptions(false);
    if (!isAuthenticated) {
      alert("상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!");
      return;
    }
    navigate("/market/auction/register"); // 라우트 존재 확인
  };

  const closeOverlays = () => {
    setShowOptions(false);
    setIsLocationDropdownOpen(false);
  };

  const HEADER_HEIGHT = 56;

  // 카카오 지도 초기화
  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) return;

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      mapInstance.current = map;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const loc = new window.kakao.maps.LatLng(latitude, longitude);
            map.setCenter(loc);
          },
          () => console.warn("위치 접근 실패")
        );
      }
    };

    // SDK 준비 상태 체크
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
    } else {
      const checkKakaoReady = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoReady);
          window.kakao.maps.load(initializeMap);
        }
      }, 100);
      return () => clearInterval(checkKakaoReady);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "393px",
        height: "100vh",
        margin: "0 auto",
        backgroundColor: colors.background,
        position: "relative",
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 고정 헤더 */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "393px",
          height: `${HEADER_HEIGHT}px`,
          backgroundColor: colors.white,
          boxShadow: `0 4px 16px ${colors.shadow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          zIndex: 999,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: colors.primary,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 0.2,
            }}
          >
            사당해요
          </div>
        </Link>

        {/* 위치 드롭다운 트리거 */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            justifyContent: "right",
            marginRight: "5px",
          }}
        >
          <button
            onClick={() => setIsLocationDropdownOpen((v) => !v)}
            style={{
              padding: "8px 12px",
              backgroundColor: colors.white,
              border: "none",
              outline: "none",
              borderRadius: 999,
              boxShadow: `0 2px 10px ${colors.shadow}`,
              fontSize: 14,
              color: colors.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontWeight: 600 }}>{selectedLocation}</span>
            <span
              style={{
                transform: isLocationDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
                fontSize: 12,
                color: colors.textLight,
              }}
            >
              ▼
            </span>
          </button>

          {/* 드롭다운 메뉴 */}
          {isLocationDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                minWidth: 180,
                backgroundColor: colors.white,
                border: "none",
                borderRadius: 12,
                boxShadow: `0 8px 20px ${colors.shadow}`,
                overflow: "hidden",
                zIndex: 1200,
              }}
            >
              {locationOptions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "none",
                    backgroundColor:
                      selectedLocation === location ? colors.background : colors.white,
                    color: colors.text,
                    fontSize: 14,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 알림 아이콘 */}
        <button
          onClick={() => navigate("/notifications")}
          aria-label="알림"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: "none",
            background: colors.background,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <BellIcon size={20} color={colors.text} hasNotification={hasNotification} />
        </button>
      </header>

      {/* 헤더 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 지도 영역 */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "60vh",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          margin: "0 16px",
          maxWidth: "calc(100% - 32px)",
          boxShadow: `0 -2px 16px ${colors.shadow}`,
          background: colors.white,
        }}
      />

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setShowOptions((v) => !v)}
        style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          backgroundColor: colors.primary,
          border: "none",
          fontSize: "24px",
          color: colors.white,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(255, 127, 80, 0.3)",
          transition: "all 0.3s ease",
          transform: showOptions ? "rotate(45deg)" : "rotate(0deg)",
          zIndex: 1000, // 오버레이(999)보다 위
        }}
        aria-label="작업 추가"
      >
        +
      </button>

      {/* 플로팅 옵션 */}
      {showOptions && (
        <div
          style={{
            position: "fixed",
            bottom: "170px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleSellClick}
            style={{
              padding: "12px 20px",
              backgroundColor: colors.white,
              border: `2px solid ${colors.primary}`,
              borderRadius: "25px",
              cursor: "pointer",
              color: colors.primary,
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            물품 판매하기
          </button>
          <button
            onClick={handleAuctionClick}
            style={{
              padding: "12px 20px",
              backgroundColor: colors.secondary,
              border: "2px solid gray",
              borderRadius: "25px",
              cursor: "pointer",
              color: colors.white,
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            물품 경매하기
          </button>
        </div>
      )}

      {/* 배경 오버레이 (FAB/드롭다운 외 영역 클릭 시 닫힘) */}
      {(showOptions || isLocationDropdownOpen) && (
        <div
          onClick={closeOverlays}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 999, // FAB(1000) 아래, 지도 위
          }}
        />
      )}
    </div>
  );
}