// function LoginPage() {
//     return (
//       <div>
//         <h2>로그인</h2>
//         <input type="text" placeholder="아이디" /><br />
//         <input type="password" placeholder="비밀번호" /><br />
//         <button>로그인</button>
//       </div>
//     );
//   }
  
//   export default LoginPage;

// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/index'; // 또는 user.js에서 login 함수 불러와도 OK

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 로그인 후 리디렉션용

  const handleLogin = async () => {
    try {
      const res = await api.post('/users/login', { email, password });

      const token = res.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      alert('로그인 성공!');
      navigate('/'); // 홈으로 이동
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디 (이메일)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;
