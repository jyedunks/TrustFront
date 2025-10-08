import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

// 디자인 시스템 컬러
const colors = {
  primary: '#FF7F50',      // 메인 오렌지
  secondary: '#4A90E2',    // 블루
  accent: '#34C759',       // 그린
  background: '#F8F9FA',   // 배경
  text: '#2C3E50',         // 텍스트
  textLight: '#6C757D',    // 연한 텍스트
  border: '#E9ECEF',       // 경계선
  white: '#FFFFFF',        // 화이트
  shadow: 'rgba(0,0,0,0.1)', // 그림자
  danger: '#FF4757'
};

// 벨 아이콘 (알림)
function BellIcon({ size = 24, color = colors.text, hasNotification = false }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      >
        <path
          d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
          fill={color}
        />
        <path
          d="M19 17H5c-.8 0-1.3-.8-.9-1.5l1.1-2V9a6.8 6.8 0 0 1 5-6.6V2a1 1 0 1 1 2 0v.4A6.8 6.8 0 0 1 18.8 9v4.5l1.1 2c.4.7-.1 1.5-.9 1.5Z"
          fill={color}
        />
      </svg>
      {hasNotification && (
        <div
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: colors.danger,
            border: `2px solid ${colors.white}`,
            boxShadow: `0 1px 3px rgba(0,0,0,0.2)`
          }}
        />
      )}
    </div>
  );
}

