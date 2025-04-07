import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/global.scss';
import '../styles/basicquiz.scss';

const BasicQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', 'basic');

    if (!error && data) {
      const shuffled = data
        .map((q) => ({ value: q, rand: Math.random() }))
        .sort((a, b) => a.rand - b.rand)
        .map((q) => q.value);

      setQuestions(shuffled);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!questions.length || showAnswer) return;

    setTime(10);
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, questions.length, showAnswer]);

  const handleAnswer = (choiceIdx) => {
    if (showAnswer) return;
    const updated = [...answers];
    updated[current] = choiceIdx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowAnswer(false);
    } else {
      submitResult();
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setShowAnswer(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleQuit = async () => {
    const confirm = window.confirm('지금 종료하면 현재까지의 결과만 저장됩니다.');
    if (confirm) {
      await submitPartialResult();
      navigate('/dashboard');
    }
  };

  const submitPartialResult = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const total = answers.filter((a) => a !== undefined).length;
    const correct = questions
      .slice(0, total)
      .filter((q, idx) => q.correct_answer === answers[idx]).length;
    const score = total ? Math.round((correct / total) * 100) : 0;

    await supabase.from('quiz_results').insert([{
      user_id: user.id,
      quiz_id: 'basic',
      score,
      total,
      correct,
      is_complete: false,
      is_correct: false,
      answered_at: new Date().toISOString()
    }]);
  };

  const submitResult = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const total = questions.length;
    const correct = questions.filter((q, i) => q.correct_answer === answers[i]).length;
    const score = Math.round((correct / total) * 100);

    await supabase.from('quiz_results').insert([{
      user_id: user.id,
      quiz_id: 'basic',
      score,
      total,
      correct,
      is_complete: true,
      is_correct: score === 100,
      answered_at: new Date().toISOString()
    }]);

    alert(`퀴즈 완료! 점수: ${score}%`);
    navigate('/dashboard');
  };

  if (isLoading) return <div className="quiz-loading">문제를 불러오는 중...</div>;

  const q = questions[current];
  const isCorrect = answers[current] === q.correct_answer;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <button onClick={handleQuit}>그만 풀기</button>
          <button onClick={handleLogout} style={{ color: 'red' }}>로그아웃</button>
        </div>

        <h1>기초해부학 퀴즈</h1>

        {/* 게이지 */}
        <div style={{
          height: '10px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div
            style={{
              width: `${(time / 10) * 100}%`,
              height: '100%',
              background: time <= 3 ? '#ef4444' : '#3b82f6',
              transition: 'width 1s linear'
            }}
          />
        </div>

        <div className="quiz-card">
          <h2>문제 {current + 1} / {questions.length}</h2>
          <p className="question">{q.question}</p>
          <ul className="options">
            {q.options.map((opt, idx) => {
              let className = '';
              if (showAnswer) {
                if (idx === q.correct_answer) className = 'correct';
                else if (answers[current] === idx) className = 'wrong';
              } else if (answers[current] === idx) {
                className = 'selected';
              }

              return (
                <li
                  key={idx}
                  className={className}
                  onClick={() => handleAnswer(idx)}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </li>
              );
            })}
          </ul>

          {/* 정답 결과 */}
          {showAnswer && (
            <div className={`answer-result ${isCorrect ? 'correct' : 'wrong'}`}>
              {isCorrect ? '정답입니다! 🎉' : '오답입니다 😢'}
            </div>
          )}

          {/* 정답 해설 */}
          {showAnswer && q.explanation && (
            <div className="explanation-box">
              <strong>정답 해설:</strong>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-controls">
          {current > 0 && <button onClick={handleBack}>이전</button>}
          <button
            onClick={handleNext}
            className={
              showAnswer
                ? isCorrect
                  ? 'next-correct'
                  : 'next-wrong'
                : ''
            }
          >
            {!showAnswer
              ? '정답 확인'
              : current === questions.length - 1
              ? '제출'
              : '다음 문제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicQuiz;
