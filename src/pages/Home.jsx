import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function Home() {
  // 지도 API - DOM 연결
  const mapRef = useRef(null);
  // 지도 객체 저장
  const mapInstance = useRef(null);
  // 사업자 인증 여부 (임시 - false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 플로팅 버튼 눌렀을 때 판매/경매 버튼 보이게
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.kakao && mapRef.current) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 제주 예시
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      mapInstance.current = map;
    } else {
      console.warn("카카오 지도 API가 아직 로드되지 않았습니다.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const loc = new window.kakao.maps.LatLng(lat, lng);
        if (mapInstance.current) {
          mapInstance.current.setCenter(loc); // ✅ 내 위치로 중심 이동
        }
      },
      (err) => {
        console.warn('위치 접근에 실패했습니다. 기본 위치로 설정됩니다.');
      }
    );

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
        content: `<div style="padding:5px;">${item.name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(mapInstance.current, marker);
      });
    });
  }, []);

  // 판매하기 버튼 클릭
  const handleSellClick = () => {
    if (!isAuthenticated) {
      alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
    } else {
      window.location.href = '/sell'; // 사업자 인증 완료시 이동
    }
    navigate('/sellform');
  };

  // 경매하기 버튼 클릭
  const handleAuctionClick = () => {
    if (!isAuthenticated) {
      alert('상품 등록을 원하실 경우 [마이페이지-사업자] 인증을 완료해주세요!');
    } else {
      window.location.href = '/sell'; // 사업자 인증 완료시 이동
    }
    navigate('/auctionregister');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '393px',
        height: '100vh',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden', // 스크롤 막기 (임시)
      }}
    >
      <Header />

      {/* 지도 영역 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '60vh'
        }}
      ></div>

      {/* 하단탭 (임시) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ccc', padding: '10px', textAlign: 'center' }}>
        홈 | 일반물품 | 경매물품 | 채팅 | My
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          backgroundColor: '#FFB119',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      {/* 플로팅 버튼 클릭 시 옵션 버튼들 */}
      {showOptions && (
        <div style={{
          position: 'fixed',
          bottom: '140px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={handleSellClick}
            style={{
              padding: '10px',
              backgroundColor: '#BCCDF8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            물품 판매하기
          </button>
          <button
            onClick={handleAuctionClick}
            style={{
              padding: '10px',
              backgroundColor: '#6286E4',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            물품 경매하기
          </button>
        </div>
      )}
    </div>
  )
}

export default Home;