function Home() {
  // 지도 API - DOM 연결
  const mapRef = useRef(null);
  // 지도 객체 저장
  const mapInstance = useRef(null);
  // 사업자 인증 여부 (임시 - false)
  const [isAuthenticated] = useState(true);
  // 플로팅 버튼 토글
  const [showOptions, setShowOptions] = useState(false);
  // 위치
  const [selectedLocation, setSelectedLocation] = useState('현재 위치');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  // 알림 상태
  const [hasNotification] = useState(true); // 임시 true

  const navigate = useNavigate();

  const locationOptions = [
    '현재 위치',
    '강남구 역삼동',
    '서초구 서초동',
    '마포구 홍대입구',
    '용산구 이태원',
  ];

    // 위치 선택
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    // 위치에 맞춰 지도 이동 로직을 원하면 여기서 추가
  };

  
  // 판매 클릭 (경로 수정)
  const handleSellClick = () => {
    setShowOptions(false);
    if (!isAuthenticated) {
      alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
      return;
    }
    navigate('/sell'); // 실제 판매 페이지 경로로 수정
  };

  // 경매 클릭 (경로 수정)
  const handleAuctionClick = () => {
    setShowOptions(false);
    if (!isAuthenticated) {
      alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
      return;
    }
    navigate('/market/auction/register'); // 실제 경매 페이지 경로로 수정
  };

  // 오버레이 클릭 시 드롭다운/옵션 닫기
  const closeOverlays = () => {
    setShowOptions(false);
    setIsLocationDropdownOpen(false);
  };

  const HEADER_HEIGHT = 56;

 // 지도 초기화 로직
  useEffect(() => {
    // 카카오 지도 API 로드 대기
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps && mapRef.current) {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const loc = new window.kakao.maps.LatLng(lat, lng);
            if (mapInstance.current) {
              mapInstance.current.setCenter(loc);
            }
          },
          () => {
            console.warn('위치 접근에 실패했습니다. 기본 위치로 설정됩니다.');
          }
        );

        // 마커 생성
        const items = [
          { id: 1, name: '솜사탕기계', lat: 37.549295, lng: 127.082674 },
          { id: 2, name: '테이블', lat: 37.542168, lng: 127.085474 },
        ];

        items.forEach((item) => {
          const marker = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: new window.kakao.maps.LatLng(item.lat, item.lng),
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px; font-size:12px;">${item.name}</div>`,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(mapInstance.current, marker);
          });
        });
      } else {
        // 카카오 지도 API가 아직 로드되지 않은 경우 재시도
        setTimeout(initializeMap, 100);
      }
    };

    initializeMap();
  }, []);


  return (
    <div
      style={{
        width: '100%',
        maxWidth: '393px',
        height: '100vh',
        margin: '0 auto',
        backgroundColor: colors.background,
        position: 'relative',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 고정 헤더 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '393px',
          height: `${HEADER_HEIGHT}px`,
          backgroundColor: colors.white,
          boxShadow: `0 4px 16px ${colors.shadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          zIndex: 999, 
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
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

        {/* 위치 드롭다운 트리거 (외곽선 제거 버전) */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'right', marginRight: '5px'}}>
          <button
            onClick={() => setIsLocationDropdownOpen((v) => !v)}
            style={{
              padding: '8px 12px',
              backgroundColor: colors.white,
              border: 'none',                 // ← 외곽선 제거
              outline: 'none',                // ← 포커스 외곽선 제거
              borderRadius: 999,
              boxShadow: `0 2px 10px ${colors.shadow}`, // 그림자로만 구분
              fontSize: 14,
              color: colors.text,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontWeight: 600 }}>{selectedLocation}</span>
            <span
              style={{
                transform: isLocationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
                fontSize: 12,
                color: colors.textLight,
              }}
            >
              ▼
            </span>
          </button>

          {/* 드롭다운 메뉴 (외곽선 제거) */}
          {isLocationDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                minWidth: 180,
                backgroundColor: colors.white,
                border: 'none', // ← 외곽선 제거
                borderRadius: 12,
                boxShadow: `0 8px 20px ${colors.shadow}`,
                overflow: 'hidden',
                zIndex: 1200,
              }}
            >
              {locationOptions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: 'none',
                    backgroundColor:
                      selectedLocation === location ? colors.background : colors.white,
                    color: colors.text,
                    fontSize: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
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
          onClick={() => navigate('/notifications')}
          aria-label="알림"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: 'none',
            background: colors.background,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
        <BellIcon size={20} color={colors.text} hasNotification={hasNotification} />
        </button>
      </header>

      {/* 헤더 높이만큼 여백 */}
      <div style={{ height: HEADER_HEIGHT }} />

      {/* 지도 영역 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '60vh',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          margin: '0 16px',
          maxWidth: 'calc(100% - 32px)',
          boxShadow: `0 -2px 16px ${colors.shadow}`,
          background: colors.white,
        }}
      />

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          backgroundColor: colors.primary,
          border: 'none',
          fontSize: '24px',
          color: colors.white,
          cursor: 'pointer',
          boxShadow: `0 4px 16px rgba(255, 127, 80, 0.3)`,
          transition: 'all 0.3s ease',
          transform: showOptions ? 'rotate(45deg)' : 'rotate(0deg)',
          zIndex: 1000,
        }}
        aria-label="작업 추가"
      >
        +
      </button>

      {/* 플로팅 옵션 */}
      {showOptions && (
        <div
          style={{
            position: 'fixed',
            bottom: '170px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleSellClick}
            style={{
              padding: '12px 20px',
              backgroundColor: colors.white,
              border: `2px solid ${colors.primary}`,
              borderRadius: '25px',
              cursor: 'pointer',
              color: colors.primary,
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            물품 판매하기
          </button>
          <button
            onClick={handleAuctionClick}
            style={{
              padding: '12px 20px',
              backgroundColor: colors.secondary,
              border: `2px solid gray`,
              borderRadius: '25px',
              cursor: 'pointer',
              color: colors.white,
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: `0 4px 12px ${colors.shadow}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            물품 경매하기
          </button>
        </div>
      )}

      {/* 배경 오버레이 (옵션/드롭다운 열릴 때만) */}
      {(showOptions || isLocationDropdownOpen) && (
        <div
          onClick={closeOverlays}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
}

export default Home;
