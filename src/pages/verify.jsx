import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.scss';
import '../styles/Verify.scss';

const Verify = () => {
  const navigate = useNavigate();

  return (
    <div className="verify-page">
      <div className="verify-container">
        <h1>이메일 인증이 필요합니다 📧</h1>
        <p>가입하신 이메일로 인증 메일이 전송되었습니다.</p>
        <p>메일함에서 링크를 클릭하시면 인증이 완료됩니다.</p>
        <p>인증 후 로그인하시면 대시보드로 이동됩니다.</p>

        <button className="login-button" onClick={() => navigate('/login')}>
          로그인으로 이동하기
        </button>
      </div>
    </div>
  );
};

export default Verify;