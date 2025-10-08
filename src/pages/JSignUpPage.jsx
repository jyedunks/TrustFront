import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function JSignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.email || !form.nickname || !form.password || !form.passwordConfirm) {
      return '필수 입력값을 모두 채워주세요.';
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) return '이메일 형식을 확인해주세요.';
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setError('');
    setLoading(true);
    try {
      // 개발 중 프록시를 쓰면 /api 로 바로 호출 가능. (vite.config.js 에 proxy 설정 권장)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          nickname: form.nickname,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={onSubmit} style={styles.form}>
        <h1 style={{ margin: 0 }}>회원가입</h1>

        <label style={styles.label}>
          이메일
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            style={styles.input}
            autoComplete="email"
            required
          />
        </label>

        <label style={styles.label}>
          닉네임
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={onChange}
            placeholder="별명을 입력하세요"
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          비밀번호
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="8자 이상"
            style={styles.input}
            autoComplete="new-password"
            required
          />
        </label>

        <label style={styles.label}>
          비밀번호 확인
          <input
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={onChange}
            placeholder="비밀번호 재입력"
            style={styles.input}
            autoComplete="new-password"
            required
          />
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? '처리 중…' : '회원가입'}
        </button>

        <p style={{ fontSize: 14, textAlign: 'center', marginTop: 12 }}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7f7f8',
    padding: 16,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
    display: 'grid',
    gap: 12,
  },
  label: { display: 'grid', gap: 6, fontSize: 14, fontWeight: 600 },
  input: {
    height: 40,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    height: 44,
    borderRadius: 10,
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: { color: '#d00', fontSize: 13, marginTop: 4 },
};