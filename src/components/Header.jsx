import { useState } from 'react';
import bellOn from '../assets/notifications.png';
import bellOff from '../assets/notifications_active.png';


function Header() {
  const [locations, setLocations] = useState(['어린이대공원', '건대입구', '잠실']);
  const [currentLocation, setCurrentLocation] = useState('어린이대공원');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  return (
    <div style = {{
      width: '100%',
      maxWidth: '393px',
      padding: '10px 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      zIndex: 10,
      backgroundColor: '#fff',
      overflow: 'visible',
    }}>
      {/* 위치 선택 + 드롭다운 */}
      <div onClick={() => setShowDropdown(!showDropdown)} style = {{ cursor: 'pointer', position: 'relative0'}}>
        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{currentLocation} ▼</span>
        {showDropdown && (
          <div style = {{
            position: 'absolute',
            top: '25px',
            left: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}>
            {locations.map(loc => (
              <div
                key = {loc}
                onClick={() => {
                  setCurrentLocation(loc);
                  setShowDropdown(false);
                }}
                style = {{padding: '8px 12px', cursor: 'pointer'}}
              >
                {loc}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 알림 아이콘 */}
      <img
        src = {hasNotification ? bellOn : bellOff}
        alt = '알림'
        style = {{width: '24px', height: '24px', cursor: 'pointer', marginRight: '20px'}}
        onClick = {() => {
          console.log('알림 클릭');
        }}
      >
      </img>

    </div>
  );
}

export default Header;