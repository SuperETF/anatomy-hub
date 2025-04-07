import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentHistory, setRecentHistory] = useState([]);
  const [quizStats, setQuizStats] = useState({
    total: 0,
    average: '0%',
    completed: 0
  });
  const [lastIncomplete, setLastIncomplete] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 이어풀기용: 마지막 도중 종료된 퀴즈 기록 확인
  const fetchLastIncompleteQuiz = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_id', 'basic')
      .eq('is_complete', false)
      .order('answered_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setLastIncomplete(data[0]);
    }
  };

  const fetchRecentQuizHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('answered_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      const mapped = data.map((item) => ({
        title: `${item.quiz_id} 퀴즈`,
        date: item.answered_at.split('T')[0],
        score: `${item.score}%`,
        detail: `${item.correct}/${item.total} 정답`,
        isComplete: item.is_complete
      }));
      setRecentHistory(mapped);
    }
  };

  const fetchQuizStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const total = data.length;
      const completed = data.filter(d => d.is_complete).length;
      const avg =
        total > 0
          ? `${Math.round(data.reduce((acc, cur) => acc + cur.score, 0) / total)}%`
          : '0%';

      setQuizStats({
        total,
        average: avg,
        completed
      });
    }
  };

  useEffect(() => {
    fetchRecentQuizHistory();
    fetchQuizStats();
    fetchLastIncompleteQuiz();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="top-row">
          <div className="logo">My Dashboard</div>
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>

        <div className="quiz-menu">
          <h2>퀴즈 메뉴</h2>
          <div className="quiz-buttons">
            {lastIncomplete ? (
              <button onClick={() => navigate('/basicquiz')}>기초해부학 이어서 풀기</button>
            ) : (
              <button onClick={() => navigate('/basicquiz')}>기초해부학 퀴즈</button>
            )}
            <button onClick={() => navigate('/quiz/functional')}>기능해부학 퀴즈</button>
            <button onClick={() => navigate('/quiz/neuro')}>신경해부학 퀴즈</button>
          </div>
        </div>

        <div className="statistics">
          <h2>학습 통계</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">총 퀴즈 수</div>
              <div className="value">{quizStats.total}</div>
            </div>
            <div className="stat-card">
              <div className="label">평균 점수</div>
              <div className="value">{quizStats.average}</div>
            </div>
            <div className="stat-card">
              <div className="label">완료한 퀴즈</div>
              <div className="value">{quizStats.completed}</div>
            </div>
          </div>
        </div>

        <div className="recent-history">
          <h2>최근 퀴즈 기록</h2>
          <div className="history-list">
            {recentHistory.length === 0 ? (
              <div className="no-history">아직 퀴즈 기록이 없습니다.</div>
            ) : (
              recentHistory
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((item, idx) => (
                  <div
                    className={`history-item ${item.isComplete ? '' : 'incomplete'}`}
                    key={idx}
                  >
                    <div className="info">
                      <div className="title">{item.title}</div>
                      <div className="date">{item.date}</div>
                    </div>
                    <div className="score">
                      <div className="percentage">{item.score}</div>
                      <div className="detail">{item.detail}</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
