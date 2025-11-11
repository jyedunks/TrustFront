// src/lib/auth.js
export function decodeJwt(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  }
  
  export function getCurrentUserUuid() {
    const token = localStorage.getItem('accessToken'); // 보관 위치는 프로젝트에 맞게
    if (!token) return null;
    const p = decodeJwt(token);
    // 백엔드가 어떤 클레임을 쓰는지에 맞게 선택
    return p?.userUuid || p?.uuid || p?.sub || null;
  }