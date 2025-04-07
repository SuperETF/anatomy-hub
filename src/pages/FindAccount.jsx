import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';
import '../styles/FindAccount.scss';

const FindAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFind = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('비밀번호 재설정 메일이 발송되었습니다. 메일함을 확인해주세요.');
    }
  };

  return (
    <div className="find-page">
      <div className="find-container">
        <h1>아이디 / 비밀번호 찾기</h1>
        <form onSubmit={handleFind}>
          <label>가입된 이메일 주소</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit">비밀번호 재설정 메일 보내기</button>
        </form>

        <button className="back-button" onClick={() => navigate('/login')}>
          ← 로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default FindAccount;