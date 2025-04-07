import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';
import '../styles/Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = form;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <div className="logo">
      <div className="text-sub">유리한 클래스</div> {/* ✅ 한 줄 추가 */}
  <div className="text--">메타 인지 클럽</div>
</div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">이메일</label>
          <div className="input-wrapper">
            <span className="icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소를 입력하세요"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">비밀번호</label>
          <div className="input-wrapper">
            <span className="icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit">로그인</button>
        </form>

        <div className="links">
          <a href="/find">아이디/비밀번호 찾기</a>
          <a href="/signup">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
