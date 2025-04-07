import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>비밀번호 재설정</h1>
        <form onSubmit={handleSubmit}>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit">비밀번호 변경</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
