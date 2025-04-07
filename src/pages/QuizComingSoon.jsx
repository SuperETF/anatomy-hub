import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.scss';
import '../styles/ComingSoon.scss';

const QuizComingSoon = ({ subject = '유 - 클 퀴즈' }) => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        <h1>{subject}는 현재 준비 중입니다 🛠</h1>
        <p>곧 업데이트 예정입니다. 조금만 기다려주세요!</p>
        <button onClick={() => navigate('/dashboard')}>대시보드로 돌아가기</button>
      </div>
    </div>
  );
};

export default QuizComingSoon;
