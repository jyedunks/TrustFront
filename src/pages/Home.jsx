import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import OrderButton from './OrderButton';
import ChatRequestButton from './ChatRequestButton';

function Home() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isAuthenticated] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const initMap = () => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      mapInstance.current = map;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const loc = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(loc);
        },
        () => {
          console.warn('위치 접근에 실패했습니다. 기본 위치로 설정됩니다.');
        }
      );

      const items = [
        { id: 1, name: '솜사탕기계', lat: 37.549295, lng: 127.082674 },
        { id: 2, name: '테이블', lat: 37.542168, lng: 127.085474 },
      ];

      items.forEach((item) => {
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(item.lat, item.lng),
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${item.name}</div>`,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });
      });
    };

    if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
      window.kakao.maps.load(() => {
        initMap();
      });
    } else {
      console.warn('카카오 맵 SDK가 아직 로드되지 않았습니다.');
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '393px',
        height: '100vh',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
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

      {/* 하단탭 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ccc',
        padding: '10px',
        textAlign: 'center'
      }}>
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

      {/* 옵션 버튼들 */}
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

          {/* ✅ 주문 버튼 추가 */}
          <OrderButton />

          {/* ✅ 채팅 요청 버튼 */}
          <ChatRequestButton />
        </div>
      )}
    </div>
  );
}

export default Home;